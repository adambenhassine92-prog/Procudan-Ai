// Server-side route: keeps your Anthropic API key secret and streams the reply back.
export const runtime = "nodejs";
export const maxDuration = 60;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Serveren mangler ANTHROPIC_API_KEY. Tilføj den i .env.local (lokalt) eller i Vercel → Settings → Environment Variables." },
      { status: 500 }
    );
  }

  let payload;
  try { payload = await req.json(); } catch { return Response.json({ error: "Ugyldig forespørgsel." }, { status: 400 }); }

  const { system, messages, webSearch } = payload || {};
  if (!Array.isArray(messages)) return Response.json({ error: "Mangler beskeder." }, { status: 400 });

  const body = {
    model: MODEL,
    max_tokens: 1500,
    stream: true,
    system,
    messages,
  };
  if (webSearch) body.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }];

  let upstream;
  try {
    upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    return Response.json({ error: "Kunne ikke nå Anthropic: " + (e?.message || e) }, { status: 502 });
  }

  if (!upstream.ok) {
    let detail = "";
    try { detail = await upstream.text(); } catch { /* */ }
    return Response.json({ error: `Anthropic-fejl (${upstream.status}): ${detail.slice(0, 400)}` }, { status: upstream.status });
  }

  // Pipe the Server-Sent Events stream straight through to the browser.
  return new Response(upstream.body, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "connection": "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
