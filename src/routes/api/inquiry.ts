import { createFileRoute } from "@tanstack/react-router";

const FIELDS = [
  "name", "surname", "email", "phone", "role", "company", "model",
  "wood", "steel", "height", "width", "depth", "bottles", "notes",
] as const;
type InquiryField = (typeof FIELDS)[number];
type InquiryPayload = Record<InquiryField, string>;

function readInquiry(value: unknown): InquiryPayload | "honeypot" | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (typeof input._website === "string" && input._website.trim()) return "honeypot";
  const result = {} as InquiryPayload;
  for (const field of FIELDS) {
    if (typeof input[field] !== "string") return null;
    const max = field === "notes" ? 3000 : field === "email" ? 254 : 160;
    result[field] = input[field].trim().slice(0, max);
  }
  if (!result.name || !result.notes || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) return null;
  return result;
}

export const Route = createFileRoute("/api/inquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const length = Number(request.headers.get("content-length") ?? 0);
        if (length > 12000) return Response.json({ ok: false }, { status: 413 });
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
        const inquiry = readInquiry(payload);
        if (inquiry === "honeypot") return Response.json({ ok: true });
        if (!inquiry) return Response.json({ ok: false }, { status: 400 });
        try {
          const { deliverInquiry } = await import("@/lib/concierge-mail.server");
          const result = await deliverInquiry(inquiry);
          return Response.json({ ok: result.ok }, { status: result.ok ? 200 : 502 });
        } catch {
          return Response.json({ ok: false }, { status: 502 });
        }
      },
    },
  },
});
