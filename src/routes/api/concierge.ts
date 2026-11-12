import { createFileRoute } from "@tanstack/react-router";

const MAX_MESSAGES = 30;
const MAX_TEXT = 800;

function readTranscript(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const record = value as { lang?: unknown; messages?: unknown };
  if (!Array.isArray(record.messages)) return null;
  const lang = record.lang === "en" || record.lang === "de" ? record.lang : "it";
  const messages: { role: "visitor" | "atelier"; text: string; at: string }[] = [];
  for (const item of record.messages.slice(0, MAX_MESSAGES)) {
    if (!item || typeof item !== "object") continue;
    const row = item as { role?: unknown; text?: unknown; at?: unknown };
    if (row.role !== "visitor" && row.role !== "atelier") continue;
    if (typeof row.text !== "string") continue;
    const text = row.text.trim().slice(0, MAX_TEXT);
    if (!text) continue;
    const at = typeof row.at === "string" ? row.at.slice(0, 40) : "";
    messages.push({ role: row.role, text, at });
  }
  if (!messages.some((message) => message.role === "visitor")) return null;
  return { lang, messages };
}

export const Route = createFileRoute("/api/concierge")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
        const transcript = readTranscript(payload);
        if (!transcript) return Response.json({ ok: false }, { status: 400 });
        const { deliverConversation } = await import("@/lib/concierge-mail.server");
        try {
          const result = await deliverConversation(transcript);
          return Response.json({ ok: result.ok }, { status: result.ok ? 200 : 502 });
        } catch {
          return Response.json({ ok: false }, { status: 502 });
        }
      },
    },
  },
});
