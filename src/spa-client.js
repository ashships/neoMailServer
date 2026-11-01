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

    // Refresh animation on buttons
    const refreshButtons = document.querySelectorAll('.spa-refresh-btn, .button.secondary[href*="view="], a[href$="' + pathname + '"]');
    refreshButtons.forEach(btn => btn.classList.add('refreshing'));

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
        if (pushState && !renderedCached) history.pushState({ path: pathname }, '', url.href);
        await cacheView(pathname, newMain.innerHTML, doc.title, newCrumb ? newCrumb.innerHTML : '');
      } else {
        if (!renderedCached) window.location.href = url.href;
      }
    } catch (err) {
      if (!renderedCached) window.location.href = url.href;
    } finally {
      setProgress('done');
      refreshButtons.forEach(btn => btn.classList.remove('refreshing'));
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

  // Cache current view immediately on initial render
  const initialMain = document.getElementById('app-main') || document.querySelector('main');
  const initialCrumb = document.querySelector('.crumb');
  if (initialMain) {
    cacheView(window.location.pathname, initialMain.innerHTML, document.title, initialCrumb ? initialCrumb.innerHTML : '');
  }
})();
`;
