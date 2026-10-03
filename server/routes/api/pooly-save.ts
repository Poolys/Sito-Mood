import { sendEmail } from "../../utils/send-email";

type MessageInput = {
  role?: string;
  content?: unknown;
};

type SaveRequest = {
  history?: unknown[];
};

export async function POST(request: Request): Promise<Response> {
  try {
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
  } catch (error) {
    console.error("pooly-save API error:", error);
    return new Response(null, { status: 200 });
  }
}
