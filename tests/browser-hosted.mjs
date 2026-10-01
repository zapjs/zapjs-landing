import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const run=promisify(execFile);
const base=new URL(process.argv[2]);
const args=['--profile',process.env.ZAP_AEGIS_PROFILE??'zapjs-check','--server-addr',process.env.ZAP_AEGIS_ADDRESS??'127.0.0.1:7897'];
const checks=[];
async function command(...command){return run('aegis',[...args,...command],{timeout:20000,maxBuffer:4*1024*1024});}
async function expectPage(path,heading){
 const target=new URL(path,base);
 target.searchParams.set("__browser_validation",String(Date.now()));
 await command('navigate',target.href);
 const deadline=Date.now()+30000;
 let page;
 while(Date.now()<deadline){
  try {page=JSON.parse((await command('page','inspect')).stdout);}
  catch(error){if(!String(error.stderr).includes('Resource temporarily unavailable'))throw error;await new Promise(resolve=>setTimeout(resolve,500));continue;}
  if(page.url===target.href&&page.headings.some(h=>h.text===heading))return page;
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 throw new Error(`Expected ${target.href} with heading ${heading}; received ${page?.url}: ${JSON.stringify(page?.headings)}`);
}
const home=await expectPage('/','React. Rust. One application.');
assert.ok(home.links.some(link=>(link.href??link.url??'').includes('/docs')));
checks.push('hosted homepage renders and exposes documentation navigation');
// Prerendered docs contain Introduction. These headings require actual client
// JavaScript to hydrate, interpret the hash, and render the requested section.
const source=await readFile(new URL('../src/content/docs.ts',import.meta.url),'utf8');
const module=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {documentation}=await import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
const normalize=text=>text.replace(/\s+/gu,' ').trim();
for(const section of documentation){
 const page=await expectPage('/docs#'+section.id,section.title);
 assert.ok(normalize(page.visible_text).includes(normalize(section.summary)),`Missing hosted summary: ${section.id}`);
 for(const block of section.blocks)if(block.type==='paragraph'||block.type==='callout')assert.ok(normalize(page.visible_text).includes(normalize(block.text)),`Hosted text differs from reviewed content: ${section.id}`);
}
checks.push(`all ${documentation.length} hosted documentation sections hydrate with the reviewed prose`);
await expectPage('/examples','See it in action');
checks.push('hosted dynamic examples page renders');
await expectPage('/blog/native-functions','Calling Rust inside a ZapJS request');
checks.push('hosted article renders');
console.log(JSON.stringify({status:'passed',browser:'Aegis CLI',target:base.origin,checks,scope:'Direct hosted rendering and hash-driven hydration; full DOM interaction coverage is supplied by the local production suite.'},null,2));
