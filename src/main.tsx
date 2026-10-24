import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AnalyticsConsent } from './components/AnalyticsConsent';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <AnalyticsConsent />
  </>,
);
