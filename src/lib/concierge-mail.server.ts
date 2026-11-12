import https from "node:https";
import { CONTACT_EMAIL } from "@/lib/site";

const TO = CONTACT_EMAIL;

export type TranscriptMessage = {
  role: "visitor" | "atelier";
  text: string;
  at: string;
};

export type InquiryEmail = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  model: string;
  wood: string;
  steel: string;
  height: string;
  width: string;
  depth: string;
  bottles: string;
  notes: string;
};

function postJson(url: string, body: unknown) {
  const data = JSON.stringify(body);
  const target = new URL(url);
  return new Promise<{ status: number; text: string }>((resolve, reject) => {
    const req = https.request(
      {
        hostname: target.hostname,
        path: `${target.pathname}${target.search}`,
        method: "POST",
        family: 4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
        timeout: 8000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk as Buffer));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            text: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end(data);
  });
}

function providerAccepted(result: { status: number; text: string }) {
  if (result.status < 200 || result.status >= 300) return false;
  try {
    const body = JSON.parse(result.text) as { success?: unknown };
    return body.success !== false && body.success !== "false";
  } catch {
    return true;
  }
}

export async function deliverConversation(input: {
  lang: string;
  messages: TranscriptMessage[];
}) {
  const lines = input.messages
    .map((message) => {
      const who = message.role === "visitor" ? "Visitatore" : "Atelier";
      return `${who} (${message.at})\n${message.text}`;
    })
    .join("\n\n");
  const messaggio = `Lingua: ${input.lang}\n\n${lines}`.slice(0, 12000);
  const result = await postJson(`https://formsubmit.co/ajax/${TO}`, {
    _subject: "Conversazione espositori — Pooly's Mood",
    _template: "box",
    _captcha: "false",
    nome: "Visitatore del sito",
    messaggio,
  });
  return { ok: providerAccepted(result), status: result.status, detail: result.text.slice(0, 400) };
}

export async function deliverInquiry(input: InquiryEmail) {
  const result = await postJson(`https://formsubmit.co/ajax/${TO}`, {
    _subject: `Richiesta ${input.model || "Pooly's Mood"}`,
    _template: "box",
    _captcha: "false",
    _replyto: input.email,
    nome: `${input.name} ${input.surname}`.trim(),
    email: input.email,
    telefono: input.phone,
    ruolo: input.role,
    azienda: input.company,
    modello: input.model,
    legno: input.wood,
    acciaio: input.steel,
    altezza_cm: input.height,
    larghezza_cm: input.width,
    profondita_cm: input.depth,
    bottiglie: input.bottles,
    messaggio: input.notes,
  });
  return { ok: providerAccepted(result), status: result.status };
}
