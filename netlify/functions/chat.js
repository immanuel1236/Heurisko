// Server-side proxy for the in-app chatbot — NOT currently called by the app.
// The frontend now uses a zero-cost, rule-based chatbot (see CHAT_TOPICS in
// src/App.jsx) so testing never bills your Anthropic account. This function
// is kept as a ready-to-use upgrade path: point ChatbotWidget's `send()` at
// this endpoint again when you're ready to spend real API cost for a smarter
// assistant — see README.md "Turning the chatbot back into a real AI
// assistant." Safe to leave in place either way: it does nothing unless the
// frontend calls it, and refuses to run at all without ANTHROPIC_API_KEY set.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured on this deployment." }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const { messages, system } = payload;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "messages array is required" }) };
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Model is set here, server-side, deliberately ignoring anything the
        // client might send — keeps model choice (and cost) under your control.
        model: "claude-sonnet-5",
        max_tokens: Math.min(payload.max_tokens || 300, 500),
        system: typeof system === "string" ? system.slice(0, 6000) : undefined,
        messages,
      }),
    });

    const data = await res.json();
    return {
      statusCode: res.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "Failed to reach Anthropic API", detail: err.message }) };
  }
};
