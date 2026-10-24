import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { BirthDetails, Currency } from '../types';
import { MalaProduct } from '../types';
import { BirthTimezoneMatch, BirthplaceSuggestion, inferBirthTimezone } from '../utils/birthTimezone';
import { BirthDateField, BirthplaceAutocomplete } from './BirthDetailsFields';
import { ElementMark } from './ElementMark';

interface HeroSectionProps {
  currency: Currency;
  onExploreCollections: () => void;
  onSubmitBirthDetails: (details: BirthDetails) => void;
  onQuickViewHeroItem: () => void;
  featuredProduct: MalaProduct | undefined;
}

interface IpLocation {
  city?: string;
  region?: string;
  country_name?: string;
  timezone?: string;
}

const BIRTH_TIME_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const hour = (23 + index * 2) % 24;
  const value = `${String(hour).padStart(2, '0')}:00`;
  const nextHour = String((hour + 2) % 24).padStart(2, '0');
  const names: Record<string, string> = { '23:00': 'Rat hour', '01:00': 'Ox hour', '03:00': 'Tiger hour', '05:00': 'Rabbit hour', '07:00': 'Dragon hour', '09:00': 'Snake hour', '11:00': 'Horse hour', '13:00': 'Goat hour', '15:00': 'Monkey hour', '17:00': 'Rooster hour', '19:00': 'Dog hour', '21:00': 'Pig hour' };
  return { value, label: `${value}–${nextHour}:00 · ${names[value]}` };
});

