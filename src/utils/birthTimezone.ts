export interface BirthTimezoneMatch {
  timeZone: string;
  location: string;
}

interface GeocodingResult {
  name?: string;
  admin1?: string;
  country?: string;
  timezone?: string;
}

/** Resolve the historical birth-place time zone from its place name. */
export async function inferBirthTimezone(place: string, signal?: AbortSignal): Promise<BirthTimezoneMatch | null> {
  const query = place.trim();
  if (query.length < 2) return null;

  try {
    const params = new URLSearchParams({ name: query, count: '5', language: 'en', format: 'json' });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
      signal: signal || AbortSignal.timeout(7000),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = await response.json() as { results?: GeocodingResult[] };
    const result = payload.results?.find((candidate) => candidate.timezone);
    if (!result?.timezone) return null;
    const display = [result.name, result.admin1, result.country].filter((part): part is string => Boolean(part)).filter((part, index, all) => all.indexOf(part) === index).join(', ');
    return { timeZone: result.timezone, location: display || query };
  } catch {
    return null;
  }
}
