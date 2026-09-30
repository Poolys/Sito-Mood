import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { products, projects } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];
  const featured = products.filter((p) => p.featured);

  return (
    <PageShell>
      <section className="relative min-h-[100dvh] overflow-hidden">
        <img
          src="/mood/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/25" />
        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24">
          <p className="animate-fade-up text-[0.75rem] uppercase tracking-[0.38em] text-accent">
            {t.manifesto}
          </p>
          <h1 className="animate-fade-up mt-4 max-w-3xl font-display text-5xl leading-[0.95] text-fg italic md:text-7xl lg:text-8xl">
            {t.brand}
          </h1>
          <p className="animate-fade-up mt-6 max-w-lg font-display text-2xl leading-snug text-fg/90 italic md:text-3xl">
            {t.claim}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/catalogo">
                {t.heroCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/atelier">{t.heroSecondary}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Quotes />

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <p className="text-[0.6875rem] uppercase tracking-[0.28em] text-accent">{t.featuredKicker}</p>
          <h2 className="mt-3 font-display text-4xl italic md:text-5xl">{t.featuredTitle}</h2>
          <p className="mt-4 text-muted leading-relaxed">{t.featuredLead}</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-12">
          <Button asChild variant="outline">
            <Link to="/catalogo">
              {t.viewAll}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl md:grid-cols-2">
          <div className="relative min-h-[320px] md:min-h-[520px]">
            <img src="/mood/atelier.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center px-5 py-14 md:px-12">
            <p className="text-[0.6875rem] uppercase tracking-[0.28em] text-accent">{t.materialsKicker}</p>
            <h2 className="mt-3 font-display text-4xl italic">{t.materialsTitle}</h2>
            <div className="mt-8 space-y-8">
              <div>
                <h3 className="font-display text-2xl italic">{t.woodTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.woodBody}</p>
              </div>
              <div>
                <h3 className="font-display text-2xl italic">{t.steelTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.steelBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[0.6875rem] uppercase tracking-[0.28em] text-accent">{t.projectsKicker}</p>
            <h2 className="mt-3 font-display text-4xl italic">{t.projectsTitle}</h2>
            <p className="mt-4 text-muted leading-relaxed">{t.projectsLead}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/progetti">{t.discover}</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.map((p) => (
            <Link key={p.slug} to="/progetti" className="group">
              <div className="aspect-[16/10] overflow-hidden bg-surface-2">
                <img
                  src={p.image}
                  alt={p.title[lang]}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-4 text-[0.625rem] uppercase tracking-[0.2em] text-accent">{p.place[lang]}</p>
              <h3 className="mt-1 font-display text-2xl italic">{p.title[lang]}</h3>
              <p className="mt-2 text-sm text-muted">{p.desc[lang]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border">
        <img src="/products/allestimenti.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-bg/75" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
          <p className="text-[0.6875rem] uppercase tracking-[0.28em] text-accent">{t.licensingKicker}</p>
          <h2 className="mt-4 font-display text-4xl italic md:text-5xl">{t.licensingTitle}</h2>
          <p className="mt-5 text-muted leading-relaxed">{t.licensingLead}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/licensing">{t.licensingCta}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contatto">{t.nav.contact}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Quotes() {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];
  const items = [
    { q: t.quote1, a: t.quote1a, img: "/mood/uva.jpg" },
    { q: t.quote2, a: t.quote2a, img: "/mood/arredi.jpg" },
    { q: t.quote3, a: t.quote3a, img: "/mood/hero.jpg" },
  ];

  return (
    <section className="border-b border-border bg-bg">
      <p className="mx-auto max-w-6xl px-5 pt-14 text-[0.6875rem] uppercase tracking-[0.28em] text-accent md:px-8">
        {t.quotesKicker}
      </p>
      <div className="mx-auto grid max-w-6xl gap-px bg-border md:grid-cols-3">
        {items.map((item) => (
          <figure key={item.a} className="relative min-h-[280px] overflow-hidden bg-surface">
            <img src={item.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
            <div className="relative flex h-full flex-col justify-end p-8">
              <blockquote className="font-display text-xl leading-snug italic text-fg md:text-2xl">
                «{item.q}»
              </blockquote>
              <figcaption className="mt-4 text-[0.6875rem] uppercase tracking-[0.18em] text-accent">
                {item.a}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
