import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {validateImage} from '../src/profile.js';
import {PROFILE_SCRIPT} from '../src/profile-client.js';
import {database} from './local-db.js';

test('WebP validates lossy, lossless and alpha dimensions, rejects MIME spoofing and truncated containers',async()=>{
 for(const kind of ['lossy','alpha','lossless']) {
  const bytes=new Uint8Array(await readFile(`test/fixtures/profile-${kind}.webp`));
  assert.deepEqual(validateImage(bytes,'image/webp'),{mime:'image/webp',width:16,height:12});
  assert.throws(()=>validateImage(bytes,'image/png'),{status:422});
  assert.throws(()=>validateImage(bytes.slice(0,-1),'image/webp'),{status:422});
 }
 const alpha=new Uint8Array(await readFile('test/fixtures/profile-alpha.webp'));alpha[20]|=2;
 assert.throws(()=>validateImage(alpha,'image/webp'),{status:422});
});

test('browser uploader resizes and encodes WebP before native form submission',async()=>{
 let listener,submitted=false,closed=false;const sizes=[],qualities=[];
 const input={files:[new File(['test'],'photo.png',{type:'image/png'})]},button={},message={};
 const canvas={getContext:()=>({drawImage:(_bitmap,_x,_y,w,h)=>sizes.push([w,h])}),toBlob:(callback,type,quality)=>{qualities.push(quality);callback(new Blob([new Uint8Array(quality>0.8?140000:1000)],{type}));}};
 const form={querySelector:selector=>selector==='input[name="avatar"]'?input:selector.includes('button')?button:null,addEventListener:(_event,handler)=>{listener=handler;}};
 class Transfer {constructor(){this.files=[];this.items={add:file=>this.files.push(file)};}}
 runInNewContext(PROFILE_SCRIPT,{document:{querySelector:()=>form,getElementById:()=>message,createElement:()=>canvas},createImageBitmap:async()=>({width:2048,height:1024,close:()=>{closed=true;}}),DataTransfer:Transfer,File,Blob,HTMLFormElement:{prototype:{submit(){submitted=true;}}}});
 await listener({preventDefault(){}});
 assert.deepEqual(sizes,[[512,256]]);assert.deepEqual(qualities,[0.86,0.72]);assert.equal(input.files[0].type,'image/webp');assert.equal(input.files[0].name,'profile.webp');assert.equal(submitted,true);assert.equal(closed,true);
});

test('WebP migration preserves existing profile data and permits WebP storage',async()=>{
 const db=database(await readFile('migrations/0002_admin_profiles.sql','utf8'));
 try {
  await db.prepare("INSERT INTO admin_profiles VALUES ('owner','Original','png-data','image/png',1)").run();
  // Adapter intentionally exposes only SQL statements; run the migration transaction in order.
  const sql=(await readFile('migrations/0003_profile_webp.sql','utf8')).replace(/--[^\n]*/g,'');
  await db.batch(sql.split(';').map(x=>x.trim()).filter(Boolean).map(x=>db.prepare(x)));
  assert.equal(await db.prepare("SELECT display_name FROM admin_profiles WHERE access_subject='owner'").first('display_name'),'Original');
  await db.prepare("UPDATE admin_profiles SET avatar_mime='image/webp' WHERE access_subject='owner'").run();
 } finally {db.close();}
});
