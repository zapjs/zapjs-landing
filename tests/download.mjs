import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtemp,writeFile,rm,mkdir,copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const base=process.argv[2]??'http://127.0.0.1:4330';
const directory=await mkdtemp(join(tmpdir(),'zapjs-download-'));
let server;
try{
 const archive=await fetch(new URL('/downloads/zap-js-client-0.3.0.tgz',base));assert.equal(archive.status,200);
 await writeFile(join(directory,'zap-js-client-0.3.0.tgz'),Buffer.from(await archive.arrayBuffer()));
 execFileSync('npm',['exec','--yes','--package','./zap-js-client-0.3.0.tgz','--','zap','new','my-app','--no-install','--no-git'],{cwd:directory,stdio:'inherit',timeout:120000});
 const app=join(directory,'my-app');
 await mkdir(join(app,'vendor'));
 await copyFile(join(directory,'zap-js-client-0.3.0.tgz'),join(app,'vendor/zap-js-client-0.3.0.tgz'));
 execFileSync('npm',['install','./vendor/zap-js-client-0.3.0.tgz','--no-audit','--no-fund'],{cwd:app,stdio:'inherit',timeout:180000});
 execFileSync('npm',['exec','--','tsc','--noEmit'],{cwd:app,stdio:'inherit',timeout:30000});
 execFileSync('npm',['run','build','--','--adapter','node'],{cwd:app,stdio:'inherit',timeout:120000});
 const require=createRequire(join(app,'package.json'));
 const {previewOutput}=await import(new URL('../adapters/preview.js',pathToFileURL(require.resolve('@zap-js/client/compiler'))));
 server=await previewOutput(join(app,'.zap/output'),{port:0});
 const origin=`http://127.0.0.1:${server.address().port}`;
 const home=await fetch(origin);assert.equal(home.status,200);assert.match(await home.text(),/ZapJS/);
 const health=await fetch(origin+'/api/health');assert.equal(health.status,200);assert.equal((await health.json()).status,'ok');
 console.log(JSON.stringify({status:'passed',check:'downloaded archive scaffolds, installs, typechecks, builds and serves an actual application'}));
}finally{
 if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
 await rm(directory,{recursive:true,force:true});
}
