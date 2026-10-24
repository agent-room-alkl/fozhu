import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
  }
}

const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-FMN00BW933').trim();

function enableAnalytics() {
  if (!measurementId || document.getElementById('fozhu-google-analytics')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });
  const script = document.createElement('script');
  script.id = 'fozhu-google-analytics';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function GoogleAnalytics() {
  useEffect(() => {
    enableAnalytics();
  }, []);

  return null;
}
