export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages, system, concept, sessionId } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system,
      messages
    })
  });

  const data = await response.json();
  const aiReply = data.content?.find(b => b.type === "text")?.text || "";

  // Parse clarity score from reply
  let clarityScore = null, clarityLabel = null;
  const idx = aiReply.indexOf("CLARITY_SCORE:");
  if (idx !== -1) {
    try {
      const parsed = JSON.parse(aiReply.slice(idx + 14).trim());
      clarityScore = parsed.score;
      clarityLabel = parsed.label;
    } catch {}
  }

  // Log to Airtable (fire-and-forget)
  const userMessage = messages[messages.length - 1]?.content || "";
  if (process.env.AIRTABLE_TOKEN && userMessage) {
    fetch("https://api.airtable.com/v0/appydYluZfxlZpxyW/tblpvZXsisKg9c8yJ", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        records: [{
          fields: {
            "Concept": concept || "",
            "User Message": userMessage,
            "AI Reply": aiReply.slice(0, idx === -1 ? undefined : idx).trim(),
            "Clarity Score": clarityScore,
            "Clarity Label": clarityLabel || "",
            "Session ID": sessionId || ""
          }
        }]
      })
    }).catch(() => {});
  }

  res.status(200).json(data);
}
