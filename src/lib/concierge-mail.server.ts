import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/site";

const TO = CONTACT_EMAIL;
const FROM = "italiano05pooly@gmail.com";

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

function createTransport() {
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
  if (!pass) throw new Error("EMAIL_PASS is not configured");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user: FROM, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

async function sendEmail(subject: string, text: string, replyTo?: string) {
  const transport = createTransport();
  const options: { from: string; to: string; subject: string; text: string; replyTo?: string } = {
    from: `Pooly's Mood <${FROM}>`,
    to: TO,
    subject,
    text,
  };
  if (replyTo) options.replyTo = replyTo;
  await transport.sendMail(options);
}

function errorDetail(error: unknown) {
  return error instanceof Error ? error.message.slice(0, 400) : "Unknown email delivery error";
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
  try {
    await sendEmail("Conversazione espositori — Pooly's Mood", messaggio);
    return { ok: true, status: 200, detail: "Gmail SMTP accepted the message" };
  } catch (error) {
    return { ok: false, status: 502, detail: errorDetail(error) };
  }
}

export async function deliverInquiry(input: InquiryEmail) {
  const messaggio = [
    `Nome: ${input.name} ${input.surname}`.trim(),
    `E-mail: ${input.email}`,
    `Telefono: ${input.phone}`,
    `Ruolo: ${input.role}`,
    `Azienda: ${input.company}`,
    `Modello: ${input.model}`,
    `Legno: ${input.wood}`,
    `Acciaio: ${input.steel}`,
    `Altezza: ${input.height} cm`,
    `Larghezza: ${input.width} cm`,
    `Profondità: ${input.depth} cm`,
    `Bottiglie: ${input.bottles}`,
    "",
    "Richiesta:",
    input.notes,
  ].join("\n");

  try {
    await sendEmail(`Richiesta ${input.model || "Pooly's Mood"}`, messaggio, input.email);
    return { ok: true, status: 200 };
  } catch (error) {
    return { ok: false, status: 502, detail: errorDetail(error) };
  }
}
