import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BirthDetails, Currency, MalaProduct } from '../types';
import { FiveElement, requestSharedBaziReading, SharedBaziReading } from '../types/bazi';
import { ProductCard } from './ProductCard';
import { BirthplaceSuggestion, BirthTimezoneMatch, inferBirthTimezone } from '../utils/birthTimezone';
import { BirthDateField, BirthplaceAutocomplete } from './BirthDetailsFields';
import { EARTHLY_BRANCHES, HEAVENLY_STEMS, TEN_GOD_ENGLISH } from '../utils/baziStructure';
import { formatMoney } from '../utils/shipping';

const ELEMENT_COLORS: Record<FiveElement, string> = {
  Wood: '#65836a', Fire: '#b9694f', Earth: '#b28b50', Metal: '#9c9a91', Water: '#58788a', Mixed: '#80674f',
};
const ELEMENT_MATERIALS: Record<FiveElement, string> = {
  Wood: 'wood and natural seed beads', Fire: 'warm red, amber and warm-toned beads', Earth: 'earthy stones and natural seed beads',
  Metal: 'light-toned stones and simple metallic accents', Water: 'dark stones and deep, cool-toned beads', Mixed: 'a balanced mix of natural materials and colours',
};
const TIME_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const hour = (23 + index * 2) % 24;
  return `${String(hour).padStart(2, '0')}:00`;
});

