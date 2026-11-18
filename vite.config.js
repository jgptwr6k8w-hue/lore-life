import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleGemini } from './server/gemini.js';

// Serves POST /api/gemini during `npm run dev`, mirroring netlify/functions/gemini.mjs.
function geminiDevApi(env) {
  return {
    name: 'lore-gemini-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/gemini', async (req, res) => {
        const send = (status, json) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(json));
        };
        if (req.method !== 'POST') return send(405, { error: 'Method not allowed' });
        let raw = '';
        for await (const chunk of req) raw += chunk;
        let body;
        try {
          body = JSON.parse(raw || '{}');
        } catch {
          return send(400, { error: 'Invalid JSON' });
        }
        try {
          const { status, json } = await handleGemini(body, env);
          send(status, json);
        } catch (err) {
          console.error(err);
          send(500, { error: 'Gemini proxy failed' });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load all vars from .env (not only VITE_*) for the server-side dev proxy.
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return {
    plugins: [react(), geminiDevApi(env)],
  };
});
