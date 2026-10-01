import { cookies } from '@zap-js/client/server';
import ExamplesPage from '../../src/pages/ExamplesPage';
export default function Page() {
 const saved = cookies().get('zap-example-preference');
 return <ExamplesPage initialPreference={saved === 'compact' || saved === 'comfortable' ? saved : undefined} />;
}
