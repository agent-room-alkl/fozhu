export interface BirthTimezoneMatch {
  timeZone: string;
  location: string;
}

export interface BirthplaceSuggestion extends BirthTimezoneMatch {
  city: string;
  country: string;
}

interface GeocodingResult {
  name?: string;
  admin1?: string;
  country?: string;
  timezone?: string;
}

/** Suggest city and country pairs while keeping the matched time zone internal. */
export async function searchBirthplaces(place: string, signal?: AbortSignal): Promise<BirthplaceSuggestion[]> {
  const query = place.trim();
  if (query.length < 2) return [];

  try {
    const params = new URLSearchParams({ name: query, count: '8', language: 'en', format: 'json' });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
      signal: signal || AbortSignal.timeout(7000),
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const payload = await response.json() as { results?: GeocodingResult[] };
    const seen = new Set<string>();
    return (payload.results || []).flatMap((result) => {
      if (!result.name || !result.country || !result.timezone) return [];
      const location = `${result.name}, ${result.country}`;
      const key = `${location}|${result.timezone}`;
      if (seen.has(key)) return [];
      seen.add(key);
      return [{ city: result.name, country: result.country, location, timeZone: result.timezone }];
    });
  } catch {
    return [];
  }
}

/** Resolve the historical birth-place time zone from its place name. */
export async function inferBirthTimezone(place: string, signal?: AbortSignal): Promise<BirthTimezoneMatch | null> {
  return (await searchBirthplaces(place, signal))[0] || null;
}
