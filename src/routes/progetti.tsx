import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/page-shell";
import { projects } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/progetti")({ component: Progetti });

function Progetti() {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];

  return (
    <PageShell>
      <PageHero kicker={t.projectsKicker} title={t.projectsTitle} lead={t.projectsLead} />
      <section className="mx-auto max-w-6xl space-y-20 px-5 py-16 md:px-8">
        {projects.map((p, i) => (
          <article
            key={p.slug}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                <img src={p.image} alt={p.title[lang]} className="h-full w-full object-cover" />
              </div>
            </div>
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-accent">{p.place[lang]}</p>
              <h2 className="mt-3 font-display text-4xl italic">{p.title[lang]}</h2>
              <p className="mt-4 leading-relaxed text-muted">{p.desc[lang]}</p>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
