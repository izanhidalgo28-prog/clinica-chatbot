// api/chat.js — Servidor intermediario seguro
// La API key NUNCA sale de aquí. El cliente solo habla con esta URL.

export default async function handler(req, res) {

  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // Permitir llamadas desde cualquier origen (ajusta esto al dominio del cliente en producción)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { messages, systemPrompt } = req.body;

  if (!messages || !systemPrompt) {
    return res.status(400).json({ error: "Faltan parámetros: messages y systemPrompt son obligatorios" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, // ← Variable de entorno privada en Vercel
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de Anthropic:", data);
      return res.status(response.status).json({ error: "Error al contactar con la IA" });
    }

    const reply = data.content?.map((b) => b.text || "").join("") || "";
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Error interno:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
