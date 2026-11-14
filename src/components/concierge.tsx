import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { conciergeCopy, replyToVisitor, type Lang } from "@/lib/concierge";
import { useMood } from "@/lib/store";

const KEY = "pm-concierge-v1";

function AtelierRobot() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="none"
      className="size-9 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
    >
      <path d="M32 8V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="4" r="2.5" fill="#6b2c3e" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 27h-3m40 0h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="27" r="3" fill="#1d1914" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="53" cy="27" r="3" fill="#1d1914" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15" y="12" width="34" height="34" rx="13" fill="#1d1914" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="21" width="24" height="16" rx="8" fill="#ede6d9" />
      <circle cx="27" cy="29" r="2" fill="#6b2c3e" />
      <circle cx="37" cy="29" r="2" fill="#6b2c3e" />
      <path d="M28 33c1.2 1.3 2.5 2 4 2s2.8-.7 4-2" stroke="#6b2c3e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 47c1.8-3.2 5.4-5 10-5s8.2 1.8 10 5v8H22v-8Z" fill="#6b2c3e" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m32 46 2 2-2 3-2-3 2-2Z" fill="#ede6d9" />
      <path d="M27 56v3m10-3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type StoredMessage = {
  role: "visitor" | "atelier";
  text: string;
  at: string;
};

