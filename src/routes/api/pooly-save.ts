import { createFileRoute } from "@tanstack/react-router";
import { sendEmail } from "../../lib/send-email";

type MessageInput = {
  role?: string;
  content?: unknown;
};

type SaveRequest = {
  history?: unknown[];
};

export const Route = createFileRoute("/api/pooly-save")({
  component: () => null,
  beforeLoad: async ({ request }) => {
    if (request.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const body = (await request.json()) as SaveRequest;
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!history.length) {
      return new Response(null, { status: 200 });
    }

    const text = (history as MessageInput[])
      .map(
        (m: MessageInput) =>
          `${m.role === "user" ? "Utente" : "PoolyAI"}: ${m.content}`
      )
      .join("\n\n");

    await sendEmail({
      subject:
        "Nuova conversazione PoolyAI – " +
        new Date().toLocaleDateString("it-IT"),
      text: `Conversazione completata:\n\n${text}`,
    });

    return new Response(null, { status: 200 });
  },
});
