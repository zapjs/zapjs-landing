import { randomUUID } from 'node:crypto';
import { sumNumbers } from 'zap:native';
export async function POST(request: Request) {
 if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({error:'Send application/json'}, {status:415});
 let body: unknown;
 try {body = await request.json();} catch {return Response.json({error:'Invalid JSON'}, {status:400});}
 const values = body && typeof body === 'object' && 'values' in body ? body.values : undefined;
 if (!Array.isArray(values) || !values.length || values.length > 4096 || values.some(value => !Number.isInteger(value) || value < 0 || value > 4294967295)) return Response.json({error:'values must contain 1–4096 unsigned 32-bit integers'}, {status:422});
 try {
  return Response.json({sum:await sumNumbers(values),implementation:'rust-node-api',requestId:randomUUID()}, {headers:{'cache-control':'private, no-store'}});
 } catch (error) {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('Sum exceeds unsigned 32-bit range')) return Response.json({error:'Sum exceeds unsigned 32-bit range'}, {status:422});
  if (message.includes('ZAP_NATIVE_OVERLOADED')) return Response.json({error:'Native work capacity is busy. Try again.'},{status:503,headers:{'retry-after':'1'}});
  console.error('Native example failed', error);
  return Response.json({error:'Native computation failed'}, {status:500});
 }
}
