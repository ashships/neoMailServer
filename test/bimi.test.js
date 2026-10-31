import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateSetting,SETTINGS} from '../src/config.js';
import {settings} from '../src/ui.js';
test('BIMI settings reject unsafe URLs and show unverified DNS instructions only with real URLs',()=>{
 for(const value of ['http://logo.example/logo.svg','https://user:password@logo.example/logo.svg','https://logo.example/logo.svg; a=https://evil.example','javascript:alert(1)','https://logo.example/logo.svg#fragment']) assert.throws(()=>validateSetting('BIMI_LOGO_URL',value),{status:422});
 assert.equal(validateSetting('BIMI_LOGO_URL',''),'');
 const cfg=Object.fromEntries(Object.entries(SETTINGS).map(([k,v])=>[k,v[2]]));
 const sess={csrf_token:'test',profile:{display_name:'Owner'}};
 assert.ok(settings(cfg,sess).includes('No publishable record yet'));
 cfg.BIMI_LOGO_URL='https://your-worker-domain.com/brand/logo.svg';cfg.BIMI_CERTIFICATE_URL='https://your-worker-domain.com/brand/certificate.pem';
 const html=settings(cfg,sess);assert.ok(html.includes('default._bimi.your-worker-domain.com'));assert.ok(html.includes('v=BIMI1; l='+cfg.BIMI_LOGO_URL+'; a='+cfg.BIMI_CERTIFICATE_URL+';'));assert.ok(html.includes('URLs configured · Unverified'));
});
