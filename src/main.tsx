import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('ZapJS landing root element is missing');

createRoot(root).render(<App />);
