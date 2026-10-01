import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const {previewOutput}=await import(new URL('../adapters/preview.js',pathToFileURL(require.resolve('@zap-js/client/compiler'))));
const server=await previewOutput(resolve('.zap/output'),{port:4330});
const [handler]=server.listeners('request');
server.removeListener('request',handler);
server.on('request',async(req,res)=>{
 if(new URL(req.url,'http://localhost').pathname==='/__verification'){
  res.setHeader('content-type','text/html');
  res.end('<!doctype html><html><head><title>ZapJS browser acceptance</title></head><body><pre id="result">Running website acceptance</pre><iframe id="site" title="Website under test" style="width:1400px;height:900px;border:0"></iframe><script type="module" src="/__probe.mjs"></script></body></html>');
 }else if(req.url==='/__docs.json'){
  const source=await readFile('src/content/docs.ts','utf8');
  const module=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
  const {documentation}=await import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
  res.setHeader('content-type','application/json');res.end(JSON.stringify(documentation));
 }else if(req.url==='/__probe.mjs'){
  res.setHeader('content-type','text/javascript');res.end(await readFile(new URL('./browser-probe.mjs',import.meta.url)));
 }else handler(req,res);
});
console.log('Browser acceptance fixture: http://127.0.0.1:4330/__verification');
