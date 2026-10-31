import { HttpError, text, base64, bytes64, headers } from './security.js';
export const MAX_AVATAR_BYTES = 131072;
export async function profileForm(request) {
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) throw new HttpError(415, 'Expected an image upload form.');
  // Read bytes with a strict limit before invoking the multipart parser.
  const raw = await readBytes(request, MAX_AVATAR_BYTES + 16384);
  return new Response(raw, {headers:{'Content-Type':request.headers.get('content-type')}}).formData();
}
async function readBytes(request, max) {
  if (+request.headers.get('content-length') > max) throw new HttpError(413, 'Profile upload too large. Use an image under 128 KiB.');
  const reader=request.body?.getReader(); if(!reader) throw new HttpError(400,'Missing upload.');
  const chunks=[];let length=0;
  try { for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>max){await reader.cancel();throw new HttpError(413,'Profile upload too large. Use an image under 128 KiB.');}chunks.push(value);} }finally{reader.releaseLock();}
  const result=new Uint8Array(length);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return result;
}
export function validateImage(bytes, mime) {
  if (!bytes.length || bytes.length > MAX_AVATAR_BYTES) throw new HttpError(413, 'Use an image under 128 KiB.');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength); let width=0,height=0;
  if(mime==='image/png' && bytes.length>=33 && [137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b) && view.getUint32(8)===13 && view.getUint32(12)===0x49484452) {
    width=view.getUint32(16);height=view.getUint32(20);
  } else if(mime==='image/jpeg' && bytes[0]===255 && bytes[1]===216) {
    let i=2;
    while(i+4<=bytes.length){
      if(bytes[i++]!==255)break;while(bytes[i]===255)i++;const marker=bytes[i++];
      if(marker===217||marker===218)break;if(marker===216||marker===1||(marker>=208&&marker<=215))continue;
      if(i+2>bytes.length)break;const length=view.getUint16(i);if(length<2||i+length>bytes.length)break;
      if([192,193,194].includes(marker)&&length>=8){height=view.getUint16(i+3);width=view.getUint16(i+5);break;}i+=length;
    }
  }
  if(mime==='image/webp' && bytes.length>=20 && view.getUint32(0)===0x52494646 && view.getUint32(8)===0x57454250 && view.getUint32(4,true)+8===bytes.length) {
    let i=12,extendedWidth=0,extendedHeight=0;
    while(i+8<=bytes.length){
      const tag=view.getUint32(i),size=view.getUint32(i+4,true),start=i+8;
      if(size>bytes.length-start)throw new HttpError(422,'Invalid WebP chunk.');
      if(tag===0x414e494d||tag===0x414e4d46)throw new HttpError(422,'Animated WebP is not supported.');
      if(tag===0x56503858){
        if(size!==10||(bytes[start]&2))throw new HttpError(422,'Invalid or animated WebP.');
        extendedWidth=1+bytes[start+4]+(bytes[start+5]<<8)+(bytes[start+6]<<16);
        extendedHeight=1+bytes[start+7]+(bytes[start+8]<<8)+(bytes[start+9]<<16);
      } else if(tag===0x56503820&&size>=10&&bytes[start+3]===0x9d&&bytes[start+4]===1&&bytes[start+5]===0x2a&&!(bytes[start]&1)) {
        width=view.getUint16(start+6,true)&0x3fff;height=view.getUint16(start+8,true)&0x3fff;
      } else if(tag===0x5650384c&&size>=5&&bytes[start]===0x2f) {
        const bits=view.getUint32(start+1,true);if(bits>>>29)throw new HttpError(422,'Unsupported WebP bitstream.');
        width=(bits&0x3fff)+1;height=((bits>>>14)&0x3fff)+1;
      }
      i=start+size+(size%2);
    }
    if(i!==bytes.length||(extendedWidth&&(width!==extendedWidth||height!==extendedHeight)))throw new HttpError(422,'Invalid WebP dimensions.');
  }
  if(!width||!height||width>4096||height>4096||width*height>4194304) throw new HttpError(422,'Upload a valid PNG, JPEG or WebP up to 4096 pixels per side and 4 megapixels. SVG and animated formats are not supported.');
  return {mime,width,height};
}
export async function getProfile(env, subject) {
  try {
    return await env.DB.prepare('SELECT display_name,avatar_mime,updated_at FROM admin_profiles WHERE access_subject=?').bind(subject).first() || {display_name:'Administrator',avatar_mime:null,updated_at:0};
  } catch {
    return {display_name:'Administrator',avatar_mime:null,updated_at:0};
  }
}
export async function saveProfile(env, subject, data) {
 const name=text(data.get('display_name'),80);const image=data.get('avatar');const remove=data.get('remove_avatar')==='yes';
 let avatar=null,mime=null;
 if(image && typeof image!=='string' && image.size){
  if(remove)throw new HttpError(422,'Choose either replacing or removing your image.');
  if(image.size>MAX_AVATAR_BYTES)throw new HttpError(413,'Use an image under 128 KiB.');
  const bytes=new Uint8Array(await image.arrayBuffer());mime=validateImage(bytes,image.type).mime;avatar=base64(bytes);
 }
 const changed=!!avatar||remove;
 await env.DB.prepare(`INSERT INTO admin_profiles(access_subject,display_name,avatar_data,avatar_mime,updated_at) VALUES (?,?,?,?,?)
 ON CONFLICT(access_subject) DO UPDATE SET display_name=excluded.display_name,
 avatar_data=CASE WHEN ? THEN excluded.avatar_data ELSE admin_profiles.avatar_data END,
 avatar_mime=CASE WHEN ? THEN excluded.avatar_mime ELSE admin_profiles.avatar_mime END,updated_at=excluded.updated_at`)
 .bind(subject,name,avatar,mime,Date.now(),changed?1:0,changed?1:0).run();
 return {imageChanged:changed};
}
export async function profileImage(env, subject) {
 const row=await env.DB.prepare('SELECT avatar_data,avatar_mime FROM admin_profiles WHERE access_subject=?').bind(subject).first();
 if(!row?.avatar_data)throw new HttpError(404,'No profile image uploaded.');
 return new Response(bytes64(row.avatar_data),{headers:{...headers,'Content-Type':row.avatar_mime,'Cache-Control':'public, max-age=3600, immutable','Content-Disposition':'inline; filename="profile.'+(row.avatar_mime==='image/png'?'png':row.avatar_mime==='image/webp'?'webp':'jpg')+'"'}});
}
