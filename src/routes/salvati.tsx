import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/salvati")({ component: Salvati });

function Salvati() {
  const lang = useMood((s) => s.lang);
  const saved = useMood((s) => s.saved);
  const t = ui[lang];
  const list = products.filter((p) => saved.includes(p.slug));

  return (
    <PageShell>
      <PageHero kicker={t.nav.saved} title={t.savedTitle} lead={t.savedLead} />
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        {list.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted">{t.savedEmpty}</p>
            <Button asChild className="mt-8">
              <Link to="/catalogo">{t.viewAll}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
