// Shared Gemini proxy logic, used by the Netlify Function (production) and the
// Vite dev middleware (local). Keeps GEMINI_API_KEY on the server.

const MAX_PROMPT_CHARS = 20000;

export async function handleGemini(body, env) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    return { status: 500, json: { error: 'GEMINI_API_KEY is not set on the server' } };
  }

  const { prompt, systemInstruction = '', temperature = 0.7 } = body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return { status: 400, json: { error: 'prompt is required' } };
  }
  if (prompt.length > MAX_PROMPT_CHARS || String(systemInstruction).length > MAX_PROMPT_CHARS) {
    return { status: 413, json: { error: 'prompt too long' } };
  }

  const model = env.GEMINI_MODEL || 'gemini-3-flash-preview';
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: Math.min(Math.max(Number(temperature) || 0.7, 0), 2) }
  };
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: String(systemInstruction) }] };
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error(`Gemini API error ${res.status}: ${detail.slice(0, 500)}`);
    return { status: res.status === 429 ? 429 : 502, json: { error: `Gemini API error: ${res.status}` } };
  }

  const result = await res.json();
  const text = result.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  return { status: 200, json: { text } };
}
