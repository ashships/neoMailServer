// Runs only on Settings with a per-response CSP nonce. No network requests or external code.
export const PROFILE_SCRIPT = String.raw`
(() => {
 const form=document.querySelector('#profile form'); if(!form)return;
 const input=form.querySelector('input[name="avatar"]');
 const message=document.getElementById('profile-upload-status');
 const button=form.querySelector('button[type="submit"]');
 let busy=false;
 form.addEventListener('submit',async event=>{
  if(busy){event.preventDefault();return;}
  const file=input.files[0]; if(!file)return;
  event.preventDefault();busy=true;button.disabled=true;
  let bitmap;
  try {
   if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Choose a PNG, JPEG or WebP image.');
   if(file.size>8*1024*1024)throw Error('Choose an image smaller than 8 MiB.');
   if(form.querySelector('[name="remove_avatar"]:checked'))throw Error('Choose either uploading or removing your image.');
   message.textContent='Optimizing your image…';
   bitmap=await createImageBitmap(file);
   if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>16777216)throw Error('Choose an image up to 16 megapixels.');
   const scale=Math.min(1,512/Math.max(bitmap.width,bitmap.height));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
   const context=canvas.getContext('2d');if(!context)throw Error('Image processing is unavailable in this browser.');
   context.drawImage(bitmap,0,0,canvas.width,canvas.height);
   let compressed;
   for(const quality of [0.86,0.72,0.55]) {
    compressed=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
    if(!compressed||compressed.type!=='image/webp')throw Error('This browser cannot encode WebP. Try a current browser.');
    if(compressed.size<=131072)break;
   }
   if(compressed.size>131072)throw Error('The compressed image is too large. Choose a simpler image.');
   const files=new DataTransfer();files.items.add(new File([compressed],'profile.webp',{type:'image/webp'}));input.files=files.files;
   message.textContent='Image optimized. Saving profile…';
   HTMLFormElement.prototype.submit.call(form);
  } catch(error) {message.textContent=error.message||'Could not process this image. Please choose another.';busy=false;button.disabled=false;}
  finally {bitmap?.close();}
 });
})();
`;
