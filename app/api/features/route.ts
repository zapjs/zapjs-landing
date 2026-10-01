import { features } from '../../../src/content/framework';
export function GET() {return Response.json({features,count:features.length,version:'0.3.0',target:'Vercel Node 22'});}
