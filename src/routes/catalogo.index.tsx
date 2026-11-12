import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { categories, products, type Category } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/catalogo/")({ component: Catalogo });

function Catalogo() {
  const lang = useMood((s) => s.lang);
  const saved = useMood((s) => s.saved);
  const t = ui[lang];
  const [cat, setCat] = useState<Category | "all" | "saved">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat === "saved" && !saved.includes(p.slug)) return false;
      if (cat !== "all" && cat !== "saved" && p.category !== cat) return false;
      if (!query) return true;
      const hay = `${p.name} ${p.claim[lang]} ${p.intro[lang]} ${p.story[lang]}`.toLowerCase();
      return hay.includes(query);
    });
  }, [cat, q, lang, saved]);

  const clearFilters = () => {
    setCat("all");
    setQ("");
  };

  return (
    <>
      <PageHero kicker={t.catalogKicker} title={t.catalogTitle} lead={t.catalogLead} />
      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.catalogKicker} aria-orientation="horizontal">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`catalog-tab-${c.id}`}
                aria-selected={cat === c.id}
                aria-controls="catalog-panel"
                tabIndex={cat === c.id ? 0 : -1}
                onClick={() => setCat(c.id)}
                className={cn(
                  "min-h-11 px-4 text-[0.6875rem] uppercase tracking-[0.16em] transition-colors",
                  cat === c.id
                    ? "bg-accent text-accent-fg"
                    : "border border-border text-muted hover:text-fg",
                )}
              >
                {c.label[lang]}
              </button>
            ))}
            <button
              type="button"
              role="tab"
              id="catalog-tab-saved"
              aria-selected={cat === "saved"}
              aria-controls="catalog-panel"
              tabIndex={cat === "saved" ? 0 : -1}
              onClick={() => setCat("saved")}
              className={cn(
                "min-h-11 px-4 text-[0.6875rem] uppercase tracking-[0.16em] transition-colors",
                cat === "saved"
                  ? "bg-accent text-accent-fg"
                  : "border border-border text-muted hover:text-fg",
              )}
            >
              {t.saved}
            </button>
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <label className="relative block flex-1">
              <span className="sr-only">{t.search}</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPh} className="pl-10" />
            </label>
            {(q || cat !== "all") && (
              <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-[0.625rem] uppercase tracking-[0.14em] text-muted hover:text-fg" aria-label={t.searchClear}>
                <X className="size-3.5" />{t.searchClear}
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted">{cat === "saved" ? t.savedEmpty : t.empty}</p>
            {(q || cat !== "all") && <button type="button" onClick={clearFilters} className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg">{t.searchClear}</button>}
          </div>
        ) : (
          <div id="catalog-panel" role="tabpanel" aria-labelledby={`catalog-tab-${cat}`} className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
