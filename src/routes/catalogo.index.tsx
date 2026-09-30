import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
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

  return (
    <>
      <PageHero kicker={t.catalogKicker} title={t.catalogTitle} lead={t.catalogLead} />
      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.catalogKicker}>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={cat === c.id}
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
              aria-selected={cat === "saved"}
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
          <label className="relative block w-full max-w-sm">
            <span className="sr-only">{t.search}</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPh}
              className="pl-10"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted">{cat === "saved" ? t.savedEmpty : t.empty}</p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