const ELEMENTS_DATA: FiveElement[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const DOUBLE_HOUR_NAMES: Record<string, string> = { '23:00': 'Rat hour', '01:00': 'Ox hour', '03:00': 'Tiger hour', '05:00': 'Rabbit hour', '07:00': 'Dragon hour', '09:00': 'Snake hour', '11:00': 'Horse hour', '13:00': 'Goat hour', '15:00': 'Monkey hour', '17:00': 'Rooster hour', '19:00': 'Dog hour', '21:00': 'Pig hour' };

function pillarInEnglish(value: string | null) {
  if (!value) return 'Not available';
  const chars = [...value];
  const stem = HEAVENLY_STEMS[chars[0]];
  const branch = EARTHLY_BRANCHES[chars[1]];
  if (!stem || !branch) return '';
  return `${stem.pinyin} (${stem.polarity} ${stem.element}) · ${branch.pinyin} (${branch.animal})`;
}

function StarRating({ score }: { score: number }) {
  const labels = ['Reflective', 'Take it gently', 'Steady', 'Supportive', 'Especially supportive'];
  return <span className="inline-flex items-center gap-1" aria-label={`${score} out of 5: ${labels[score - 1] || 'Traditional reflection'}`}>
    {Array.from({ length: 5 }, (_, index) => <span key={index} className={index < score ? 'text-[#bd8a36]' : 'text-[#ddd5cc]'}>★</span>)}
    <span className="ml-1 text-xs text-[#82746f]">{score}/5</span>
  </span>;
}

interface BirthChartGuideProps {
  currency: Currency;
  products: MalaProduct[];
  initialDetails?: BirthDetails | null;
  onAddToCart: (product: MalaProduct, size: string, config?: string, baziElement?: string) => void;
  onQuickView: (productId: string, baziElement?: string) => void;
  onViewProduct: (product: MalaProduct) => void;
  onBackToStore: () => void;
}

export const BirthChartGuide: React.FC<BirthChartGuideProps> = ({ currency, products, initialDetails, onAddToCart, onQuickView, onViewProduct, onBackToStore }) => {
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Pacific/Auckland';
  const [birthDate, setBirthDate] = useState(initialDetails?.birthDate || '');
  const [birthTime, setBirthTime] = useState(initialDetails?.birthTime || '');
  const [birthplace, setBirthplace] = useState(initialDetails?.birthplace || '');
  const [timeZone, setTimeZone] = useState(initialDetails?.timeZone || browserTimeZone);
  const [timeZoneStatus, setTimeZoneStatus] = useState('Matched automatically from your birthplace when available.');
  const [gender, setGender] = useState<BirthDetails['gender']>(initialDetails?.gender || 'prefer_not_to_say');
  const [reading, setReading] = useState<SharedBaziReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Preparing your personal reading…');
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const locationLookupId = useRef(0);
  const matchedBirthplace = useRef<BirthplaceSuggestion | null>(null);
  const autoStartedRef = useRef(false);
  const recommendedElement = reading?.beadRecommendation.element || reading?.elementFocus || null;

  const runReading = useCallback(async (details: BirthDetails) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsLoading(true);
    setLoadingMessage('Preparing your personal reading…');
    setError('');
    setReading(null);
    setHasSubmitted(true);
    try {
      const result = await requestSharedBaziReading(details, controller.signal);
      if (!controller.signal.aborted) {
        if (result.status === 'aligned') setReading(result);
        else setError(result.message || 'We could not confirm a consistent chart. Please check your birth details and try again.');
      }
    } catch (requestError) {
      if (!controller.signal.aborted) setError(requestError instanceof Error ? requestError.message : 'We could not complete your reading right now. Please try again shortly.');
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialDetails?.birthDate && !autoStartedRef.current) {
      autoStartedRef.current = true;
      const controller = new AbortController();
      setIsLoading(true);
      setLoadingMessage(initialDetails.birthplace.trim().length >= 2 ? 'Matching your birth location…' : 'Preparing your personal reading…');
      void (async () => {
        let resolvedTimeZone = initialDetails.timeZone;
        if (initialDetails.birthplace.trim().length >= 2) {
          const match = await inferBirthTimezone(initialDetails.birthplace, controller.signal);
          resolvedTimeZone = match?.timeZone || initialDetails.timeZone;
          setTimeZoneStatus(match ? 'City matched · time zone set automatically.' : 'Place not matched · using your current-region time zone.');
          if (match) setBirthplace(match.location);
        }
        if (!controller.signal.aborted) {
          setTimeZone(resolvedTimeZone);
          void runReading({ ...initialDetails, timeZone: resolvedTimeZone });
        }
      })();
      return () => {
        controller.abort();
        controllerRef.current?.abort();
      };
    }
    return () => controllerRef.current?.abort();
  }, [initialDetails, runReading]);

  const recommendedProducts = useMemo(() => {
    if (!recommendedElement) return [];
    const related = products.filter((product) => {
      const explicit = product.shopifyTags?.some((tag) => tag === `element-${recommendedElement.toLowerCase()}` || tag === `five-elements-${recommendedElement.toLowerCase()}`);
      if (explicit) return true;
      const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      switch (recommendedElement) {
        case 'Wood': return /wood|bodhi|seed/.test(text);
        case 'Fire': return /red|amber|tiger eye|warm/.test(text);
        case 'Earth': return /tiger eye|bodhi|seed|natural stone/.test(text);
        case 'Metal': return /howlite|white|silver|light/.test(text);
        case 'Water': return /obsidian|lava|black|dark/.test(text);
        default: return true;
      }
    });
    return (related.length ? related : products).slice(0, 3);
  }, [reading, recommendedElement, products]);
  const featuredRecommendation = recommendedProducts[0];
  const additionalRecommendations = recommendedProducts.slice(1);
  const recommendationReason = reading?.beadRecommendation.rationale || `A symbolic style direction based on the ${recommendedElement} theme.`;
  const recommendationMaterials = reading?.beadRecommendation.materials.join(' · ') || reading?.materialSuggestions.join(' · ') || (recommendedElement ? ELEMENT_MATERIALS[recommendedElement] : '');
  const recommendationColours = reading?.beadRecommendation.colours || [];

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
        setTimeZoneStatus(`Place not matched · using current-region time zone: ${timeZone}`);
      }
    }
    return match;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (birthTime && Number(birthTime.slice(0, 2)) % 2 !== 1) {
      setError('Please select one complete traditional two-hour period. The previous interval crossed two periods.');
      return;
    }
    setError('');
    setIsLoading(true);
    setLoadingMessage(birthplace.trim().length >= 2 ? 'Matching your birth location…' : 'Preparing your personal reading…');
    const selectedPlace = matchedBirthplace.current?.location === birthplace ? matchedBirthplace.current : null;
    const placeMatch = selectedPlace ? null : await lookupBirthplaceTimezone(birthplace);
    const resolvedTimeZone = selectedPlace?.timeZone || placeMatch?.timeZone || timeZone;
    setLoadingMessage('Preparing your personal reading…');
    void runReading({ birthDate, birthTime, birthplace: selectedPlace?.location || placeMatch?.location || birthplace, timeZone: resolvedTimeZone, gender });
  };

  const editDetails = () => {
    controllerRef.current?.abort();
    setIsLoading(false);
    setReading(null);
    setError('');
    setHasSubmitted(false);
  };

  return (
    <main className="flex-1 bg-[#FAF8F5]">
      <section className="relative overflow-hidden bg-[#2C1B14] text-[#FAF8F5]">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, #E1BD7E 0%, transparent 58%)' }} />
        <div className="relative max-w-5xl mx-auto px-5 py-14 sm:py-16 text-center">
          <button onClick={onBackToStore} className="absolute left-5 top-5 inline-flex items-center gap-1.5 text-xs text-[#EAE4DC] hover:text-[#E1BD7E] transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to the store
          </button>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E1BD7E] text-[11px] uppercase tracking-[0.18em] font-semibold"><span className="material-symbols-outlined text-sm">auto_awesome</span> A personal element guide</span>
          <h1 className="mt-5 font-serif text-3xl sm:text-5xl leading-tight">What might your next chapter hold?</h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#EAE4DC] leading-relaxed">Explore a BaZi-inspired reflection shaped by traditional Five Elements, Di Tian Sui and seasonal climate principles.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!reading ? (
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-7 lg:gap-10 items-start">
            <div className="lg:pt-6">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">A thoughtful tradition, made personal</p>
              <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-[#321a0f]">Start with a few details</h2>
              <p className="mt-4 text-sm text-[#625650] leading-7">Birth time and gender are optional. Explore a traditional BaZi-inspired reading shaped by your birth details.</p>
              <div className="mt-7 space-y-4 text-sm text-[#504440]">
                {['Four Pillars and seasonal reading', 'Reflections on work and relationships', 'Symbolic bead and colour suggestions'].map((item, index) => <div key={item} className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-[#EAE4DC] text-[#65451b] flex items-center justify-center text-xs font-semibold">0{index + 1}</span>{item}</div>)}
              </div>
            </div>

            <form onSubmit={submit} className="bg-white border border-[#EAE4DC] rounded-xl p-5 sm:p-7 aura-shadow space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="block text-sm font-semibold text-[#321a0f]">Date of birth <span className="text-[#a64c37]">*</span></p>
                  <div className="mt-2"><BirthDateField value={birthDate} onChange={setBirthDate} /></div>
                </div>
                <div>
                  <label htmlFor="birth-time" className="block text-sm font-semibold text-[#321a0f]">Time of birth <span className="font-normal text-[#82746f]">(optional)</span></label>
                  <span className="mt-2 block text-[10px] font-semibold leading-[15px] text-[#675a51]">Two-hour period</span>
                  <select id="birth-time" value={birthTime} onChange={(e) => { setBirthTime(e.target.value); setError(''); }} className="mt-2 w-full rounded-lg border border-[#d8cec4] bg-[#FAF8F5] px-3 py-3 text-sm text-[#321a0f] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E]">
                    {birthTime && Number(birthTime.slice(0, 2)) % 2 !== 1 && <option value={birthTime} disabled>Previous interval · reselect one traditional period</option>}
                    <option value="">Not sure / skip</option>{TIME_OPTIONS.map((hour) => {
                      const nextHour = String((Number(hour.slice(0, 2)) + 2) % 24).padStart(2, '0');
                      return <option key={hour} value={hour}>{hour}–{nextHour}:00 · {DOUBLE_HOUR_NAMES[hour]}</option>;
                    })}
                  </select>
                  <p className="mt-1.5 text-[11px] leading-4 text-[#82746f]">Each choice is one complete traditional two-hour period. Skip if unsure.</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birth-gender" className="block text-sm font-semibold text-[#321a0f]">Gender <span className="font-normal text-[#82746f]">(optional)</span></label>
                  <select id="birth-gender" value={gender} onChange={(e) => setGender(e.target.value as BirthDetails['gender'])} className="mt-2 w-full rounded-lg border border-[#d8cec4] bg-[#FAF8F5] px-3 py-3 text-sm text-[#321a0f] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E]">
                    <option value="prefer_not_to_say">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option>
                  </select>
                </div>
                <div>
                  <p className="block text-sm font-semibold text-[#321a0f]">Birth time zone <span className="font-normal text-[#82746f]">· set automatically</span></p>
                  <div className="mt-2 flex min-h-[50px] items-center rounded-lg bg-[#F7F3EF] px-3 py-2 text-xs text-[#82746f]" aria-live="polite">{timeZoneStatus}</div>
                </div>
              </div>
              <div>
                <label htmlFor="birthplace" className="block text-sm font-semibold text-[#321a0f]">Birthplace or region <span className="font-normal text-[#82746f]">(optional)</span></label>
                <div className="mt-2"><BirthplaceAutocomplete id="birthplace" value={birthplace} onChange={(value) => { setBirthplace(value); matchedBirthplace.current = null; setTimeZoneStatus('Start typing to choose a city and country.'); }} onSelect={(place) => { matchedBirthplace.current = place; setBirthplace(place.location); setTimeZone(place.timeZone); setTimeZoneStatus('City matched · time zone set automatically.'); }} placeholder="Type a city name" className="w-full rounded-lg border border-[#d8cec4] bg-[#FAF8F5] py-3 pl-9 pr-3 text-sm text-[#321a0f] placeholder:text-[#a69b91] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E]" leadingIcon /></div>
              </div>
              {error && <p role="alert" className="rounded-lg border border-[#e8c8be] bg-[#fff5f1] p-3 text-sm leading-6 text-[#8e3825]">{error}</p>}
              {isLoading && <div role="status" aria-live="polite" className="overflow-hidden rounded-lg border border-[#EAE4DC] bg-[#F7F3EF] p-3.5 text-sm text-[#504440]"><div className="flex items-center gap-3"><span className="material-symbols-outlined animate-spin text-[#8a6740]">progress_activity</span><span>{loadingMessage}</span></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-[#EAE4DC]"><div className="reading-progress h-full w-1/3 rounded-full bg-[#bd8a36]" /></div><p className="mt-2 text-xs text-[#82746f]">We’re checking your birth details and preparing your reading. This may take a moment.</p></div>}
              <button type="submit" disabled={isLoading} aria-busy={isLoading} className="group relative w-full overflow-hidden rounded-lg bg-[#321a0f] px-5 py-3.5 text-sm font-semibold tracking-wide text-white shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:bg-[#4a2f23] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1BD7E] focus-visible:ring-offset-2 active:scale-[.99] disabled:cursor-wait disabled:bg-[#5b4033] disabled:shadow-inner flex items-center justify-center gap-2">
                {isLoading ? <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>{loadingMessage}</> : <>{error ? 'Try my reading again' : 'Reveal my reading'} <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span></>}
              </button>
              <p className="text-[11px] leading-5 text-[#82746f] text-center">Birthplace is sent to Open-Meteo to infer a time zone. Birth details are sent securely to our AI reading service and are not saved by this site. Cultural reflection, not a guaranteed forecast.</p>
            </form>
          </div>
        ) : (
          <div className="space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">A traditional cultural reading</p><h2 className="mt-1 font-serif text-2xl text-[#321a0f]">Your BaZi-inspired reading</h2></div>
              <button onClick={editDetails} className="px-4 py-2 rounded-lg border border-[#d8cec4] text-sm text-[#321a0f] hover:bg-white">Edit birth details</button>
            </div>
            <section className="rounded-xl bg-white border border-[#EAE4DC] p-5 sm:p-7">
              <p className="text-sm leading-7 text-[#504440]">{reading.themes.overview}</p>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['year', 'month', 'day', 'hour'] as const).map((pillar) => <div key={pillar} className="rounded-lg bg-[#F7F3EF] p-3 text-center"><p className="text-[10px] uppercase tracking-wider text-[#82746f]">{pillar} pillar</p><p className="mt-1 font-serif text-2xl text-[#321a0f]">{reading.pillars[pillar] || '—'}</p><p className="mt-1 text-[10px] leading-4 text-[#82746f]">{pillarInEnglish(reading.pillars[pillar])}</p></div>)}
              </div>
              {(reading.dayMaster || reading.season || reading.seasonalClimate) && <div className="mt-5 grid sm:grid-cols-3 gap-4 border-t border-[#EAE4DC] pt-5 text-sm"><div><p className="text-[10px] uppercase tracking-wider text-[#82746f]">Day Master</p><p className="mt-1 text-[#321a0f]">{reading.dayMaster || '—'}</p></div><div><p className="text-[10px] uppercase tracking-wider text-[#82746f]">Season</p><p className="mt-1 text-[#321a0f]">{reading.season || '—'}</p></div><div><p className="text-[10px] uppercase tracking-wider text-[#82746f]">Seasonal climate</p><p className="mt-1 leading-6 text-[#504440]">{reading.seasonalClimate || '—'}</p></div></div>}
            </section>
            <section className="rounded-xl border border-[#EAE4DC] bg-white p-5 sm:p-7"><div><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">How the chart is built · 四柱结构</p><h3 className="mt-1 font-serif text-2xl text-[#321a0f]">Heavenly Stems 天干 &amp; Earthly Branches 地支</h3></div><p className="mt-2 text-xs leading-5 text-[#82746f]">Hidden Stems 藏干 and Ten Gods 十神 are shown with English meanings. Ten Gods are interpreted relative to the Day Master 日主.</p><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead><tr className="border-b border-[#EAE4DC] text-[10px] uppercase tracking-wider text-[#82746f]"><th className="py-3 pr-3">Pillar 四柱</th><th className="py-3 pr-3">Heavenly Stem 天干</th><th className="py-3 pr-3">Earthly Branch 地支</th><th className="py-3 pr-3">Hidden Stems 藏干</th><th className="py-3">Ten God 十神</th></tr></thead><tbody>{(['year', 'month', 'day', 'hour'] as const).map((pillar) => {
              const chars = [...(reading.pillars[pillar] || '')];
              const structure = reading.chartStructure[pillar];
              const stem = HEAVENLY_STEMS[chars[0]];
              const branch = EARTHLY_BRANCHES[chars[1]];
              const visibleGod = pillar === 'day' ? 'Day Master 日主' : structure?.visibleTenGod;
              return <tr key={pillar} className="border-b border-[#F0EBE5] align-top"><th className="py-3 pr-3 font-semibold capitalize text-[#321a0f]">{pillar}</th><td className="py-3 pr-3"><span className="font-serif text-xl text-[#321a0f]">{chars[0] || '—'}</span>{stem && <span className="ml-2 text-xs text-[#625650]">{stem.pinyin} · {stem.polarity} {stem.element}</span>}</td><td className="py-3 pr-3"><span className="font-serif text-xl text-[#321a0f]">{chars[1] || '—'}</span>{branch && <span className="ml-2 text-xs text-[#625650]">{branch.pinyin} · {branch.animal}</span>}</td><td className="py-3 pr-3">{structure?.hiddenStems.map((hidden, index) => { const hiddenStem = HEAVENLY_STEMS[hidden]; const god = structure.hiddenTenGods[index]; return <div key={`${hidden}-${index}`} className="mb-1 last:mb-0"><span className="font-serif text-base text-[#321a0f]">{hidden}</span><span className="ml-1 text-xs text-[#625650]">{hiddenStem?.pinyin} · {hiddenStem?.element}</span></div>; }) || '—'}</td><td className="py-3">{visibleGod ? <span className="inline-flex rounded-full bg-[#F3EFEA] px-2 py-1 text-xs text-[#504440]">{visibleGod}{pillar !== 'day' && structure?.visibleTenGod ? ` (${TEN_GOD_ENGLISH[structure.visibleTenGod] || ''})` : ''}</span> : '—'}{structure?.hiddenTenGods.map((god, index) => god ? <div key={`${god}-${index}`} className="mt-1 text-xs text-[#625650]">{god} · {TEN_GOD_ENGLISH[god] || 'Day Master'}</div> : null)}</td></tr>;
            })}</tbody></table></div></section>
            <section className="rounded-xl border border-[#d9c9af] bg-[#fffaf1] p-5 sm:p-7"><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#87612d]">The reading in brief</p><h3 className="mt-2 font-serif text-2xl text-[#321a0f]">Your BaZi conclusion</h3><p className="mt-3 max-w-4xl text-sm leading-7 text-[#504440]">{reading.conclusion || reading.themes.overview}</p></section>
            <section className="rounded-xl border border-[#EAE4DC] bg-white p-5 sm:p-7"><div><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">Element assessment</p><h3 className="mt-1 font-serif text-2xl text-[#321a0f]">What appears low — and what may help balance it</h3></div><p className="mt-3 text-sm leading-6 text-[#625650]">{reading.elementDiagnosis.rationale}</p><div className="mt-5 grid md:grid-cols-3 gap-4"><div className="rounded-lg bg-[#F7F3EF] p-4"><h4 className="text-xs uppercase tracking-wider font-semibold text-[#82746f]">Absent in the full chart</h4><p className="mt-2 font-semibold text-[#321a0f]">{reading.elementDiagnosis.absentElements.length ? reading.elementDiagnosis.absentElements.join(' · ') : 'No clear absence identified'}</p></div><div className="rounded-lg bg-[#F7F3EF] p-4"><h4 className="text-xs uppercase tracking-wider font-semibold text-[#82746f]">Relatively low</h4><p className="mt-2 font-semibold text-[#321a0f]">{reading.elementDiagnosis.lowerElements.length ? reading.elementDiagnosis.lowerElements.join(' · ') : 'No strong low-element signal'}</p></div><div className="rounded-lg bg-[#F7F3EF] p-4"><h4 className="text-xs uppercase tracking-wider font-semibold text-[#82746f]">Potentially supportive</h4><p className="mt-2 font-semibold text-[#321a0f]">{reading.elementDiagnosis.supportiveElements.length ? reading.elementDiagnosis.supportiveElements.join(' · ') : 'No single element selected'}</p></div></div><p className="mt-4 text-xs leading-5 text-[#82746f]">A low or absent element is not automatically the element to strengthen. The traditional reading also weighs the season, roots and overall balance.</p></section>
            <section className="rounded-xl border border-[#EAE4DC] bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">Relative chart composition</p><h3 className="mt-1 font-serif text-2xl text-[#321a0f]">Your Five Elements at a glance</h3></div><p className="text-xs text-[#82746f]">Symbolic balance · not a scientific measurement</p></div>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">{ELEMENTS_DATA.map((element) => {
                const item = reading.elementBalance.find((entry) => entry.element === element);
                const colors: Record<FiveElement, string> = { Wood: '#65836a', Fire: '#b9694f', Earth: '#b28b50', Metal: '#9c9a91', Water: '#58788a', Mixed: '#80674f' };
                const score = item?.score || 0;
                return <div key={element} className="rounded-lg bg-[#F7F3EF] p-4"><div className="flex items-center justify-between gap-2"><h4 className="font-semibold text-sm text-[#321a0f]">{element}</h4><span className="font-serif text-lg text-[#321a0f]">{score}%</span></div><div className="mt-3 h-2 rounded-full bg-[#e8e0d7] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${score}%`, background: colors[element] }} /></div><p className="mt-3 text-xs leading-5 text-[#625650]">{item?.note || 'No specific note available.'}</p></div>;
              })}</div>
              <p className="mt-4 text-xs leading-5 text-[#82746f]">A lower score does not automatically mean an element is missing or should be “added”. Traditional readings also consider season, roots and interactions.</p>
            </section>
            {recommendedElement && <section aria-labelledby="personal-bead-recommendation" className="relative overflow-hidden rounded-2xl border border-[#b89a6c] bg-[#2C1B14] text-[#FAF8F5] shadow-xl">
              <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at 12% 0%, ${ELEMENT_COLORS[recommendedElement]} 0%, transparent 55%)` }} />
              <div className="relative p-5 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-2 rounded-full border border-[#E1BD7E]/50 bg-black/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E1BD7E]"><span className="material-symbols-outlined text-sm">auto_awesome</span> Your personal bead recommendation</p>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">Matched to your {recommendedElement} theme</span>
                </div>
                <div className="mt-6 grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                  {featuredRecommendation ? <button type="button" onClick={() => onViewProduct(featuredRecommendation)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#1d120d] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1BD7E]">
                    <img src={featuredRecommendation.image} alt={featuredRecommendation.name} onError={(event) => { (event.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                    <span className="absolute left-4 top-4 rounded-full bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-[#321a0f]">Best match for your reading</span>
                    <span className="absolute bottom-4 left-4 rounded-full bg-[#2C1B14]/85 px-3 py-1.5 text-xs text-white">{recommendedElement} colour &amp; material direction</span>
                  </button> : <div className="flex min-h-64 flex-col justify-center rounded-xl border border-white/15 bg-white/5 p-6"><span className="material-symbols-outlined text-4xl text-[#E1BD7E]">spa</span><p className="mt-4 font-serif text-2xl">Explore the {recommendedElement} palette</p><p className="mt-2 text-sm leading-6 text-[#EAE4DC]">We don’t have a directly matched piece in the current catalogue yet. Browse the full collection for a style you like.</p><button onClick={onBackToStore} className="mt-5 w-fit rounded-lg bg-[#E1BD7E] px-5 py-3 text-sm font-semibold text-[#2C1B14]">Browse all pieces</button></div>}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E1BD7E]">A considered match · {recommendedElement}</p>
                    <h3 id="personal-bead-recommendation" className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">Choose a piece that feels like yours</h3>
                    <p className="mt-4 text-sm leading-7 text-[#EAE4DC]">{recommendationReason} {recommendationMaterials}{recommendationColours.length > 0 ? ` · ${recommendationColours.join(', ')}` : ''}. Use the colour, material and personal meaning as your guide.</p>
                    <p className="mt-3 text-xs leading-5 text-[#c9bdb2]">A Five-Element cultural styling suggestion for reflection and personal expression; it does not promise changes to health, energy or fortune.</p>
                    {featuredRecommendation && <div className="mt-6 rounded-xl border border-white/15 bg-black/15 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c9bdb2]">Recommended piece</p><button type="button" onClick={() => onViewProduct(featuredRecommendation)} className="mt-1 text-left font-serif text-xl leading-snug hover:text-[#E1BD7E]">{featuredRecommendation.name}</button></div>
                        <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-[#E1BD7E]">{featuredRecommendation.variants ? 'Options available' : 'Ready to add'}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div><p className="font-serif text-2xl font-bold">{formatMoney(currency === 'NZD' ? featuredRecommendation.priceNZD : currency === 'AUD' ? featuredRecommendation.priceAUD : featuredRecommendation.priceUSD, currency)}</p><p className="mt-0.5 text-[11px] text-[#c9bdb2]">Item price · shipping shown at checkout</p></div>
                        <button type="button" onClick={() => featuredRecommendation.variants ? onQuickView(featuredRecommendation.id, recommendedElement || undefined) : onAddToCart(featuredRecommendation, featuredRecommendation.defaultSize || 'Standard', undefined, recommendedElement || undefined)} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#E1BD7E] px-5 py-3 text-sm font-bold text-[#2C1B14] shadow-lg transition hover:bg-[#f0d9a9] active:scale-[.99] sm:flex-none sm:min-w-56"><span className="material-symbols-outlined text-lg">{featuredRecommendation.variants ? 'tune' : 'add_shopping_cart'}</span>{featuredRecommendation.variants ? 'Choose your style' : 'Add recommendation to bag'}</button>
                      </div>
                    </div>}
                  </div>
                </div>
                {additionalRecommendations.length > 0 && <div className="mt-8 border-t border-white/15 pt-6"><div className="flex flex-wrap items-end justify-between gap-2"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c9bdb2]">More ways to wear this element</p><h4 className="mt-1 font-serif text-xl">Other pieces you may like</h4></div><span className="text-xs text-[#c9bdb2]">Choose the one that suits your everyday style</span></div><div className="mt-4 grid gap-4 sm:grid-cols-2">{additionalRecommendations.map((product) => <ProductCard key={product.id} product={product} currency={currency} onAddToCart={(item, size, config) => onAddToCart(item, size, config, recommendedElement || undefined)} onQuickView={(id) => onQuickView(id, recommendedElement || undefined)} onViewProduct={onViewProduct} />)}</div></div>}
              </div>
            </section>}
            {reading.luckCycles.length > 0 && <section className="rounded-xl border border-[#EAE4DC] bg-white p-5 sm:p-7"><div><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">Long-term themes</p><h3 className="mt-1 font-serif text-2xl text-[#321a0f]">Life-cycle reflections</h3></div><div className="mt-5 grid md:grid-cols-3 gap-4">{reading.luckCycles.map((cycle) => <article key={cycle.period} className="rounded-lg bg-[#F7F3EF] p-4"><p className="font-serif text-lg text-[#321a0f]">{cycle.period}</p><div className="mt-1"><StarRating score={cycle.score} /></div><p className="mt-3 text-sm leading-6 text-[#625650]">{cycle.theme}</p>{cycle.supportiveElement && <p className="mt-3 text-xs text-[#4d6453]">Element theme: {cycle.supportiveElement}</p>}</article>)}</div><p className="mt-4 text-xs text-[#82746f]">Approximate traditional themes for reflection, not fixed outcomes. Birth time can affect cycle timing.</p></section>}
            {reading.annualOutlook.length > 0 && <section className="rounded-xl border border-[#EAE4DC] bg-white p-5 sm:p-7"><div><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">Year-by-year themes</p><h3 className="mt-1 font-serif text-2xl text-[#321a0f]">The years ahead</h3></div><div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-5 gap-3">{reading.annualOutlook.map((year) => <article key={year.year} className="rounded-lg border border-[#EAE4DC] p-4"><div className="flex items-center justify-between gap-2"><h4 className="font-serif text-xl text-[#321a0f]">{year.year}</h4><StarRating score={year.score} /></div><p className="mt-3 text-sm leading-6 text-[#625650]">{year.theme}</p><p className="mt-3 text-xs text-[#4d6453]"><strong>Opportunity:</strong> {year.opportunity}</p><p className="mt-2 text-xs text-[#8e5749]"><strong>Take care with:</strong> {year.caution}</p></article>)}</div></section>}
            {reading.monthlyOutlook.length > 0 && <section className="rounded-xl border border-[#EAE4DC] bg-white p-5 sm:p-7"><div><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">Month-by-month reflections</p><h3 className="mt-1 font-serif text-2xl text-[#321a0f]">A traditional outlook for the year</h3></div><div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">{reading.monthlyOutlook.map((month) => <article key={month.month} className="rounded-lg bg-[#F7F3EF] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold text-sm text-[#321a0f]">{month.month}</h4><StarRating score={month.score} /></div><p className="mt-3 text-sm leading-6 text-[#625650]">{month.theme}</p></article>)}</div><p className="mt-4 text-xs leading-5 text-[#82746f]">Ratings are traditional reflective prompts, not probabilities or guaranteed good or bad fortune.</p></section>}
            <section className="rounded-xl border border-[#EAE4DC] bg-white p-5 sm:p-7"><div><p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4d6453]">Everyday guidance</p><h3 className="mt-1 font-serif text-2xl text-[#321a0f]">Small choices to try</h3></div><div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{([['What to wear', reading.lifestyleAdvice.wearing], ['Food & routine', reading.lifestyleAdvice.food], ['Friends & connection', reading.lifestyleAdvice.relationships], ['Work & decisions', reading.lifestyleAdvice.decisions]] as const).map(([title, text]) => <article key={title} className="rounded-lg bg-[#F7F3EF] p-4"><h4 className="font-serif text-lg text-[#321a0f]">{title}</h4><p className="mt-2 text-sm leading-6 text-[#625650]">{text || 'Use this as a gentle prompt for reflection.'}</p></article>)}</div><p className="mt-4 text-xs text-[#82746f]">These are cultural lifestyle prompts, not health, financial or relationship guarantees.</p></section>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {([
                ['Personality', reading.themes.personality], ['Relationships', reading.themes.relationships], ['Work & money', reading.themes.careerAndMoney],
                ['Family & friends', reading.themes.familyAndFriends], ['A focus for growth', reading.themes.growthFocus],
              ] as const).map(([title, content]) => <section key={title} className="rounded-xl border border-[#EAE4DC] bg-white p-5"><h3 className="font-serif text-lg text-[#321a0f]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#625650]">{content}</p></section>)}
              {reading.sharedTakeaways.length > 0 && <section className="rounded-xl border border-[#EAE4DC] bg-[#F3EFEA] p-5"><h3 className="font-serif text-lg text-[#321a0f]">Key reflections</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#625650]">{reading.sharedTakeaways.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section>}
            </div>
            <div className="rounded-xl bg-[#2C1B14] p-5 sm:p-7 text-[#FAF8F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div><p className="font-serif text-lg">A note on this reading</p><p className="mt-1 max-w-3xl text-xs leading-5 text-[#EAE4DC]">This is a traditional cultural interpretation for reflection, not a certain prediction or professional advice. Bead suggestions are symbolic styling ideas, not a promise to change your future.</p></div><button onClick={onBackToStore} className="shrink-0 px-5 py-2.5 rounded-lg bg-[#E1BD7E] text-[#2C1B14] text-sm font-semibold hover:bg-[#f0d9a9]">Browse all pieces</button></div>
          </div>
        )}
      </div>
    </main>
  );
};
