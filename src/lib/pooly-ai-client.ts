export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * System prompt di Pooly — assistente del catalogo.
 * Personalizzalo pure se vuoi un tono diverso.
 */
export function buildSystemPrompt(): string {
  return [
    "Sei Pooly, l'assistente virtuale del sito.",
    "Rispondi sempre in italiano, in modo chiaro, cordiale e professionale.",
    "Aiuti i clienti a scegliere modelli, capire misure, capacità e differenze tra i prodotti.",
    "Se non sai qualcosa, dillo onestamente invece di inventare.",
    "Non parlare di argomenti fuori tema rispetto al catalogo e all'assistenza prodotti.",
  ].join(" ");
}

/**
 * Chiama il modello AI e restituisce la risposta testuale.
 * Usa un endpoint OpenAI-compatible (es. OpenAI, Groq, xAI, ecc.).
 */
export async function askPoolyAi(messages: ChatMessage[]): Promise<string> {
  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.XAI_API_KEY ||
    process.env.AI_API_KEY;

  const baseUrl =
    process.env.AI_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    "https://api.openai.com/v1";

  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    // Fallback di sviluppo: evita che il build/runtime esploda senza chiave
    return (
      "Pooly (modalità demo): non ho ancora una chiave AI configurata. " +
      "Imposta OPENAI_API_KEY (o XAI_API_KEY) nel file .env per abilitare le risposte reali."
    );
  }

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pooly AI error ${res.status}: ${text || res.statusText}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error("Pooly AI: risposta vuota dal modello.");
  }

  return reply;
}