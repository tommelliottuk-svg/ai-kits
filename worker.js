export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/classify" && request.method === "POST") {
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

    return env.ASSETS.fetch(request);
  }
};
