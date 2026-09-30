import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-border bg-surface pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-[0.6875rem] uppercase tracking-[0.28em] text-accent">{kicker}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] text-fg italic md:text-6xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}
