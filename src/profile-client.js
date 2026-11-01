// Runs on Settings with a per-response CSP nonce. No network requests or external code.
export const PROFILE_SCRIPT = String.raw`
(() => {
  const form = document.querySelector('#profile form');
  if (!form) return;
  const input = form.querySelector('input[name="avatar"]');
  const message = document.getElementById('profile-upload-status');
  const button = form.querySelector('button[type="submit"]');
  let busy = false;

  // Wire Change photo and camera trigger buttons
  const uploadBtn = document.getElementById('btn-upload-avatar');
  const cameraBtn = document.getElementById('btn-camera-trigger');
  const removeBtn = document.getElementById('btn-remove-avatar');
  const removeCheckbox = form.querySelector('input[name="remove_avatar"]');
  const preview = document.getElementById('avatar-squircle-preview');

  function updatePreviewImage(src) {
    if (!preview || preview.innerHTML === undefined) return;
    preview.innerHTML = '<img src="' + src + '" alt="Profile preview" style="width:100%;height:100%;object-fit:cover;display:block;">';
    const topAvatar = document.querySelector('.profilelink .avatar');
    if (topAvatar) {
      topAvatar.innerHTML = '<img src="' + src + '" alt="Profile preview" style="width:100%;height:100%;object-fit:cover;display:block;">';
    }
  }

  function triggerPicker() {
    if (input && typeof input.click === 'function') input.click();
  }

  if (uploadBtn && typeof uploadBtn.addEventListener === 'function') {
    uploadBtn.addEventListener('click', triggerPicker);
  }
  if (cameraBtn && typeof cameraBtn.addEventListener === 'function') {
    cameraBtn.addEventListener('click', triggerPicker);
  }
  if (preview && typeof preview.addEventListener === 'function') {
    preview.addEventListener('click', triggerPicker);
  }

  // Restore instant preview if saved recently
  try {
    const cachedPreview = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('neomail_preview_avatar') : null;
    if (cachedPreview && preview && preview.innerHTML !== undefined && !preview.querySelector?.('img')) {
      if (typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('notice=Profile')) {
        updatePreviewImage(cachedPreview);
        if (removeBtn && removeBtn.style) removeBtn.style.display = 'inline-flex';
      }
    }
  } catch {}

  if (removeBtn && typeof removeBtn.addEventListener === 'function' && removeCheckbox) {
    removeBtn.addEventListener('click', () => {
      removeCheckbox.checked = true;
      if (input) input.value = '';
      try {
        if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('neomail_preview_avatar');
      } catch {}
      if (preview && preview.innerHTML !== undefined) {
        preview.innerHTML = '<span style="font-size:26px;font-weight:700;color:var(--accent)">A</span>';
      }
      const topAvatar = document.querySelector('.profilelink .avatar');
      if (topAvatar) {
        topAvatar.innerHTML = 'A';
      }
      if (removeBtn.style) removeBtn.style.display = 'none';
      if (message) message.textContent = 'Current photo will be removed when saved.';
    });
  }

  async function compressImage(file) {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      throw Error('Choose a PNG, JPEG or WebP image.');
    }
    if (file.size > 8 * 1024 * 1024) throw Error('Choose an image smaller than 8 MiB.');
    if (form.querySelector('[name="remove_avatar"]:checked')) {
      throw Error('Choose either uploading or removing your image.');
    }
    if (message) message.textContent = 'Optimizing your image…';
    const bitmap = await createImageBitmap(file);
    try {
      if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 16777216) {
        throw Error('Choose an image up to 16 megapixels.');
      }
      const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw Error('Image processing is unavailable in this browser.');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      let compressed;
      for (const quality of [0.86, 0.72, 0.55]) {
        compressed = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
        if (!compressed || compressed.type !== 'image/webp') {
          throw Error('This browser cannot encode WebP. Try a current browser.');
        }
        if (compressed.size <= 131072) break;
      }
      if (compressed.size > 131072) {
        throw Error('The compressed image is too large. Choose a simpler image.');
      }
      const files = new DataTransfer();
      files.items.add(new File([compressed], 'profile.webp', { type: 'image/webp' }));
      input.files = files.files;

      // Update preview immediately with optimized WebP
      if (typeof URL !== 'undefined' && URL.createObjectURL) {
        const url = URL.createObjectURL(compressed);
        updatePreviewImage(url);
      }
      if (typeof FileReader !== 'undefined') {
        const fr = new FileReader();
        fr.onload = () => {
          if (fr.result) {
            updatePreviewImage(fr.result);
            try { sessionStorage.setItem('neomail_preview_avatar', fr.result); } catch {}
          }
        };
        fr.readAsDataURL(compressed);
      }

      if (removeCheckbox) removeCheckbox.checked = false;
      if (removeBtn && removeBtn.style) removeBtn.style.display = 'inline-flex';
      if (message) message.textContent = 'Photo optimized (' + Math.round(compressed.size / 1024) + ' KiB). Ready to save.';
      return compressed;
    } finally {
      bitmap?.close?.();
    }
  }

  if (input && typeof input.addEventListener === 'function') {
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
        if (removeBtn && removeBtn.style) removeBtn.style.display = 'inline-flex';
        if (removeCheckbox) removeCheckbox.checked = false;
      }
      try {
        busy = true;
        if (button) button.disabled = true;
        await compressImage(rawFile);
      } catch (err) {
        if (message) message.textContent = err.message || 'Could not process image.';
      } finally {
        busy = false;
        if (button) button.disabled = false;
      }
    });
  }

  form.addEventListener('submit', async event => {
    if (busy) { event.preventDefault?.(); return; }
    const file = input?.files?.[0];

    // Clear SPA local cache so all pages immediately show the updated profile photo
    try {
      if (typeof localStorage !== 'undefined') {
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('neomail_spa_')) localStorage.removeItem(k);
        });
      }
    } catch {}

    if (!file) return;
    if (file.name === 'profile.webp' && file.type === 'image/webp' && file.size <= 131072) {
      return;
    }
    event.preventDefault?.();
    busy = true;
    if (button) button.disabled = true;
    try {
      await compressImage(file);
      if (message) message.textContent = 'Image optimized. Saving profile…';
      HTMLFormElement.prototype.submit.call(form);
    } catch (error) {
      if (message) message.textContent = error.message || 'Could not process this image. Please choose another.';
      busy = false;
      if (button) button.disabled = false;
    }
  });
})();
`;
