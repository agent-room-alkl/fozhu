import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <GoogleAnalytics />
  </>,
);
