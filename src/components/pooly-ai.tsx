"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "pooly-chat-history";

export function PoolyAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Ciao! Sono PoolyAI, assistente di Pooly's Mood. Come posso aiutarti?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Message[];
      if (Array.isArray(parsed) && parsed.length) {
        setMessages(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const chatContext = useMemo(() => ({
    page: "catalogo",
    model: undefined,
  }), []);

  async function sendMessage(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isSending) return;

    const nextUserMessage = { role: "user" as const, content: value };
    const nextMessages = [...messages, nextUserMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/pooly-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: nextMessages,
          context: chatContext,
        }),
      });

      const data = (await response.json()) as { reply?: string };
      const reply = data?.reply ?? "Scusa, ho avuto un problema.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Scusa, c'è stato un errore. Riprova." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function closeChat() {
    setOpen(false);
    fetch("/api/pooly-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: messages }),
    }).catch(() => {});
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#b81111] text-sm font-semibold text-black shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition hover:scale-105"
        aria-label="Apri PoolyAI"
      >
        PoolyAI
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 h-[520px] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-[#d4af37] bg-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between border-b border-[#d4af37] bg-gradient-to-r from-green-700 via-white to-red-600 px-4 py-3 text-sm font-bold text-black">
            <span>PoolyAI di Pooly's Mood</span>
            <button
              type="button"
              onClick={closeChat}
              className="p-1 hover:opacity-70"
              aria-label="Chiudi chat"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex h-[390px] flex-col gap-3 overflow-y-auto bg-[#0a0a0a] p-4"
          >
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-[#d4af37] text-black"
                    : "mr-auto bg-[#222222] text-[#f5f5f5]"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-[#d4af37] bg-black p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Scrivi qui..."
              disabled={isSending}
              className="flex-1 rounded-full border border-[#d4af37] bg-[#111111] px-4 py-3 text-sm text-white outline-none disabled:opacity-50"
            />
            <button
              type="button"
              disabled={isSending}
              onClick={() => sendMessage()}
              className="rounded-full bg-[#d4af37] px-4 py-3 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50"
            >
              Invia
            </button>
          </div>
        </div>
      )}
    </>
  );
}