export const HeroSection: React.FC<HeroSectionProps> = ({
  currency,
  onExploreCollections,
  onSubmitBirthDetails,
  onQuickViewHeroItem,
  featuredProduct,
}) => {
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Pacific/Auckland';
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState<BirthDetails['gender'] | ''>('');
  const [birthplace, setBirthplace] = useState('');
  const [timeZone, setTimeZone] = useState(browserTimeZone);
  const [timeZoneStatus, setTimeZoneStatus] = useState('Time zone will be matched to your birthplace automatically.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationSource, setLocationSource] = useState<'detecting' | 'ip' | 'device'>('detecting');
  const locationEdited = useRef(false);
  const locationLookupId = useRef(0);
  const matchedBirthplace = useRef<BirthplaceSuggestion | null>(null);

  const lookupBirthplaceTimezone = async (place: string): Promise<BirthTimezoneMatch | null> => {
    const requestId = ++locationLookupId.current;
    if (place.trim().length < 2) return null;
    setTimeZoneStatus('Matching time zone to birthplace…');
    const match = await inferBirthTimezone(place);
    if (requestId === locationLookupId.current) {
      if (match) {
        setTimeZone(match.timeZone);
        setBirthplace(match.location);
        setTimeZoneStatus('City matched · time zone set automatically.');
      } else {
        setTimeZoneStatus('Place not matched · using your approximate current-region time zone.');
      }
    }
    return match;
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3500);
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Location lookup unavailable');
        return response.json() as Promise<IpLocation>;
      })
      .then((data) => {
        if (locationEdited.current) return;
        const place = [data.city, data.country_name].filter(Boolean).filter((part, index, all) => all.indexOf(part) === index).join(', ');
        if (place) {
          setBirthplace(place);
          setLocationSource('ip');
          setTimeZoneStatus('Approximate current region detected · birthplace time zone is matched automatically.');
        }
        if (data.timezone) setTimeZone(data.timezone);
      })
      .catch(() => {
        setLocationSource('device');
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  const handleBirthDetailsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const selectedPlace = matchedBirthplace.current?.location === birthplace ? matchedBirthplace.current : null;
    const placeMatch = selectedPlace ? null : await lookupBirthplaceTimezone(birthplace);
    const resolvedTimeZone = selectedPlace?.timeZone || placeMatch?.timeZone || timeZone;
    const resolvedBirthplace = selectedPlace?.location || placeMatch?.location || birthplace;
    onSubmitBirthDetails({ birthDate, birthTime, birthplace: resolvedBirthplace, timeZone: resolvedTimeZone, gender: gender || 'prefer_not_to_say' });
  };
  const featuredPrice = featuredProduct ? currency === 'USD' ? featuredProduct.priceUSD : currency === 'AUD' ? featuredProduct.priceAUD : featuredProduct.priceNZD : null;

  return (
    <section className="relative isolate overflow-hidden border-b border-[#EAE4DC] bg-[#211713]">
      <img
        src="/assets/aistudio/Image_2_1813fd33.jpeg"
        onError={(event) => {
          (event.currentTarget as HTMLImageElement).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO-PHD6ebCEHhFyt41mO7BSrne-yr6ekEJPGiqukb_jDufeRnlGBwLgiL1LOX68rZTPgps1lQCVE7Gq-6ol42NLKpXBKtTO5egKB1GtN6k8yeBrk_gv3bzA52K-4RBFaE8To2OGL8FRNU4uJTxEgjyzdOHkYnhXzrKF1xrPGLHlKBxpazMbOgQnCcek_Uyfs0IlDa3Ep_bxsm4niAR-JLgFw-NzgElW8-dIErB9Yav_p0_Gj_5AuXtfw';
        }}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#211713]/90 via-[#211713]/55 to-[#211713]/5" />

      <div className="relative z-10 mx-auto flex min-h-[700px] w-full max-w-7xl flex-col px-2 py-7 sm:px-6 lg:min-h-[640px] lg:px-8 lg:py-8">
        <div className="-ml-1 w-[calc(100%+0.5rem)] max-w-lg space-y-4 sm:ml-0 sm:w-full">
          <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-[#FAF8F5]/95 px-3 py-1.5 shadow-lg">
            <span className="material-symbols-outlined text-sm text-[#4d6453]">spa</span>
            <span className="text-[10px] font-sans text-[#3A3835] sm:text-[11px]">Five Elements · Chinese cultural tradition</span>
          </div>

          <h1 className="w-full max-w-xl break-words font-serif text-[clamp(2.25rem,9vw,3rem)] leading-[1.08] tracking-tight text-[#FAF8F5] sm:text-5xl lg:text-6xl">
            Find a piece that<br />
            <span className="font-normal italic text-[#E1BD7E]">reflects your style.</span>
          </h1>

          <form onSubmit={handleBirthDetailsSubmit} className="w-full max-w-md rounded-2xl border border-white/60 bg-[#FAF8F5]/95 p-3.5 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-serif text-base text-[#321a0f] sm:text-lg">Get your personal reading</p>
              <span className="shrink-0 text-[10px] text-[#82746f]">About 30 seconds</span>
            </div>

            <div className="grid grid-cols-1 items-start gap-3">
              <label className="min-w-0 text-[10px] font-semibold uppercase tracking-wider text-[#675a51]">
                Date of birth <span className="text-[#a64c37]">*</span>
                <BirthDateField compact value={birthDate} onChange={setBirthDate} />
              </label>
              <label className="min-w-0 text-[10px] font-semibold uppercase tracking-wider text-[#675a51]">
                Birth time <span className="font-normal normal-case tracking-normal text-[#82746f]">(optional)</span>
                <select value={birthTime} onChange={(event) => setBirthTime(event.target.value)} className="mt-1.5 min-w-0 w-full rounded-md border border-[#ded4ca] bg-white px-1.5 py-[11px] text-[12px] font-normal normal-case tracking-normal text-[#321a0f] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E] sm:px-2.5 sm:text-sm">
                  <option value="">Not sure / skip</option>
                  {BIRTH_TIME_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <span className="mt-1 block text-[9px] font-normal normal-case tracking-normal text-[#82746f]">Choose one complete traditional two-hour period.</span>
              </label>
            </div>

            <label className="mt-2.5 block text-[10px] font-semibold uppercase tracking-wider text-[#675a51]">
              Gender <span className="font-normal normal-case tracking-normal text-[#82746f]">(optional)</span>
              <select value={gender} onChange={(event) => setGender(event.target.value as BirthDetails['gender'] | '')} className="mt-1.5 w-full rounded-md border border-[#ded4ca] bg-white px-2.5 py-2.5 text-sm font-normal normal-case tracking-normal text-[#321a0f] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E]">
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>

            <label className="mt-2.5 block text-[10px] font-semibold uppercase tracking-wider text-[#675a51]">
              Birthplace or region
              <span className="relative mt-1.5 block">
                <BirthplaceAutocomplete id="hero-birthplace" value={birthplace} onChange={(value) => { setBirthplace(value); matchedBirthplace.current = null; locationEdited.current = true; setTimeZoneStatus('Start typing to choose a city and country.'); }} onSelect={(place) => { matchedBirthplace.current = place; setBirthplace(place.location); setTimeZone(place.timeZone); setTimeZoneStatus('City matched · time zone set automatically.'); locationEdited.current = true; }} placeholder={locationSource === 'detecting' ? 'Detecting your region…' : 'Type a city name'} className="w-full rounded-md border border-[#ded4ca] bg-white py-2.5 pr-3 text-sm font-normal normal-case tracking-normal text-[#321a0f] placeholder:text-[#a69b91] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E]" leadingIcon />
              </span>
            </label>

            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px] text-[#82746f]">
              <span>{locationSource === 'detecting' ? 'Suggesting your current area…' : locationSource === 'ip' ? 'Approximate current region detected.' : 'Current region unavailable · birthplace still sets the time zone.'}</span>
              <span aria-live="polite">{timeZoneStatus}</span>
            </div>

            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="group mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#321a0f] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#FAF8F5] shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:bg-[#4a2f23] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1BD7E] focus-visible:ring-offset-2 active:scale-[.98] disabled:cursor-wait">
              {isSubmitting ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Opening your reading…</> : <>Reveal my reading <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span></>}
            </button>
            <p className="mt-1.5 text-center text-[10px] leading-4 text-[#8c8077]">Time and gender optional · Birthplace is sent to Open-Meteo to infer time zone · Birth details are sent to our AI reading service</p>
          </form>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-white/90">
            <button onClick={onExploreCollections} className="inline-flex items-center gap-1.5 font-semibold text-[#E1BD7E] transition-colors hover:text-white">
              Browse all beads <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-[#E1BD7E]">menu_book</span>Five Elements cultural reference</span>
            <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-[#E1BD7E]">shopping_bag</span>Order one item at a time</span>
          </div>
        </div>

        {featuredProduct && <button onClick={onQuickViewHeroItem} className="group mt-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/30 bg-[#211713]/65 px-3 py-2 text-left text-white backdrop-blur-md transition-colors hover:bg-[#211713]/85 sm:mt-8 lg:absolute lg:bottom-8 lg:right-8 lg:mt-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E1BD7E] p-1.5 text-[#321a0f]">
            <ElementMark className="block h-full w-full" />
          </span>
          <span>
            <span className="block text-[11px] font-semibold">{featuredProduct.name}</span>
            <span className="block text-[10px] text-white/70">{featuredProduct.category} · Details on product page</span>
          </span>
          {featuredPrice !== null && <span className="ml-2 text-xs font-bold text-[#E1BD7E]">{new Intl.NumberFormat('en-NZ', { style: 'currency', currency }).format(featuredPrice)}</span>}
        </button>}
      </div>
    </section>
  );
};
