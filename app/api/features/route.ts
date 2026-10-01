import { features } from '../../../src/content/framework';

export function GET() {
  return Response.json({ features, count: features.length, target: 'rust-react' });
}
