export function GET(request: Request) {
 const encoder = new TextEncoder();
 let sequence = 0, timer: ReturnType<typeof setTimeout> | undefined, release: (() => void) | undefined, stopped = false, cancelled = false;
 const stop = () => {stopped = true; if(timer) clearTimeout(timer);release?.();request.signal.removeEventListener('abort',stop);};
 request.signal.addEventListener('abort',stop,{once:true});
 return new Response(new ReadableStream<Uint8Array>({
  async pull(controller) {
   if (sequence > 0) await new Promise<void>(resolve=>{release=resolve;timer=setTimeout(resolve,200);});
   if(stopped || request.signal.aborted) {stop();if(!cancelled)controller.close();return;}
   controller.enqueue(encoder.encode(JSON.stringify({type:'chunk',sequence:++sequence,timestamp:new Date().toISOString()})+'\n'));
   if(sequence===3){stop();controller.close();}
  },cancel(){cancelled=true;stop();},
 },{highWaterMark:0}), {headers:{'content-type':'application/x-ndjson; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
}
