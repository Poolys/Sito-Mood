import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { conciergeCopy, replyToVisitor, type Lang } from "@/lib/concierge";
import { useMood } from "@/lib/store";

const KEY = "pm-concierge-v1";

type StoredMessage = {
  role: "visitor" | "atelier";
  text: string;
  at: string;
};

function readStored(): StoredMessage[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredMessage =>
        !!item &&
        typeof item === "object" &&
        ((item as StoredMessage).role === "visitor" || (item as StoredMessage).role === "atelier") &&
        typeof (item as StoredMessage).text === "string",
    );
  } catch {
    return [];
  }
}

function writeStored(messages: StoredMessage[]) {
  try {
    if (messages.length === 0) {
      window.localStorage.removeItem(KEY);
      return;
    }
    window.localStorage.setItem(KEY, JSON.stringify(messages));
  } catch {
    // Keep the current conversation usable for this page even if storage is blocked.
  }
}

export function Concierge() {
  const lang = useMood((s) => s.lang) as Lang;
  const t = conciergeCopy[lang] ?? conciergeCopy.it;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [ready, setReady] = useState(false);
  const [sendingConversation, setSendingConversation] = useState(false);
  const [conversationStatus, setConversationStatus] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(readStored());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, open]);

  function send() {
    const text = draft.trim();
    if (!text || sendingConversation) return;
    const now = new Date().toISOString();
    const next: StoredMessage[] = [
      ...messages,
      { role: "visitor", text, at: now },
      { role: "atelier", text: replyToVisitor(text, lang), at: now },
    ];
    setMessages(next);
    writeStored(next);
    setConversationStatus("");
    setDraft("");
  }

  async function sendConversation() {
    if (sendingConversation || !messages.some((message) => message.role === "visitor")) return;
    setSendingConversation(true);
    setConversationStatus("");
    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages }),
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!response.ok || !result.ok) throw new Error("concierge-delivery-failed");
      writeStored([]);
      setMessages([]);
      setConversationStatus(t.conversationSent);
    } catch {
      setConversationStatus(t.conversationFailed);
    } finally {
      setSendingConversation(false);
    }
  }

  function clearConversation() {
    if (sendingConversation) return;
    writeStored([]);
    setMessages([]);
    setConversationStatus("");
  }

  const shown: StoredMessage[] =
    messages.length > 0
      ? messages
      : [{ role: "atelier", text: replyToVisitor("ciao", lang), at: "" }];

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[65] cursor-default bg-black/20"
          aria-label={t.close}
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className="fixed right-4 bottom-[5.25rem] z-[70] flex flex-col items-end gap-3 md:bottom-6 print:hidden">
        {open ? (
          <section
            role="dialog"
            aria-label={t.title}
            className="flex h-[min(32rem,calc(100dvh-9rem))] w-[min(22.5rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
          >
            <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-fg">
                <MessageCircle className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg italic leading-none">{t.title}</span>
                <span className="mt-1 block text-[0.625rem] uppercase tracking-[0.18em] text-accent">
                  {t.sub}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="flex size-8 items-center justify-center text-muted hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </header>
            <div ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto bg-surface-2/40 px-3 py-3">
              {shown.map((message, index) => (
                <p
                  key={`${message.at}-${index}`}
                  className={
                    message.role === "visitor"
                      ? "ml-10 self-end rounded-2xl rounded-br-sm bg-accent px-3 py-2 text-sm leading-snug text-accent-fg"
                      : "mr-8 self-start rounded-2xl rounded-bl-sm bg-surface px-3 py-2 text-sm leading-snug text-fg whitespace-pre-wrap"
                  }
                >
                  {message.text}
                </p>
              ))}
            </div>
            <p className="px-3 pt-2 text-[0.65rem] leading-snug text-subtle">{t.note}</p>
            {messages.some((message) => message.role === "visitor") ? (
              <div className="px-3 pt-2">
                <button
                  type="button"
                  onClick={() => void sendConversation()}
                  disabled={sendingConversation}
                  className="min-h-10 w-full rounded-full bg-accent px-4 text-xs font-medium text-accent-fg disabled:opacity-60"
                >
                  {sendingConversation ? t.sendingConversation : t.sendConversation}
                </button>
                <button
                  type="button"
                  onClick={clearConversation}
                  disabled={sendingConversation}
                  className="mt-1 min-h-10 w-full px-4 text-xs text-muted underline underline-offset-4 hover:text-fg disabled:opacity-60"
                >
                  {t.clearConversation}
                </button>
              </div>
            ) : null}
            <p className="px-3 pt-2 text-xs text-muted" aria-live="polite">{conversationStatus}</p>
            <form
              className="flex items-center gap-2 px-3 pt-2 pb-3"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                className="h-11 min-w-0 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent"
                maxLength={800}
              disabled={!ready || sendingConversation}
              />
              <button
                type="submit"
                aria-label={t.send}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg disabled:opacity-40"
                disabled={!draft.trim() || sendingConversation}
              >
                <Send className="size-4" />
              </button>
            </form>
          </section>
        ) : null}
        <button
          type="button"
          aria-label={open ? t.close : t.open}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex size-14 items-center justify-center rounded-full border border-accent/70 bg-bg text-accent shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        >
          {open ? <X className="size-5" /> : <MessageCircle className="size-6" />}
        </button>
      </div>
    </>
  );
}
