import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {SAXParser} from 'parse5-sax-parser';

const require=createRequire(import.meta.url);
const {previewOutput}=await import(new URL('../adapters/preview.js',pathToFileURL(require.resolve('@zap-js/client/compiler'))));
const server=process.argv[2]?undefined:await previewOutput(resolve('.zap/output'),{port:0});
const base=process.argv[2]??`http://127.0.0.1:${server.address().port}`;
const source=await readFile('src/content/docs.ts','utf8');
const module=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {documentation}=await import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
const articles=JSON.parse(await readFile('src/content/posts.json','utf8'));
const packageData=JSON.parse(await readFile('node_modules/@zap-js/client/package.json','utf8'));
const parse=html=>{
 const ids=new Set(),links=[];
 const parser=new SAXParser();
 parser.on('startTag',tag=>{const attrs=Object.fromEntries(tag.attrs.map(attr=>[attr.name,attr.value]));if(attrs.id)ids.add(attrs.id);if(tag.tagName==='a'&&attrs.href)links.push(attrs.href);});
 parser.end(html);return {ids,links};
};
const fetchSite=path=>fetch(new URL(path,base),{signal:AbortSignal.timeout(15000)});
const checks=[];
try{
 const sections=new Set(documentation.map(section=>section.id));assert.equal(sections.size,documentation.length);
 const pages=['/','/docs','/examples','/blog',...articles.map(article=>'/blog/'+article.slug)];
 const rendered=new Map();
 for(const path of pages){const response=await fetchSite(path);assert.equal(response.status,200);rendered.set(path,parse(await response.text()));}
 const links=new Set([...rendered.entries()].flatMap(([path,page])=>page.links.map(href=>new URL(href,new URL(path,base)).href)));
 for(const section of documentation)for(const block of section.blocks)if(block.href)links.add(new URL(block.href,base).href);
 for(const article of articles)for(const reference of article.sources)links.add(new URL(reference.href,base).href);
 let internal=0;
 for(const href of links){
  const url=new URL(href);if(url.origin!==new URL(base).origin)continue;internal++;
  if(!rendered.has(url.pathname)){
   const response=await fetchSite(url.pathname+url.search);assert.equal(response.status,200,href);
   rendered.set(url.pathname,response.headers.get('content-type')?.includes('text/html')?parse(await response.text()):{ids:new Set(),links:[]});
  }
  if(url.hash){const id=decodeURIComponent(url.hash.slice(1));assert.ok(url.pathname==='/docs'?sections.has(id):rendered.get(url.pathname).ids.has(id),'Missing link target '+href);}
 }
 checks.push(`${internal} internal destinations resolve, including documentation hashes and article references`);
 for(const article of articles){
  const record=await(await fetchSite('/api/posts/'+article.id)).json();
  const words=[article.title,article.excerpt,...article.paragraphs].join(' ').trim().split(/\s+/u).length;
  assert.equal(record.wordCount,words);assert.equal(record.readingMinutes,Math.max(1,Math.ceil(words/200)));
  assert.equal(record.readTime,`About ${record.readingMinutes} min read`);assert.deepEqual(record.sources,article.sources);
  assert.ok(!Number.isNaN(Date.parse(record.publishedAt)));assert.deepEqual(record.paragraphs,article.paragraphs);
 }
 checks.push('article metadata and explicitly estimated reading times match actual published content');
 const snapshot=JSON.parse(await readFile('src/content/benchmark.json','utf8'));
 assert.deepEqual(await(await fetchSite('/api/benchmarks')).json(),{...snapshot,kind:'recorded-measurements',live:false});
 checks.push('published benchmark API exactly matches the audited projection and provenance');
 const stats=await(await fetchSite('/api/stats')).json();const features=await(await fetchSite('/api/features')).json();
 assert.equal(stats.version,packageData.version);assert.equal(features.version,packageData.version);assert.equal(features.count,features.features.length);
 assert.match(stats.scope,/not global/);assert.ok(stats.memoryBytes>0);assert.match(stats.nodeVersion,/^22\./);
 assert.match(stats.memoryMetric,/resident set size/);assert.match(stats.uptimeScope,/not total website uptime/);
 checks.push('advertised framework version and feature count match the installed package and API');
 console.log(JSON.stringify({status:'passed',target:base,documentationSections:sections.size,pages:pages.length,checks,externalLinks:[...links].filter(href=>new URL(href).origin!==new URL(base).origin)},null,2));
}finally{if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}}
