import { useState } from "react";
import { useMood } from "@/lib/store";
import type { Lang } from "@/lib/catalog";
import { ui } from "@/lib/i18n";

export const TERMS_ACCEPTANCE_KEY = "pm-terms-acceptance";
export const TERMS_ACCEPTANCE_VERSION = "2026-11-14";

const copy: Record<Lang, {
  title: string;
  subtitle: string;
  chatTitle: string;
  chatNotice: string;
  optional: string;
  readTerms: string;
  providerNote: string;
  providerLink: string;
  checkbox: string;
  decline: string;
  accept: string;
  declined: string;
  loading: string;
}> = {
  it: {
    title: "Prima di entrare",
    subtitle: "Per continuare, leggi i Termini e conferma di accettarli.",
    chatTitle: "Assistente AI: come viene usata la chat",
    chatNotice: "La chat è facoltativa. La direzione di Pooly's Mood visualizza i messaggi e li usa soltanto per rispondere alle informazioni richieste e valutare le esigenze di produzione, non per pubblicità. Per recapitare la conversazione all'atelier, il sito la invia anche a FormSubmit, un servizio tecnico esterno di consegna e-mail. Per ricordare la scelta, il sito salva un indicatore nel browser. Evita di inserire dati sensibili.",
    optional: "Puoi visitare il sito senza usare la chat.",
    readTerms: "Leggi i Termini e le informazioni complete",
    providerNote: "FormSubmit riceve i contenuti per il solo invio tecnico dell'e-mail. Consulta la sua informativa:",
    providerLink: "Informativa privacy FormSubmit",
    checkbox: "Ho letto e accetto i Termini e condizioni.",
    decline: "Declino",
    accept: "Accetto ed entro",
    declined: "Hai rifiutato i Termini. Per entrare nel sito devi accettarli; puoi chiudere questa scheda.",
    loading: "Sto verificando l'accettazione…",
  },
  en: {
    title: "Before you enter",
    subtitle: "To continue, read the Terms and confirm that you accept them.",
    chatTitle: "AI assistant: how the chat is used",
    chatNotice: "The chat is optional. Pooly's Mood management can view messages and uses them only to answer the information requested and assess production needs, not for advertising. To deliver the conversation to the atelier, the site also sends it to FormSubmit, an external email delivery service. The site stores an acceptance marker in your browser to remember your choice. Do not enter sensitive data.",
    optional: "You can browse the site without using the chat.",
    readTerms: "Read the Terms and full information",
    providerNote: "FormSubmit receives the content to deliver the email. Read its privacy notice:",
    providerLink: "FormSubmit privacy notice",
    checkbox: "I have read and accept the Terms and conditions.",
    decline: "Decline",
    accept: "Accept and enter",
    declined: "You declined the Terms. You must accept them to enter the site; you can close this tab.",
    loading: "Checking your acceptance…",
  },
  de: {
    title: "Bevor Sie eintreten",
    subtitle: "Lesen Sie zum Fortfahren die Bedingungen und bestätigen Sie Ihre Zustimmung.",
    chatTitle: "KI-Assistent: Verwendung des Chats",
    chatNotice: "Der Chat ist freiwillig. Die Leitung von Pooly's Mood kann die Nachrichten einsehen und verwendet sie ausschließlich, um die erbetenen Informationen zu beantworten und Produktionswünsche zu prüfen, nicht für Werbung. Zur Zustellung an das Atelier übermittelt die Website die Unterhaltung auch an FormSubmit, einen externen E-Mail-Zustelldienst. Die Website speichert Ihre Zustimmung im Browser. Geben Sie keine sensiblen Daten ein.",
    optional: "Sie können die Website ohne Nutzung des Chats besuchen.",
    readTerms: "Bedingungen und vollständige Informationen lesen",
    providerNote: "FormSubmit erhält die Inhalte zur technischen Zustellung der E-Mail. Lesen Sie die Datenschutzhinweise:",
    providerLink: "Datenschutzhinweise von FormSubmit",
    checkbox: "Ich habe die Nutzungsbedingungen gelesen und akzeptiere sie.",
    decline: "Ablehnen",
    accept: "Akzeptieren und eintreten",
    declined: "Sie haben die Bedingungen abgelehnt. Für den Zugang müssen Sie sie akzeptieren; Sie können diesen Tab schließen.",
    loading: "Zustimmung wird geprüft…",
  },
};

export function TermsGate({
  open,
  loading,
  onAccept,
}: {
  open: boolean;
  loading: boolean;
  onAccept: () => void;
}) {
  const lang = useMood((state) => state.lang) as Lang;
  const t = copy[lang] ?? copy.it;
  const site = ui[lang] ?? ui.it;
  const [checked, setChecked] = useState(false);
  const [declined, setDeclined] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bg/95 p-3 backdrop-blur-md sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-gate-title"
        aria-describedby="terms-gate-description"
        className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-accent/50 bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
      >
        <header className="border-b border-border px-5 py-5 sm:px-8 sm:py-7">
          <p className="text-[0.6875rem] uppercase tracking-[0.28em] text-accent">Pooly's Mood</p>
          <h1 id="terms-gate-title" className="mt-2 font-display text-3xl italic text-fg sm:text-4xl">
            {loading ? "Pooly's Mood" : t.title}
          </h1>
          <p id="terms-gate-description" className="mt-2 text-sm leading-relaxed text-muted">
            {loading ? t.loading : t.subtitle}
          </p>
        </header>

        {!loading ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-8">
            <section className="rounded-xl border border-border bg-bg/70 p-4">
              <h2 className="font-display text-xl italic text-fg">{t.chatTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t.chatNotice}</p>
              <p className="mt-2 text-xs text-subtle">{t.optional}</p>
            </section>

            <details className="rounded-xl border border-border bg-bg/40 p-4">
              <summary className="cursor-pointer text-sm font-medium text-accent">{t.readTerms}</summary>
              <div className="mt-4 max-h-[26dvh] space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-muted">
                {site.termsBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </details>

            <p className="text-xs leading-relaxed text-subtle">
              {t.providerNote}{" "}
              <a
                className="text-accent underline underline-offset-4 hover:text-fg"
                href="https://formsubmit.co/privacy.pdf"
                target="_blank"
                rel="noreferrer"
              >
                {t.providerLink}
              </a>
            </p>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg/50 p-4 text-sm leading-relaxed text-fg">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => {
                  setChecked(event.target.checked);
                  setDeclined(false);
                }}
                className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
              />
              <span>{t.checkbox}</span>
            </label>

            {declined ? <p role="status" className="text-sm text-muted">{t.declined}</p> : null}

            <div className="mt-auto flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeclined(true)}
                className="min-h-11 rounded-full border border-border px-6 text-sm text-muted transition hover:border-accent/60 hover:text-fg"
              >
                {t.decline}
              </button>
              <button
                type="button"
                onClick={onAccept}
                disabled={!checked}
                className="min-h-11 rounded-full bg-accent px-6 text-sm font-medium text-accent-fg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.accept}
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}