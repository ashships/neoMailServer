// Client-side SPA navigation, AES-GCM encrypted local cache (~0ms load),
// and partial main workspace refreshing. Runs with strict per-response CSP nonce.
export const SPA_CLIENT_SCRIPT = String.raw`
(() => {
  const ENC_KEY_STORAGE = 'neomail_enc_k';
  let cachedKey = null;

  async function getCryptoKey() {
    if (cachedKey) return cachedKey;
    try {
      let rawHex = sessionStorage.getItem(ENC_KEY_STORAGE);
      if (!rawHex || rawHex.length !== 64) {
        const randBytes = crypto.getRandomValues(new Uint8Array(32));
        rawHex = Array.from(randBytes, b => b.toString(16).padStart(2, '0')).join('');
        sessionStorage.setItem(ENC_KEY_STORAGE, rawHex);
      }
      const rawBytes = new Uint8Array(rawHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      cachedKey = await crypto.subtle.importKey('raw', rawBytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
      return cachedKey;
    } catch {
      return null;
    }
  }

  async function encryptPayload(text) {
    try {
      const key = await getCryptoKey();
      if (!key) return null;
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(text);
      const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
      const cipherArr = new Uint8Array(ciphertext);
      const combined = new Uint8Array(iv.length + cipherArr.length);
      combined.set(iv, 0);
      combined.set(cipherArr, iv.length);
      let binary = '';
      const chunk = 8192;
      for (let i = 0; i < combined.length; i += chunk) {
        binary += String.fromCharCode.apply(null, combined.subarray(i, i + chunk));
      }
      return btoa(binary);
    } catch {
      return null;
    }
  }

  async function decryptPayload(b64) {
    try {
      const key = await getCryptoKey();
      if (!key || !b64) return null;
      const binary = atob(b64);
      const combined = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) combined[i] = binary.charCodeAt(i);
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
      return new TextDecoder().decode(decrypted);
    } catch {
      return null;
    }
  }

  function getCacheKey(pathname) {
    return 'neomail_spa_' + pathname.replace(/\/$/, '');
  }

  async function cacheView(pathname, mainHtml, title, crumbHtml) {
    const payload = JSON.stringify({
      main: mainHtml,
      title: title || document.title,
      crumb: crumbHtml || '',
      ts: Date.now()
    });
    const encrypted = await encryptPayload(payload);
    if (encrypted) {
      try {
        localStorage.setItem(getCacheKey(pathname), encrypted);
      } catch {}
    }
  }

  async function getCachedView(pathname) {
    try {
      const raw = localStorage.getItem(getCacheKey(pathname));
      if (!raw) return null;
      const decrypted = await decryptPayload(raw);
      if (!decrypted) return null;
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  function updateActiveNav(pathname) {
    const norm = pathname.replace(/\/$/, '') || '/admin';
    const navLinks = document.querySelectorAll('.sidebar nav a.navlink');
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPath = href.split('?')[0].replace(/\/$/, '');
      const linkView = (new URL(link.href, window.location.origin)).searchParams.get('view');
      const isMatch = linkPath === norm || (linkView && norm.endsWith('/' + linkView));
      if (isMatch) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function setProgress(state) {
    let bar = document.getElementById('spa-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'spa-progress';
      document.body.appendChild(bar);
    }
    if (state === 'loading') {
      bar.className = 'loading';
    } else if (state === 'done') {
      bar.className = 'done';
      setTimeout(() => { if (bar.className === 'done') bar.className = ''; }, 300);
    } else {
      bar.className = '';
    }
  }

  async function navigate(url, pushState = true, forceRefresh = false) {
    const pathname = url.pathname;
    const mainEl = document.getElementById('app-main') || document.querySelector('main');
    if (!mainEl) {
      window.location.href = url.href;
      return;
    }

    setProgress('loading');

    // 1. Instant Cache Swap (~0ms) if available
    let renderedCached = false;
    if (!forceRefresh) {
      const cached = await getCachedView(pathname);
      if (cached && cached.main) {
        mainEl.innerHTML = cached.main;
        if (cached.title) document.title = cached.title;
        const crumbEl = document.querySelector('.crumb');
        if (crumbEl && cached.crumb) crumbEl.innerHTML = cached.crumb;
        updateActiveNav(pathname);
        initPageEnhancements();
        renderedCached = true;
        if (pushState) history.pushState({ path: pathname }, '', url.href);
      }
    }

    // 2. Fetch fresh content from server
    try {
      const res = await fetch(url.href, {
        headers: { 'X-Requested-With': 'neoMail-SPA' },
        cache: 'no-cache'
      });
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
      if (!res.ok) {
        if (!renderedCached) window.location.href = url.href;
        return;
      }
      const htmlText = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const newMain = doc.getElementById('app-main') || doc.querySelector('main');
      if (newMain) {
        mainEl.innerHTML = newMain.innerHTML;
        if (doc.title) document.title = doc.title;
        const newCrumb = doc.querySelector('.crumb');
        const crumbEl = document.querySelector('.crumb');
        if (newCrumb && crumbEl) crumbEl.innerHTML = newCrumb.innerHTML;
        updateActiveNav(pathname);
        initPageEnhancements();
        if (pushState && !renderedCached) history.pushState({ path: pathname }, '', url.href);
        await cacheView(pathname, newMain.innerHTML, doc.title, newCrumb ? newCrumb.innerHTML : '');
      } else {
        if (!renderedCached) window.location.href = url.href;
      }
    } catch (err) {
      if (!renderedCached) window.location.href = url.href;
    } finally {
      setProgress('done');
    }
  }

  // Intercept click on links for SPA navigation & partial refreshes
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    if (href.includes('/logout') || href.includes('/preview') || href.includes('/profile-image')) return;

    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    if (!url.pathname.startsWith('/admin') && !url.pathname.startsWith('/dashboard')) return;

    // Is this a partial refresh button or link to current page?
    const isCurrentPage = url.pathname === window.location.pathname && (url.search === window.location.search || link.classList.contains('spa-refresh-btn'));

    e.preventDefault();
    navigate(url, !isCurrentPage, isCurrentPage);
  });

  // Handle browser back / forward
  window.addEventListener('popstate', () => {
    navigate(new URL(window.location.href), false, false);
  });

  // Dark mode toggle listener
  try {
    const cb = document.getElementById('theme-toggle');
    const t = localStorage.getItem('neomail_theme');
    if (t === 'dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      if (cb) cb.checked = true;
    }
    if (cb) {
      cb.addEventListener('change', e => {
        const isDark = e.target.checked;
        localStorage.setItem('neomail_theme', isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        document.cookie = 'neomail_theme=' + (isDark ? 'dark' : 'light') + '; path=/; max-age=31536000; SameSite=Lax';
      });
    }
  } catch {}

  // Initialize dynamic page behaviors
  function initProfileUploader() {
    const form = document.querySelector('#profile form');
    if (!form || form.dataset.spaBound) return;
    form.dataset.spaBound = '1';
    const input = form.querySelector('input[name="avatar"]');
    const message = document.getElementById('profile-upload-status');
    const button = form.querySelector('button[type="submit"]');
    const uploadBtn = document.getElementById('btn-upload-avatar');
    const cameraBtn = document.getElementById('btn-camera-trigger');
    const removeBtn = document.getElementById('btn-remove-avatar');
    const removeCheckbox = form.querySelector('input[name="remove_avatar"]');
    const preview = document.getElementById('avatar-squircle-preview');

    function updatePreviewImage(src) {
      if (!preview) return;
      preview.innerHTML = '<img src="' + src + '" alt="Profile preview" style="width:100%;height:100%;object-fit:cover;display:block;">';
      const topAvatar = document.querySelector('.profilelink .avatar');
      if (topAvatar) {
        topAvatar.innerHTML = '<img src="' + src + '" alt="Profile preview" style="width:100%;height:100%;object-fit:cover;display:block;">';
      }
      if (src && typeof src === 'string' && src.startsWith('blob:')) {
        const blobRow = document.getElementById('profile-blob-url-row');
        const blobText = document.getElementById('profile-blob-url-text');
        const copyBtn = document.getElementById('btn-copy-profile-blob');
        if (blobRow && blobText) {
          blobRow.style.display = 'inline-flex';
          blobText.textContent = src;
          blobText.title = src;
          if (copyBtn && !copyBtn.dataset.bound) {
            copyBtn.dataset.bound = '1';
            copyBtn.addEventListener('click', () => {
              if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(src).then(() => {
                  copyBtn.textContent = 'Copied!';
                  setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
                });
              }
            });
          }
        }
      }
    }

    function triggerPicker() {
      if (input) input.click();
    }

    if (uploadBtn) uploadBtn.addEventListener('click', triggerPicker);
    if (cameraBtn) cameraBtn.addEventListener('click', triggerPicker);
    if (preview) preview.addEventListener('click', triggerPicker);

    // Restore instant preview if saved recently
    try {
      const cachedPreview = sessionStorage.getItem('neomail_preview_avatar');
      if (cachedPreview && preview && !preview.querySelector('img')) {
        if (window.location.search.includes('notice=Profile')) {
          updatePreviewImage(cachedPreview);
          if (removeBtn) removeBtn.style.display = 'inline-flex';
        }
      }
    } catch {}

    if (removeBtn && removeCheckbox) {
      removeBtn.addEventListener('click', () => {
        removeCheckbox.checked = true;
        if (input) input.value = '';
        try { sessionStorage.removeItem('neomail_preview_avatar'); } catch {}
        if (preview) preview.innerHTML = '<span style="font-size:26px;font-weight:700;color:var(--accent)">A</span>';
        const topAvatar = document.querySelector('.profilelink .avatar');
        if (topAvatar) topAvatar.innerHTML = 'A';
        removeBtn.style.display = 'none';
        if (message) message.textContent = 'Current photo will be removed when saved.';
      });
    }

    async function compressImageFile(file) {
      if (!file) return;
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        throw new Error('Choose a JPG, PNG or WebP image.');
      }
      if (file.size > 8 * 1024 * 1024) throw new Error('Choose an image smaller than 8 MiB.');
      if (message) message.textContent = 'Optimizing and converting image to WebP…';
      const bitmap = await createImageBitmap(file);
      try {
        const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        let blob;
        for (const q of [0.86, 0.72, 0.55]) {
          blob = await new Promise(res => canvas.toBlob(res, 'image/webp', q));
          if (blob && blob.size <= 131072) break;
        }
        if (!blob || blob.size > 131072) throw new Error('Image too large. Please choose a simpler image.');
        const dt = new DataTransfer();
        dt.items.add(new File([blob], 'profile.webp', { type: 'image/webp' }));
        input.files = dt.files;

        if (typeof URL !== 'undefined' && URL.createObjectURL) {
          updatePreviewImage(URL.createObjectURL(blob));
        }
        if (typeof FileReader !== 'undefined') {
          const fr = new FileReader();
          fr.onload = () => {
            if (fr.result) {
              updatePreviewImage(fr.result);
              try { sessionStorage.setItem('neomail_preview_avatar', fr.result); } catch {}
            }
          };
          fr.readAsDataURL(blob);
        }

        if (removeCheckbox) removeCheckbox.checked = false;
        if (removeBtn) removeBtn.style.display = 'inline-flex';
        if (message) message.textContent = 'Photo optimized (' + Math.round(blob.size / 1024) + ' KiB). Ready to save.';
      } finally {
        bitmap?.close?.();
      }
    }

    if (input) {
      input.addEventListener('change', async () => {
        if (!input.files || !input.files[0]) return;
        const rawFile = input.files[0];
        // 0ms instant preview when file is selected
        if (rawFile && rawFile.type && rawFile.type.startsWith('image/')) {
          if (typeof URL !== 'undefined' && URL.createObjectURL) {
            updatePreviewImage(URL.createObjectURL(rawFile));
          }
          if (typeof FileReader !== 'undefined') {
            const fr = new FileReader();
            fr.onload = () => {
              if (fr.result) {
                updatePreviewImage(fr.result);
                try { sessionStorage.setItem('neomail_preview_avatar', fr.result); } catch {}
              }
            };
            fr.readAsDataURL(rawFile);
          }
          if (removeBtn) removeBtn.style.display = 'inline-flex';
          if (removeCheckbox) removeCheckbox.checked = false;
        }
        try {
          if (button) button.disabled = true;
          await compressImageFile(rawFile);
        } catch (err) {
          if (message) message.textContent = err.message || 'Image processing failed.';
        } finally {
          if (button) button.disabled = false;
        }
      });
    }

    form.addEventListener('submit', async ev => {
      const file = input?.files?.[0];

      // Clear SPA local cache so all pages immediately show the updated profile photo
      try {
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('neomail_spa_')) localStorage.removeItem(k);
        });
      } catch {}

      if (!file || (file.name === 'profile.webp' && file.size <= 131072)) return;
      ev.preventDefault();
      try {
        if (button) button.disabled = true;
        await compressImageFile(file);
        HTMLFormElement.prototype.submit.call(form);
      } catch (err) {
        if (message) message.textContent = err.message || 'Optimization failed.';
        if (button) button.disabled = false;
      }
    });
  }

  function initPageEnhancements() {
    initProfileUploader();
  }

  // Cache current view immediately on initial render
  const initialMain = document.getElementById('app-main') || document.querySelector('main');
  const initialCrumb = document.querySelector('.crumb');
  if (initialMain) {
    cacheView(window.location.pathname, initialMain.innerHTML, document.title, initialCrumb ? initialCrumb.innerHTML : '');
  }
  initPageEnhancements();

  // Download and cache fonts into localStorage as base64 data URIs so on every refresh they load instantly (0ms)
  async function cacheFontsLocally() {
    try {
      if (localStorage.getItem('neomail_font_css')) return;
      const pjsUrl = 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2';
      const jbmUrl = 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwgknk-6nFg.woff2';
      const [r1, r2] = await Promise.all([fetch(pjsUrl), fetch(jbmUrl)]);
      if (!r1.ok || !r2.ok) return;
      const [b1, b2] = await Promise.all([r1.arrayBuffer(), r2.arrayBuffer()]);

      function bufToB64(buf) {
        const u8 = new Uint8Array(buf);
        let bin = '';
        const chunk = 8192;
        for (let i = 0; i < u8.length; i += chunk) {
          bin += String.fromCharCode.apply(null, u8.subarray(i, i + chunk));
        }
        return btoa(bin);
      }

      const pjsB64 = bufToB64(b1);
      const jbmB64 = bufToB64(b2);

      const fontCss = '@font-face{font-family:\'Plus Jakarta Sans\';font-style:normal;font-weight:300 800;font-display:block;src:url(data:font/woff2;base64,' + pjsB64 + ') format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}' +
        '@font-face{font-family:\'JetBrains Mono\';font-style:normal;font-weight:400 600;font-display:block;src:url(data:font/woff2;base64,' + jbmB64 + ') format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}';

      localStorage.setItem('neomail_font_css', fontCss);
      if (!document.getElementById('neomail-fonts-cached')) {
        const s = document.createElement('style');
        s.id = 'neomail-fonts-cached';
        s.textContent = fontCss;
        document.head.appendChild(s);
      }
    } catch (e) {}
  }
  cacheFontsLocally();
})();
`;
