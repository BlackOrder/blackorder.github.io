import { ViteReactSSG } from 'vite-react-ssg/single-page';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';

// vite-react-ssg single-page mode: prerenders <App /> to static HTML at build time
// (npm run build → vite-react-ssg build) and hydrates on the client.
export const createRoot = ViteReactSSG(<App />);
