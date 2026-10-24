export default function handler(
  request: { headers: Record<string, string | string[] | undefined> },
  response: { setHeader: (name: string, value: string) => void; status: (code: number) => { json: (body: unknown) => void } },
) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const rawCountryCode = request.headers['x-vercel-ip-country'];
  const countryCode = Array.isArray(rawCountryCode) ? rawCountryCode[0] : rawCountryCode;
  response.status(200).json({
    countryCode: countryCode && /^[A-Za-z]{2}$/.test(countryCode) ? countryCode.toUpperCase() : null,
  });
}