type KeyboardLayout = { bottom: number; panelHeight: number };

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
  const [hintVisible, setHintVisible] = useState(false);
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [ready, setReady] = useState(false);
  const [sendingConversation, setSendingConversation] = useState(false);
  const [conversationStatus, setConversationStatus] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<StoredMessage[]>([]);
  const sendingRef = useRef(false);
  const pageHideSentRef = useRef(false);
  const requestCloseRef = useRef<() => void>(() => {});
  const interactedRef = useRef(false);

  useEffect(() => {
    let hideTimer = 0;
    const showTimer = window.setTimeout(() => {
      if (interactedRef.current) return;
      setHintVisible(true);
      hideTimer = window.setTimeout(() => setHintVisible(false), 5000);
    }, 10000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateKeyboardLayout = () => {
      const active = document.activeElement;
      const editing =
        active instanceof HTMLElement &&
        (active.isContentEditable || ["INPUT", "TEXTAREA"].includes(active.tagName));
      const touchLayout = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
      const obscuredHeight = Math.max(
        0,
        document.documentElement.clientHeight - viewport.height - viewport.offsetTop,
      );
      const keyboardVisible =
        touchLayout &&
        editing &&
        Math.max(obscuredHeight, window.screen.height - viewport.height) > 160;

      if (!keyboardVisible) {
        setKeyboardLayout((current) => (current === null ? current : null));
        return;
      }

      const next = {
        bottom: (obscuredHeight > 80 ? obscuredHeight : 0) + 8,
        panelHeight: Math.max(180, Math.min(512, viewport.height - 84)),
      };
      setKeyboardLayout((current) =>
        current &&
        Math.abs(current.bottom - next.bottom) < 1 &&
        Math.abs(current.panelHeight - next.panelHeight) < 1
          ? current
          : next,
      );
    };

    const onFocusOut = () => window.setTimeout(updateKeyboardLayout, 60);
    viewport.addEventListener("resize", updateKeyboardLayout);
    viewport.addEventListener("scroll", updateKeyboardLayout);
    window.addEventListener("resize", updateKeyboardLayout);
    document.addEventListener("focusin", updateKeyboardLayout);
    document.addEventListener("focusout", onFocusOut);
    updateKeyboardLayout();

    return () => {
      viewport.removeEventListener("resize", updateKeyboardLayout);
      viewport.removeEventListener("scroll", updateKeyboardLayout);
      window.removeEventListener("resize", updateKeyboardLayout);
      document.removeEventListener("focusin", updateKeyboardLayout);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => {
    const stored = readStored();
    messagesRef.current = stored;
    setMessages(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    const onPageHide = () => {
      const transcript = messagesRef.current;
      if (
        pageHideSentRef.current ||
        sendingRef.current ||
        !transcript.some((message) => message.role === "visitor")
      ) return;

      const body = JSON.stringify({ lang, messages: transcript });
      const queued = navigator.sendBeacon(
        "/api/concierge",
        new Blob([body], { type: "application/json" }),
      );
      if (queued) {
        // sendBeacon only confirms that the browser queued the request, not delivery.
        pageHideSentRef.current = true;
      } else {
        void fetch("/api/concierge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).then(async (response) => {
          const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
          if (response.ok && result?.ok) {
            writeStored([]);
            messagesRef.current = [];
          }
        }).catch(() => {});
      }
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestCloseRef.current();
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
    if (!text || sendingRef.current) return;
    const now = new Date().toISOString();
    const next: StoredMessage[] = [
      ...messages,
      { role: "visitor", text, at: now },
      { role: "atelier", text: replyToVisitor(text, lang), at: now },
    ];
    messagesRef.current = next;
    setMessages(next);
    writeStored(next);
    setConversationStatus("");
    setDraft("");
  }

  async function sendConversation(closeAfter = false) {
    const transcript = messagesRef.current;
    if (sendingRef.current || !transcript.some((message) => message.role === "visitor")) return;
    sendingRef.current = true;
    setSendingConversation(true);
    setConversationStatus("");
    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages: transcript }),
        keepalive: true,
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!response.ok || !result.ok) throw new Error("concierge-delivery-failed");
      writeStored([]);
      messagesRef.current = [];
      setMessages([]);
      setConversationStatus("");
      if (closeAfter) setOpen(false);
    } catch {
      setConversationStatus(t.conversationFailed);
    } finally {
      sendingRef.current = false;
      setSendingConversation(false);
    }
  }

  function requestClose() {
    if (sendingRef.current) return;
    if (messagesRef.current.some((message) => message.role === "visitor")) {
      void sendConversation(true);
    } else {
      setOpen(false);
    }
  }

  requestCloseRef.current = requestClose;


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
          onClick={requestClose}
        />
      ) : null}
      <div
        className="fixed right-4 bottom-[5.25rem] z-[70] flex flex-col items-end gap-3 md:bottom-6 print:hidden"
        style={keyboardLayout ? { bottom: `${keyboardLayout.bottom}px` } : undefined}
      >
        {open ? (
          <section
            role="dialog"
            aria-label={t.title}
            className="flex h-[min(32rem,calc(100dvh-9rem))] w-[min(22.5rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
            style={keyboardLayout ? { height: `${keyboardLayout.panelHeight}px` } : undefined}
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
                onClick={requestClose}
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

            {conversationStatus === t.conversationFailed ? (
              <p className="px-3 pt-2 text-xs text-muted" aria-live="polite">{conversationStatus}</p>
            ) : null}
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
        {hintVisible && !open ? (
          <button
            type="button"
            onClick={() => {
              interactedRef.current = true;
              setHintVisible(false);
              setOpen(true);
            }}
            className="relative rounded-xl border border-accent/50 bg-surface px-3 py-2 text-sm text-fg shadow-[0_8px_24px_rgba(0,0,0,0.35)] after:absolute after:-bottom-1.5 after:right-5 after:size-3 after:rotate-45 after:border-r after:border-b after:border-accent/50 after:bg-surface"
          >
            {t.prompt}
          </button>
        ) : null}
        {!open ? (
          <button
            type="button"
            aria-label={t.open}
            aria-expanded={false}
            onClick={() => {
              interactedRef.current = true;
              setHintVisible(false);
              setOpen(true);
            }}
            className="group flex size-14 items-center justify-center rounded-full border border-accent/70 bg-bg text-accent shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            <AtelierRobot />
          </button>
        ) : null}
      </div>
    </>
  );
}
