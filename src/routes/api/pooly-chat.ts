import { createFileRoute } from "@tanstack/react-router";
import { askPoolyAi, buildSystemPrompt } from "../../lib/pooly-ai-client";
import { products } from "../../lib/catalog";

type MessageInput = {
  role?: string;
  content?: unknown;
};

type ChatRequest = {
  history?: unknown[];
  context?: {
    page?: string;
    model?: unknown;
  };
};

export const Route = createFileRoute("/api/pooly-chat")({
  component: () => null,
  loader: async ({ params }) => {
    void params;
    return null;
  },
  beforeLoad: async ({ request }) => {
    if (request.method !== "POST") {
      throw new Error("Method not allowed");
    }
    const body = (await request.json()) as ChatRequest;
    const history = Array.isArray(body?.history) ? body.history : [];
    const context = body?.context ?? null;

    if (!history.length) {
      throw new Error("Conversazione vuota.");
    }

    const recent = (history as MessageInput[]).filter(
      (msg: MessageInput) =>
        msg &&
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string" &&
        (msg.content as string).trim()
    );

    const lastUserMessage =
      (recent[recent.length - 1]?.content as string) ?? "";
    const conversationMessages = recent.slice(0, -1);

    let modelContext = "";

    if (
      context?.page === "catalogo" &&
      context?.model &&
      typeof context.model === "string"
    ) {
      const selected = products.find(
        (p) =>
          p.slug === context.model ||
          p.name.toLowerCase() === context.model.toLowerCase()
      );

      if (selected) {
        modelContext = `
L'utente sta osservando il modello "${selected.name}".
Categoria: ${selected.category}
Descrizione: ${selected.intro.it}
Story: ${selected.story.it}
Misure: ${selected.width}x${selected.height}x${selected.depth} mm
Capacità: ${selected.capacity.it}
`;
      }
    }

    const systemPrompt = buildSystemPrompt();

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(modelContext ? [{ role: "system" as const, content: modelContext }] : []),
      ...conversationMessages.map((msg: MessageInput) => ({
        role: (msg.role === "assistant" ? "assistant" : "user") as const,
        content: msg.content,
      })),
      { role: "user" as const, content: lastUserMessage },
    ];

    const reply = await askPoolyAi(messages);

    return Response.json({ reply });
  },
});
