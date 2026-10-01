import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile);
const args=['--profile',process.env.ZAP_AEGIS_PROFILE??'zapjs-check','--server-addr',process.env.ZAP_AEGIS_ADDRESS??'127.0.0.1:7897'];
const runId=String(Date.now());
await run('aegis',[...args,'navigate','http://127.0.0.1:4330/__verification?run='+runId],{timeout:20000});
const deadline=Date.now()+90000;
let last;
while(Date.now()<deadline){
 const {stdout}=await run('aegis',[...args,'page','inspect'],{timeout:20000,maxBuffer:4*1024*1024});
 const page=JSON.parse(stdout);const marker=page.visible_text?.indexOf('{"status":');
 if(marker>=0){last=JSON.parse(page.visible_text.slice(marker));if(last.runId!==runId){await new Promise(resolve=>setTimeout(resolve,500));continue;}if(last.status==='failed')throw new Error(JSON.stringify(last));if(last.status==='passed'){console.log(JSON.stringify({browser:'Aegis CLI',...last},null,2));process.exit(0);}}
 await new Promise(resolve=>setTimeout(resolve,500));
}
throw new Error('Browser acceptance timed out: '+JSON.stringify(last));
