import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/page-shell";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/termini")({ component: Termini });

function Termini() {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];

  return (
    <PageShell>
      <PageHero kicker={t.terms} title={t.terms} />
      <section className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-muted leading-relaxed md:px-8">
        {t.termsBody.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="text-fg italic">{t.claim}</p>
      </section>
    </PageShell>
  );
}
