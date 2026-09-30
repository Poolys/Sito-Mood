import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { InquiryForm } from "@/components/inquiry-form";
import { Button } from "@/components/ui/button";
import { categories, formatMm, getProduct, relatedProducts } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/catalogo/$slug")({ component: ProductPage });

function ProductPage() {
  const { slug } = Route.useParams();
  const lang = useMood((s) => s.lang);
  const t = ui[lang];
  const product = getProduct(slug);
  const saved = useMood((s) => s.saved);
  const toggleSaved = useMood((s) => s.toggleSaved);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-5 pt-36 pb-24 text-center">
        <p className="font-display text-3xl italic">{t.notFound}</p>
        <Button asChild className="mt-8">
          <Link to="/catalogo">{t.backCatalog}</Link>
        </Button>
      </div>
    );
  }

  const cat = categories.find((c) => c.id === product.category);
  const related = relatedProducts(product.slug);
  const isSaved = saved.includes(product.slug);

  return (
    <article className="pt-20 md:pt-24">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[50vh] bg-surface-2 lg:min-h-[calc(100dvh-5rem)]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-5 py-12 md:px-12 lg:px-16">
          <Link
            to="/catalogo"
            className="mb-8 inline-flex w-fit items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted hover:text-fg"
          >
            <ArrowLeft className="size-3.5" />
            {t.backCatalog}
          </Link>
          <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-accent">
            {cat ? cat.label[lang] : product.category}
          </p>
          <h1 className="mt-3 font-display text-5xl italic leading-tight md:text-6xl">{product.name}</h1>
          <p className="mt-4 font-display text-xl italic text-fg/90">{product.claim[lang]}</p>
          <p className="mt-4 max-w-lg text-muted leading-relaxed">{product.intro[lang]}</p>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-6 text-sm">
            <div>
              <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-subtle">{t.height}</dt>
              <dd className="mt-1 tabular-nums">{formatMm(product.height, lang)}</dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-subtle">{t.width}</dt>
              <dd className="mt-1 tabular-nums">{formatMm(product.width, lang)}</dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-subtle">{t.depth}</dt>
              <dd className="mt-1 tabular-nums">{formatMm(product.depth, lang)}</dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-subtle">{t.capacity}</dt>
              <dd className="mt-1">{product.capacity[lang]}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#richiedi">{t.request}</a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/personalizza" search={{ modello: product.slug }}>
                {t.customizeCta}
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleSaved(product.slug)}
              aria-pressed={isSaved}
            >
              {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              {t.save}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="font-display text-3xl italic">{t.story}</h2>
          <p className="mt-4 leading-relaxed text-muted">{product.story[lang]}</p>
        </div>
        <div>
          <h2 className="font-display text-3xl italic">{t.specs}</h2>
          <ul className="mt-4 space-y-3">
            {product.specs[lang].map((s) => (
              <li key={s} className="border-b border-border py-2 text-sm text-fg">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section id="richiedi" className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:px-8">
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-accent">{t.contactKicker}</p>
            <h2 className="mt-3 font-display text-4xl italic">
              {t.enquireAbout} {product.name}
            </h2>
            <p className="mt-4 text-muted">{t.contactLead}</p>
          </div>
          <InquiryForm defaultModel={product.slug} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <h2 className="font-display text-3xl italic">{t.related}</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </article>
  );
}
