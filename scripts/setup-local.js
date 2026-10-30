import { readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
const path = new URL('../.dev.vars', import.meta.url);
let source = ''; try { source = readFileSync(path, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
function get(name) { const match=source.match(new RegExp('^'+name+'\\s*=\\s*["\']?([^"\'\\r\\n]+)["\']?\\s*$', 'm')); return match?.[1]?.trim() || ''; }
function put(name,value) { const line=`${name}="${value}"`; const re=new RegExp('^'+name+'\\s*=.*$','m'); source=re.test(source)?source.replace(re,line):source+'\n'+line+'\n'; }
let token=get('LOCAL_ADMIN_TOKEN'); if(!/^[A-Za-z0-9_-]{43,128}$/.test(token)) {token=randomBytes(32).toString('base64url');put('LOCAL_ADMIN_TOKEN',token);}
if(!get('CONFIG_ENCRYPTION_KEY')) put('CONFIG_ENCRYPTION_KEY',randomBytes(32).toString('base64'));
put('LOCAL_DEV','true'); writeFileSync(path,source,{mode:0o600}); chmodSync(path,0o600);
if(!process.argv.includes('--quiet')) {
 console.log('Local HTTP testing: http://localhost:8787/admin');
 console.log('Local administrator token (development only):\n'+token);
 console.log('This token is accepted only on loopback HTTP; production credentials are unchanged.');
}
