import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { generateBaziReading, publicError } from './server/bazi.js';

function baziApiPlugin(apiKey: string, model: string | undefined) {
  const recentRequests = new Map<string, number[]>();
  return {
    name: 'fozhu-bazi-api',
    configureServer(server: any) {
      server.middlewares.use('/api/bazi-reading', async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Allow', 'POST');
          res.end(JSON.stringify({ message: 'Method not allowed.' }));
          return;
        }
        const origin = req.headers.origin;
        try {
          if (origin && new URL(origin).host !== req.headers.host) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: 'Request origin is not allowed.' }));
            return;
          }
        } catch {
          res.statusCode = 403;
          res.end(JSON.stringify({ message: 'Request origin is not allowed.' }));
          return;
        }

        const clientIp = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
        const now = Date.now();
        const recent = (recentRequests.get(clientIp) || []).filter((timestamp) => now - timestamp < 10 * 60 * 1000);
        if (recent.length >= 4) {
          res.statusCode = 429;
          res.end(JSON.stringify({ message: 'Too many attempts. Please wait a little before trying again.' }));
          return;
        }
        recent.push(now);
        recentRequests.set(clientIp, recent);

        try {
          const chunks: Uint8Array[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 12_000) {
              res.statusCode = 413;
              res.end(JSON.stringify({ message: 'Request is too large.' }));
              return;
            }
            chunks.push(chunk);
          }
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const result = await generateBaziReading(body, apiKey, { claude: model });
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        } catch (error) {
          const safe = publicError(error);
          res.statusCode = safe.status;
          res.end(JSON.stringify({ message: safe.message }));
        }
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), baziApiPlugin(env.AI_GATEWAY_API_KEY, env.BAZI_CLAUDE_MODEL)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
