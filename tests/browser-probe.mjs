// Runs only in the test server's wrapper page; never shipped with the website.
const frame=document.querySelector('#site');
const result=document.querySelector('#result');
const runId=new URLSearchParams(location.search).get('run');
const checks=[];
const errors=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const doc=()=>frame.contentDocument;
const win=()=>frame.contentWindow;
const check=(condition,message)=>{if(!condition)throw new Error(message);};
async function until(test,label){const deadline=Date.now()+12000;while(Date.now()<deadline){if(test())return;await pause(40);}throw new Error('Timed out: '+label);}
const visible=element=>element.getClientRects().length&&!element.closest('[inert]')&&win().getComputedStyle(element).visibility!=='hidden';
function button(text,root=doc()){const el=[...root.querySelectorAll('button')].find(el=>el.textContent.trim()===text&&visible(el));check(el,'Missing button '+text);return el;}
function input(el,value){const proto=el.tagName==='TEXTAREA'?win().HTMLTextAreaElement.prototype:win().HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new(win().Event)('input',{bubbles:true}));}
function monitor(){win().addEventListener('error',e=>errors.push(e.message));win().addEventListener('unhandledrejection',e=>errors.push(String(e.reason)));}
async function navigate(path){await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Frame navigation timed out: '+path)),15000);frame.onload=()=>{clearTimeout(timer);monitor();resolve();};const target=new URL(path,location.origin);target.searchParams.set('__acceptance',String(Date.now()));frame.src=target.href;});await pause(450);}
async function expand(id){const el=doc().querySelector(`[aria-controls="example-details-${id}"]`);check(el,'Missing example '+id);el.scrollIntoView();el.click();await until(()=>doc().querySelector('#example-details-'+id),id+' expands');await pause(250);return doc().querySelector('#example-details-'+id);}
function noOverflow(label){check(doc().documentElement.scrollWidth<=win().innerWidth+1,label+' overflows viewport: '+doc().documentElement.scrollWidth+'/'+win().innerWidth);}
function passed(label){checks.push(label);result.textContent=JSON.stringify({status:'running',runId,checks});}
try{
 await navigate('/');
 const order=doc().querySelector('[aria-label="Benchmark framework order"]');check(order,'Benchmark controls exist');order.scrollIntoView();button('Next.js first',order).click();await until(()=>button('Next.js first',order).getAttribute('aria-pressed')==='true','benchmark toggle');passed('home hydrates and benchmark order control responds');
 const docsLink=[...doc().querySelectorAll('a[href="/docs"]')].find(visible);check(docsLink,'Docs link exists');const originalDocument=doc();docsLink.click();await until(()=>win().location.pathname==='/docs'&&doc().querySelector('h1')?.textContent==='Introduction','client navigation');check(doc()===originalDocument,'Link performs client navigation');passed('framework client navigation renders documentation without reloading');
 await navigate('/docs#caching');await until(()=>doc().querySelector('h1')?.textContent==='Caching','deep link');
 const more=doc().querySelector('[aria-label="More documentation sections"]');more.focus();await pause(100);button('Routes & Layouts').click();await until(()=>win().location.hash==='#routing','select routing');win().history.back();await until(()=>doc().querySelector('h1')?.textContent==='Caching','history restores section');
 const search=[...doc().querySelectorAll('input[aria-label="Search documentation"]')].find(visible);input(search,'atomic Redis');await until(()=>doc().querySelector('[aria-label="Documentation search results"]')?.textContent.includes('Caching'),'full content search');search.dispatchEvent(new(win().KeyboardEvent)('keydown',{key:'Enter',bubbles:true}));await until(()=>search.value===''&&doc().querySelector('h1')?.textContent==='Caching','search selection');passed('docs deep links, history, content search and keyboard selection');
 const documentation=await(await fetch('/__docs.json')).json();
 for(const section of documentation){
  win().location.hash=section.id;
  await until(()=>doc().querySelector('h1')?.textContent===section.title,'documentation section '+section.id);
  const content=doc().querySelector('main').textContent;
  for(const block of section.blocks){
   if(block.type==='paragraph'||block.type==='callout')check(content.includes(block.text),'Missing documented text in '+section.id);
   if(block.type==='code')check([...doc().querySelectorAll('main pre')].some(pre=>pre.textContent===block.code),'Code example was altered when rendered in '+section.id);
  }
 }
 passed('all '+documentation.length+' documentation sections and their exact prose/code render');
 await navigate('/examples');let native=await expand('native');input(native.querySelector('textarea'),'{"values":[5,7]}');button('Try It',native).click();await until(()=>native.querySelector('[aria-live] pre')?.textContent.includes('"sum": 12'),'actual Rust response');passed('editable native example executes Rust with user input');
 input(native.querySelector('textarea'),'{"values":[-1]}');button('Try It',native).click();await until(()=>native.querySelector('[role="alert"]')?.textContent.includes('422'),'native validation error');passed('invalid Rust input shows actual HTTP error');
 const echo=await expand('echo');input(echo.querySelector('textarea'),'{"message":"browser-acceptance"}');button('Try It',echo).click();await until(()=>echo.querySelector('[aria-live] pre')?.textContent.includes('browser-acceptance'),'JSON echo');passed('JSON request editor sends actual payload');
 const stream=await expand('stream');button('Try It',stream).click();await until(()=>stream.querySelector('[aria-live] pre')?.textContent.includes('"sequence":1'),'first streaming chunk');check(!stream.querySelector('[aria-live] pre').textContent.includes('"sequence":3'),'first chunk appears before final chunk');button('Cancel',stream).click();await until(()=>stream.querySelector('[role="alert"]')?.textContent.includes('cancelled'),'stream cancellation');passed('stream updates incrementally and cancellation is visible');
 const preference=doc().querySelector('#example-preference');preference.value='compact';preference.dispatchEvent(new(win().Event)('change',{bubbles:true}));preference.closest('form').requestSubmit();await until(()=>doc().querySelector('#preference-result')?.textContent.includes('Saved compact'),'hydrated action');await until(()=>doc().querySelector('[data-example-density]')?.dataset.exampleDensity==='compact','action refresh changes layout');check(!doc().cookie.includes('zap-example-preference'),'preference is HttpOnly');await navigate('/examples');check(doc().querySelector('[data-example-density]')?.dataset.exampleDensity==='compact','saved preference survives reload');passed('hydrated server action changes layout and persists private cookie');
 await navigate('/blog');const article=doc().querySelector('a[href="/blog/native-functions"]');check(article,'Article link');article.click();await until(()=>win().location.pathname==='/blog/native-functions'&&doc().body.textContent.includes('Calling Rust'),'blog navigation');passed('blog list links to actual article content');
 frame.style.width='390px';frame.style.height='844px';await navigate('/');noOverflow('Mobile home');const menu=doc().querySelector('[aria-label="Open navigation menu"]');check(menu&&visible(menu),'Mobile menu visible');menu.click();await until(()=>doc().querySelector('[aria-label="Close navigation menu"]'),'mobile menu opens');passed('mobile home fits viewport and menu opens');
 await navigate('/examples');noOverflow('Mobile examples');await navigate('/docs#native');await until(()=>doc().querySelector('h1')?.textContent==='Native Rust','mobile deep link');noOverflow('Mobile docs');doc().querySelector('[aria-label="Open documentation menu"]').click();await pause(300);const mobileSearch=[...doc().querySelectorAll('input[aria-label="Search documentation"]')].find(visible);input(mobileSearch,'atomic Redis');await pause(100);mobileSearch.dispatchEvent(new(win().KeyboardEvent)('keydown',{key:'Enter',bubbles:true}));await until(()=>doc().querySelector('h1')?.textContent==='Caching','mobile search');passed('mobile examples/docs fit viewport and documentation search works');
 check(errors.length===0,'Uncaught browser errors: '+errors.join('; '));passed('no uncaught browser errors during acceptance');
 result.textContent=JSON.stringify({status:'passed',runId,checks});
}catch(error){result.textContent=JSON.stringify({status:'failed',runId,checks,error:String(error),errors});}
