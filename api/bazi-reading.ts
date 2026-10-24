import { generateBaziReading, publicError } from '../server/bazi.js';

export const config = { maxDuration: 240 };

const recentRequests = new Map<string, number[]>();

function allowedOrigin(req: any) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; }
  catch { return false; }
}

function isRateLimited(req: any) {
  const forwarded = String(req.headers['x-forwarded-for'] || '');
  const clientIp = forwarded.split(',')[0]?.trim() || String(req.socket?.remoteAddress || 'unknown');
  const now = Date.now();
  const recent = (recentRequests.get(clientIp) || []).filter((timestamp) => now - timestamp < 10 * 60 * 1000);
  if (recent.length >= 4) {
    recentRequests.set(clientIp, recent);
    return true;
  }
  recent.push(now);
  recentRequests.set(clientIp, recent);
  return false;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }
  if (!allowedOrigin(req)) return res.status(403).json({ message: 'Request origin is not allowed.' });
  if (isRateLimited(req)) return res.status(429).json({ message: 'Too many attempts. Please wait a little before trying again.' });

  try {
    const result = await generateBaziReading(req.body, process.env.AI_GATEWAY_API_KEY, {
      claude: process.env.BAZI_CLAUDE_MODEL,
    });
    return res.status(200).json(result);
  } catch (error) {
    const safe = publicError(error);
    return res.status(safe.status).json({ message: safe.message });
  }
}
