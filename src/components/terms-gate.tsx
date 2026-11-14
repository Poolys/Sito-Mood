import { useState } from "react";
import { useMood } from "@/lib/store";
import type { Lang } from "@/lib/catalog";
import { ui } from "@/lib/i18n";

export const TERMS_ACCEPTANCE_KEY = "pm-terms-acceptance";
export const TERMS_ACCEPTANCE_VERSION = "2026-11-14";

const copy: Record<Lang, {
  title: string;
  loading: string;
  checkbox: string;
  readTerms: string;
  decline: string;
  accept: string;
  declined: string;
}> = {
  it: {
    title: "Prima di entrare",
    loading: "Sto verificando l'accettazione…",
    checkbox: "Ho letto e accetto i",
    readTerms: "Termini e condizioni",
    decline: "Declino",
    accept: "Accetto ed entro",
    declined: "Hai rifiutato i Termini. Per entrare nel sito devi accettarli; puoi chiudere questa scheda.",
  },
  en: {
    title: "Before you enter",
    loading: "Checking your acceptance…",
    checkbox: "I have read and accept the",
    readTerms: "Terms and conditions",
    decline: "Decline",
    accept: "Accept and enter",
    declined: "You declined the Terms. You must accept them to enter the site; you can close this tab.",
  },
  de: {
    title: "Bevor Sie eintreten",
    loading: "Zustimmung wird geprüft…",
    checkbox: "Ich habe die",
    readTerms: "Nutzungsbedingungen gelesen und akzeptiere sie",
    decline: "Ablehnen",
    accept: "Akzeptieren und eintreten",
    declined: "Sie haben die Bedingungen abgelehnt. Für den Zugang müssen Sie sie akzeptieren; Sie können diesen Tab schließen.",
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
  const [termsExpanded, setTermsExpanded] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-md sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-gate-title"
        className="w-full max-w-md rounded-2xl border border-accent/50 bg-surface px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:px-8 sm:py-8"
      >
        <header className="text-center">
          <img
            src="/favicon.svg"
            alt=""
            className="mx-auto size-14 rounded-xl border border-accent/30 bg-bg p-2"
          />
          <p className="mt-3 font-display text-3xl italic leading-none text-fg">Pooly's Mood</p>
          <p className="mt-1 text-[0.625rem] uppercase tracking-[0.3em] text-accent">Gaudium Vino</p>
          <h1 id="terms-gate-title" className="mt-5 font-display text-xl italic text-muted">
            {loading ? t.loading : t.title}
          </h1>
        </header>

        {!loading ? (
          <div className="mt-6">
            <div className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-bg/50 px-3 py-3 text-center text-sm leading-snug text-fg">
              <input
                id="terms-accepted"
                name="termsAccepted"
                type="checkbox"
                checked={checked}
                onChange={(event) => {
                  setChecked(event.target.checked);
                  setDeclined(false);
                }}
                className="size-4 shrink-0 accent-[var(--color-accent)]"
              />
              <label htmlFor="terms-accepted">{t.checkbox}</label>
              <button
                type="button"
                aria-expanded={termsExpanded}
                aria-controls="terms-gate-full-terms"
                className="text-accent underline underline-offset-4 hover:text-fg"
                onClick={() => setTermsExpanded((expanded) => !expanded)}
              >
                {t.readTerms}
              </button>
            </div>

            {termsExpanded ? (
              <div id="terms-gate-full-terms" className="mt-3 max-h-48 space-y-3 overflow-y-auto rounded-xl border border-border bg-bg/50 p-4 text-xs leading-relaxed text-muted">
                {site.termsBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <a className="text-accent underline underline-offset-4 hover:text-fg" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                  {lang === "de" ? "Google-Datenschutzerklärung" : lang === "en" ? "Google Privacy Policy" : "Informativa privacy Google"}
                </a>
              </div>
            ) : null}

            {declined ? <p role="status" className="mt-3 text-center text-sm text-muted">{t.declined}</p> : null}

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
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
