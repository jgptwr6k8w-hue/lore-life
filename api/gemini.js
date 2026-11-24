// Vercel Function for POST /api/gemini (same logic as netlify/functions/gemini.mjs).
import { handleGemini } from '../server/gemini.js';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { status, json } = await handleGemini(body, process.env);
  return Response.json(json, { status });
}
