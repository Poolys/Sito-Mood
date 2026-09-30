import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/atelier")({ component: Atelier });

function Atelier() {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];

  return (
    <PageShell>
      <PageHero kicker={t.atelierKicker} title={t.atelierTitle} lead={t.atelierLead} />
      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[360px]">
          <img src="/mood/atelier.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-5 py-14 md:px-12">
          <p className="leading-relaxed text-muted">{t.atelierP1}</p>
          <p className="mt-5 leading-relaxed text-muted">{t.atelierP2}</p>
          <p className="mt-5 leading-relaxed text-muted">{t.atelierP3}</p>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {t.values.map((v) => (
            <div key={v.t} className="bg-surface px-6 py-10">
              <h3 className="font-display text-2xl italic">{v.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-accent">{t.materialsKicker}</p>
            <h2 className="mt-3 font-display text-4xl italic">{t.woodTitle}</h2>
            <p className="mt-4 text-muted leading-relaxed">{t.woodBody}</p>
          </div>
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-accent">{t.materialsKicker}</p>
            <h2 className="mt-3 font-display text-4xl italic">{t.steelTitle}</h2>
            <p className="mt-4 text-muted leading-relaxed">{t.steelBody}</p>
          </div>
        </div>
        <div className="mt-12">
          <Button asChild>
            <Link to="/contatto">{t.nav.contact}</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-20 md:px-8">
          <h2 className="font-display text-3xl italic">{t.faqTitle}</h2>
          <dl className="mt-10 space-y-8">
            {t.faqs.map((f) => (
              <div key={f.q} className="border-b border-border pb-8">
                <dt className="font-display text-xl italic">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </PageShell>
  );
}
