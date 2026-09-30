import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { categories } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, large }: { product: Product; large?: boolean }) {
  const lang = useMood((s) => s.lang);
  const saved = useMood((s) => s.saved);
  const toggleSaved = useMood((s) => s.toggleSaved);
  const t = ui[lang];
  const isSaved = saved.includes(product.slug);
  const cat = categories.find((c) => c.id === product.category);

  return (
    <article className="group relative flex flex-col">
      <Link
        to="/catalogo/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden bg-surface-2"
      >
        <div className={cn("relative overflow-hidden", large ? "aspect-[4/5]" : "aspect-[3/4]")}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggleSaved(product.slug)}
        className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center bg-bg/70 text-fg backdrop-blur-sm hover:text-accent"
        aria-label={t.save}
        aria-pressed={isSaved}
      >
        {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      </button>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.625rem] uppercase tracking-[0.2em] text-accent">
          {cat ? cat.label[lang] : product.category}
        </p>
        <Link to="/catalogo/$slug" params={{ slug: product.slug }}>
          <h3 className="mt-1 font-display text-2xl italic text-fg group-hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted">{product.claim[lang]}</p>
        <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.14em] text-subtle">
          {product.customSize ? t.madeToMeasure : product.capacity[lang]}
        </p>
      </div>
    </article>
  );
}
