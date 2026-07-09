// Cloudflare Pages Function — proxies requests to the Anthropic API so the
// API key never reaches the browser. Available at /api/classify.
export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });

  const data = await response.text();
  return new Response(data, {
    status: response.status,
    headers: { "Content-Type": "application/json" }
  });
}
