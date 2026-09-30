import { createFileRoute } from "@tanstack/react-router";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero, PageShell } from "@/components/page-shell";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

type Search = { modello?: string };

export const Route = createFileRoute("/personalizza")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    modello: typeof search.modello === "string" ? search.modello : undefined,
  }),
  component: Personalizza,
});

function Personalizza() {
  const { modello } = Route.useSearch();
  const lang = useMood((s) => s.lang);
  const t = ui[lang];

  return (
    <PageShell>
      <PageHero kicker={t.nav.customize} title={t.nav.customize} lead={t.customizeLead} />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <InquiryForm defaultModel={modello ?? ""} />
      </section>
    </PageShell>
  );
}
