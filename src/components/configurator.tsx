import { useEffect, useMemo, useState } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { getProduct, products, steels, woods } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";
import { cn } from "@/lib/utils";

const WOOD_CLASS: Record<string, string> = {
  oak: "bg-wood-oak",
  walnut: "bg-wood-walnut",
  chestnut: "bg-wood-chestnut",
  cherry: "bg-wood-cherry",
};

const STEEL_CLASS: Record<string, string> = {
  mirror: "bg-steel-mirror",
  brushed: "bg-steel-brushed",
  black: "bg-steel-black",
};

export function Configurator({ initialModel = "" }: { initialModel?: string }) {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];
  const start = getProduct(initialModel) ?? products[0];
  const [slug, setSlug] = useState(start.slug);
  const [wood, setWood] = useState<(typeof woods)[number]["id"]>(woods[0].id);
  const [steel, setSteel] = useState<(typeof steels)[number]["id"]>(steels[0].id);
  const product = getProduct(slug) ?? products[0];
  const [height, setHeight] = useState(Math.round(product.height / 10));
  const [width, setWidth] = useState(Math.round(product.width / 10));
  const [depth, setDepth] = useState(Math.round(product.depth / 10));
  const [bottles, setBottles] = useState(8);

  useEffect(() => {
    if (initialModel && initialModel !== slug) pickModel(initialModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialModel]);

  function pickModel(next: string) {
    const p = getProduct(next);
    if (!p) return;
    setSlug(p.slug);
    setHeight(Math.round(p.height / 10));
    setWidth(Math.round(p.width / 10));
    setDepth(Math.round(p.depth / 10));
  }

  const woodLabel = woods.find((w) => w.id === wood)?.label[lang] ?? wood;
  const steelLabel = steels.find((s) => s.id === steel)?.label[lang] ?? steel;

  const summary = useMemo(
    () =>
      [
        product.name,
        woodLabel,
        steelLabel,
        `${height} × ${width} × ${depth} ${t.cm}`,
        `${bottles} ${t.bottles.toLowerCase()}`,
      ].join(" · "),
    [product.name, woodLabel, steelLabel, height, width, depth, bottles, t.cm, t.bottles],
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:px-8 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-accent">{t.yourPiece}</p>
        <div className="relative mt-4 aspect-[3/4] overflow-hidden bg-surface-2">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/70 to-transparent p-5">
            <p className="font-display text-3xl italic">{product.name}</p>
            <p className="mt-1 text-sm text-muted">{product.claim[lang]}</p>
            <div className="mt-4 flex h-2 overflow-hidden">
              <span className={cn("flex-1", WOOD_CLASS[wood])} />
              <span className={cn("w-1/3", STEEL_CLASS[steel])} />
            </div>
            <p className="mt-3 text-[0.75rem] leading-relaxed text-fg/90">{summary}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="font-display text-2xl italic">{t.configModel}</h2>
          <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
            {products.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => pickModel(p.slug)}
                className={cn(
                  "w-28 shrink-0 text-left",
                  slug === p.slug ? "text-accent" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "block aspect-[3/4] overflow-hidden bg-surface-2",
                    slug === p.slug ? "shadow-border-hover" : "shadow-border",
                  )}
                >
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="mt-2 block font-display text-sm italic">{p.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl italic">{t.configMatter}</h2>
          <p className="mt-4 text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.formWood}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {woods.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWood(w.id)}
                className={cn(
                  "flex min-h-12 items-center gap-3 px-3 text-left text-sm",
                  wood === w.id ? "bg-surface-2 text-fg shadow-border-hover" : "text-muted shadow-border",
                )}
              >
                <span className={cn("size-6 shrink-0", WOOD_CLASS[w.id])} />
                {w.label[lang]}
              </button>
            ))}
          </div>
          <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.formSteel}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {steels.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSteel(s.id)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-2 px-2 text-center text-xs",
                  steel === s.id ? "bg-surface-2 text-fg shadow-border-hover" : "text-muted shadow-border",
                )}
              >
                <span className={cn("size-6", STEEL_CLASS[s.id])} />
                {s.label[lang]}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl italic">{t.configMeasure}</h2>
          <div className="mt-6 grid gap-6">
            <SliderRow label={t.height} value={height} min={50} max={250} unit={t.cm} onChange={setHeight} />
            <SliderRow label={t.width} value={width} min={40} max={400} unit={t.cm} onChange={setWidth} />
            <SliderRow label={t.depth} value={depth} min={8} max={80} unit={t.cm} onChange={setDepth} />
            <SliderRow label={t.bottles} value={bottles} min={1} max={120} onChange={setBottles} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl italic">{t.configSend}</h2>
          <p className="mt-2 text-sm text-muted">{t.customizeLead}</p>
          <div className="mt-6">
            <InquiryForm
              defaultModel={slug}
              hideSpecs
              defaults={{
                wood,
                steel,
                height: String(height),
                width: String(width),
                depth: String(depth),
                bottles: String(bottles),
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-baseline justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="tabular-nums text-fg">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
