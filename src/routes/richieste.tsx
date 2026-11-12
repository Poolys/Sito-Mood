import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { PageHero, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { getProduct, steels, woods } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/richieste")({ component: Richieste });

function Richieste() {
  const lang = useMood((s) => s.lang);
  const inquiries = useMood((s) => s.inquiries);
  const removeInquiry = useMood((s) => s.removeInquiry);
  const t = ui[lang];

  return (
    <PageShell>
      <PageHero kicker={t.nav.requests} title={t.requestsTitle} lead={t.requestsLead} />
      <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        {inquiries.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted">{t.requestsEmpty}</p>
            <Button asChild className="mt-8">
              <Link to="/personalizza">{t.openConfig}</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {inquiries.map((item) => {
              const product = getProduct(item.model);
              const wood = woods.find((w) => w.id === item.wood)?.label[lang] ?? item.wood;
              const steel = steels.find((s) => s.id === item.steel)?.label[lang] ?? item.steel;
              const when = new Date(item.at);
              return (
                <li key={item.id} className="flex items-start gap-4 py-6">
                  {product ? (
                    <img
                      src={product.image}
                      alt=""
                      className="size-20 shrink-0 object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl italic">{product?.name ?? item.model}</p>
                    <p className="mt-1 text-sm text-muted">
                      {[wood, steel, item.height && `${item.height}×${item.width}×${item.depth} ${t.cm}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.14em] text-subtle">
                      {when.toLocaleDateString(lang === "de" ? "de" : lang === "en" ? "en" : "it", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInquiry(item.id)}
                    className="flex min-h-11 shrink-0 items-center gap-2 px-2 text-xs text-muted hover:text-accent"
                    aria-label={t.removeRequest}
                    title={t.removeRequest}
                  >
                    <Trash2 className="size-4" />
                    <span className="hidden sm:inline">{t.removeRequest}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
