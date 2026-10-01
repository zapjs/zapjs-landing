import measurements from '../../../src/content/benchmark.json';
export function GET() {return Response.json({...measurements,kind:'recorded-measurements',live:false});}
