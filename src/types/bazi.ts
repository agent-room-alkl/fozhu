export type FiveElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water' | 'Mixed';

export interface SharedBaziReading {
  status: 'aligned' | 'needs_review';
  pillars: { year: string | null; month: string | null; day: string | null; hour: string | null };
  chartStructure: Record<'year' | 'month' | 'day' | 'hour', {
    stem: string;
    branch: string;
    hiddenStems: string[];
    visibleTenGod: string;
    hiddenTenGods: string[];
  } | null>;
  dayMaster: string | null;
  season: string | null;
  seasonalClimate: string;
  elementFocus: FiveElement | null;
  conclusion: string;
  elementDiagnosis: {
    absentElements: Exclude<FiveElement, 'Mixed'>[];
    lowerElements: Exclude<FiveElement, 'Mixed'>[];
    supportiveElements: Exclude<FiveElement, 'Mixed'>[];
    rationale: string;
  };
  beadRecommendation: { element: FiveElement | null; materials: string[]; colours: string[]; rationale: string };
  lifestyleAdvice: { wearing: string; food: string; relationships: string; decisions: string };
  elementBalance: { element: Exclude<FiveElement, 'Mixed'>; score: number; note: string }[];
  luckCycles: { period: string; score: number; theme: string; supportiveElement: string | null }[];
  annualOutlook: { year: number; score: number; theme: string; opportunity: string; caution: string }[];
  monthlyOutlook: { month: string; score: number; theme: string }[];
  themes: {
    overview: string;
    personality: string;
    relationships: string;
    careerAndMoney: string;
    familyAndFriends: string;
    growthFocus: string;
  };
  sharedTakeaways: string[];
  materialSuggestions: string[];
  message: string;
}

export async function requestSharedBaziReading(details: {
  birthDate: string;
  birthTime: string;
  birthplace: string;
  timeZone: string;
  gender: 'female' | 'male' | 'prefer_not_to_say';
}, signal?: AbortSignal): Promise<SharedBaziReading> {
  const response = await fetch('/api/bazi-reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    signal,
    body: JSON.stringify(details),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof result.message === 'string' ? result.message : 'We could not complete your reading right now.');
  if (!result || !['aligned', 'needs_review'].includes(result.status)) throw new Error('The reading service returned an unexpected result.');
  return result as SharedBaziReading;
}
