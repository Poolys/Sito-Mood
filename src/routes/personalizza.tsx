import { createFileRoute } from "@tanstack/react-router";
import { Configurator } from "@/components/configurator";
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
      <PageHero kicker={t.configKicker} title={t.configTitle} lead={t.configLead} />
      <Configurator initialModel={modello ?? ""} />
    </PageShell>
  );
}
