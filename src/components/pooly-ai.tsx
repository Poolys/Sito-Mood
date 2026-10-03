"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { toast } from "sonner";

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
  const location = useLocation();

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

  // Fix SSR race condition: use setTimeout to ensure DOM is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [messages, open]);

  const chatContext = useMemo(() => ({
    page: location.pathname,
    model: "grok-2",
  }), [location.pathname]);

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

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = (await response.json()) as { reply?: string };
      const reply = data?.reply ?? "Scusa, ho avuto un problema.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Errore di connessione. Riprova più tardi.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Scusa, c'è stato un errore tecnico. Riprova tra qualche momento." },
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
    }).catch((err) => console.error("Failed to save chat history:", err));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-fg text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
        aria-label="Apri PoolyAI"
        aria-pressed={open}
      >
        PoolyAI
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 h-[520px] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-accent bg-surface shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-accent bg-accent/10 px-4 py-3">
            <span className="text-sm font-semibold text-accent">PoolyAI di Pooly's Mood</span>
            <button
              type="button"
              onClick={closeChat}
              className="p-1 hover:opacity-70 transition-opacity text-fg"
              aria-label="Chiudi chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex h-[390px] flex-col gap-3 overflow-y-auto bg-bg p-4"
          >
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-accent text-accent-fg"
                    : "mr-auto bg-surface-2 text-fg border border-border"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-accent bg-surface p-3">
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
              className="flex-1 rounded-full border border-accent bg-bg px-4 py-2 text-sm text-fg outline-none placeholder:text-muted disabled:opacity-50"
            />
            <button
              type="button"
              disabled={isSending}
              onClick={() => sendMessage()}
              className="rounded-full bg-accent text-accent-fg px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSending ? "..." : "Invia"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
