import { useEffect, useState } from 'react';

type AnalyticsChoice = 'accepted' | 'essential';

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
  }
}

const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-FMN00BW933').trim();
const preferenceKey = 'fozhu-analytics-choice';

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

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);

  useEffect(() => {
    if (!measurementId) return;
    const savedChoice = localStorage.getItem(preferenceKey) as AnalyticsChoice | null;
    setChoice(savedChoice);
    if (savedChoice === 'accepted') enableAnalytics();
  }, []);

  if (!measurementId || choice) return null;

  const choose = (nextChoice: AnalyticsChoice) => {
    localStorage.setItem(preferenceKey, nextChoice);
    setChoice(nextChoice);
    if (nextChoice === 'accepted') enableAnalytics();
  };

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-[#DED4C9] bg-[#FAF8F5] p-4 text-sm text-[#3A3835] shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="leading-relaxed">We use Google Analytics to understand how visitors use Fozhu. You can allow analytics or continue with essential storage only.</p>
      <div className="flex shrink-0 gap-2">
        <button onClick={() => choose('essential')} className="rounded-md border border-[#B9A99B] px-3 py-2 text-xs font-semibold hover:bg-[#F0EAE3]">Essential only</button>
        <button onClick={() => choose('accepted')} className="rounded-md bg-[#321A0F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#4A2819]">Allow analytics</button>
      </div>
    </aside>
  );
}
