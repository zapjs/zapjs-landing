import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const require=createRequire(import.meta.url);
const root=fileURLToPath(new URL('../',import.meta.url));
const {previewOutput}=await import(new URL('../adapters/preview.js',pathToFileURL(require.resolve('@zap-js/client/compiler'))));
const external=process.argv[2];
const server=external?undefined:await previewOutput(resolve(root,'.zap/output'),{port:0});
const base=external??`http://127.0.0.1:${server.address().port}`;
const checks=[];
const fetchSite=(path,init={})=>fetch(new URL(path,base),{...init,signal:AbortSignal.timeout(15000)});
const json=async(path,init,status=200)=>{const response=await fetchSite(path,init);assert.equal(response.status,status,`${path} HTTP ${response.status}: ${await response.clone().text()}`);return {response,data:await response.json()};};
const post=body=>({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
try{
 const pages={'/':'React. Rust.','/docs':'Introduction','/examples':'Rust Computation','/blog':'Blog','/blog/one-application':'One application, from source','/blog/native-functions':'Calling Rust','/blog/measuring-performance':'Publishing measurements'};
 for(const[path,title]of Object.entries(pages)){
  const response=await fetchSite(path);assert.equal(response.status,200,path);const html=await response.text();assert.ok(html.includes(title),`${path} has rendered content`);assert.match(html,/<html/);assert.doesNotMatch(html,/self\.__ZAP_CSR=1/);
  const flight=await fetchSite(path,{headers:{accept:'text/x-component'}});assert.equal(flight.status,200);assert.match(flight.headers.get('content-type'),/^text\/x-component/);assert.ok((await flight.text()).length>100);
 }
 checks.push('all pages serve actual React HTML and Flight');
 for(const path of ['/missing','/blog/missing','/api/subscribe','/api/users','/api/ws-echo'])assert.equal((await fetchSite(path)).status,404,path);
 checks.push('unknown pages and removed fake endpoints return 404');
 const a=(await json('/api/stats')).data,b=(await json('/api/stats')).data;assert.notEqual(a.requestId,b.requestId);assert.equal(a.runtime,'node');assert.ok(a.uptimeSeconds>=0);assert.ok(a.memoryBytes>0);assert.ok(Date.parse(a.serverTime)>0);assert.equal(a.requests,undefined);if(external){assert.equal(a.platform,'linux');assert.match(a.nodeVersion,/^22\./);}
 checks.push('request IDs, clock and instance statistics are real');
 const features=(await json('/api/features')).data;assert.ok(features.count>=6);assert.equal(features.count,features.features.length);
 const benchmark=(await json('/api/benchmarks')).data;assert.equal(benchmark.live,false);assert.equal(benchmark.requests,6400);assert.equal(benchmark.runs.length,2);
 const record=await (await fetchSite('/benchmarks/benchmark-safe.json')).json();assert.equal(record.versions.next,benchmark.versions.next);
 checks.push('features and recorded benchmarks use authoritative content');
 const posts=(await json('/api/posts?page=1&limit=1')).data;assert.equal(posts.posts.length,1);assert.equal(posts.pagination.total,3);assert.equal(posts.pagination.hasNext,true);
 const filtered=(await json('/api/posts?tag=rust')).data;assert.equal(filtered.posts[0].slug,'native-functions');await json('/api/posts?limit=0',{},400);await json('/api/posts/missing',{},404);assert.ok((await json('/api/posts/native-functions')).data.paragraphs.length);
 checks.push('real article content, filters, pagination and missing records');
 const body={message:'request-specific',nested:{bytes:[0,255],text:'<not-html>'}};assert.deepEqual((await json('/api/echo',post(body))).data.body,body);
 await json('/api/echo',{method:'POST',headers:{'content-type':'application/json'},body:'{'},400);
 assert.equal((await fetchSite('/api/echo')).status,405);
 checks.push('JSON echo executes requests with malformed-input handling');
 const results=await Promise.all(Array.from({length:8},(_,i)=>json('/api/native',post({values:[i,2]}))));
 results.forEach(({data},i)=>{assert.equal(data.sum,i+2);assert.equal(data.implementation,'rust-node-api');});assert.equal(new Set(results.map(r=>r.data.requestId)).size,8);
 for(const values of [[],[-1],[1.5],[4294967296],[4294967295,1]])await json('/api/native',post({values}),422);
 checks.push('real concurrent Rust calls, checked arithmetic and typed validation');
 const stream=await fetchSite('/api/stream');const reader=stream.body.getReader();const decoder=new TextDecoder();let bodyText='';const arrivals=[];
 for(;;){const {value,done}=await reader.read();if(done)break;arrivals.push(performance.now());bodyText+=decoder.decode(value,{stream:true});}
 const lines=bodyText.trim().split('\n').map(JSON.parse);assert.deepEqual(lines.map(line=>line.sequence),[1,2,3]);assert.ok(lines.every(line=>Date.parse(line.timestamp)>0));assert.ok(arrivals.at(-1)-arrivals[0]>=250,'stream is delivered incrementally');
 const interrupted=await fetchSite('/api/stream');await interrupted.body.cancel();
 checks.push('incremental NDJSON response and client cancellation');
 const examples=await fetchSite('/examples');const html=await examples.text();assert.match(html,/No example preference saved yet/);const formHTML=html.match(/<form[\s\S]*?<\/form>/)?.[0];assert.ok(formHTML,'server action form rendered');
 const form=new FormData();const entities={'&quot;':'"','&amp;':'&','&#x27;':"'",'&lt;':'<','&gt;':'>'};
 for(const input of formHTML.matchAll(/<input\b[^>]*name="([^"]+)"[^>]*>/g)){const value=/value="([^"]*)"/.exec(input[0])?.[1]??'';form.append(input[1],value.replace(/&quot;|&amp;|&#x27;|&lt;|&gt;/g,entity=>entities[entity]));}
 form.set('preference','compact');
 const saved=await fetchSite('/examples',{method:'POST',headers:{origin:new URL(base).origin},body:form});assert.equal(saved.status,200);const cookie=saved.headers.get('set-cookie');assert.match(cookie,/zap-example-preference=compact/);assert.match(cookie,/HttpOnly/i);if(new URL(base).protocol==='https:')assert.match(cookie,/Secure/i);assert.match(saved.headers.get('cache-control'),/private/);assert.match(await saved.text(),/Saved compact/);
 const restored=await fetchSite('/examples',{headers:{cookie:cookie.split(';')[0]}});assert.match(await restored.text(),/data-example-density="compact"/);
 form.set('preference','invalid');const invalid=await fetchSite('/examples',{method:'POST',headers:{origin:new URL(base).origin},body:form});assert.equal(invalid.status,200);assert.equal(invalid.headers.get('set-cookie'),null);assert.match(await invalid.text(),/Choose either/);
 assert.equal((await fetchSite('/examples',{method:'POST',headers:{origin:'https://untrusted.invalid'},body:form})).status,403);
 checks.push('progressive action, persistent private cookie, validation and origin protection');
 const archive=await fetchSite('/downloads/zap-js-client-0.3.0.tgz');assert.equal(archive.status,200);const actual=Buffer.from(await archive.arrayBuffer());const expected=await readFile(resolve(root,'vendor/zap-js-client-0.3.0.tgz'));assert.ok(actual.equals(expected));const digest=createHash('sha256').update(actual).digest('hex');assert.match(await (await fetchSite('/downloads/zap-js-client-0.3.0.tgz.sha256')).text(),new RegExp(digest));
 checks.push('download is the real framework package with matching checksum');
 console.log(JSON.stringify({status:'passed',target:external?'hosted':'local-production',checks},null,2));
}finally{if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}}
