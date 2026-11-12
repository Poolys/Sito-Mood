import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Home, Inbox, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppTabs() {
  const lang = useMood((s) => s.lang);
  const saved = useMood((s) => s.saved);
  const inquiries = useMood((s) => s.inquiries);
  const t = ui[lang];
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const tabs = [
    { to: "/", label: t.nav.home, icon: Home, match: (p: string) => p === "/" },
    {
      to: "/catalogo",
      label: t.nav.catalog,
      icon: LayoutGrid,
      match: (p: string) => p.startsWith("/catalogo"),
    },
    {
      to: "/personalizza",
      label: t.nav.customize,
      icon: SlidersHorizontal,
      match: (p: string) => p.startsWith("/personalizza"),
    },
    {
      to: "/salvati",
      label: t.nav.saved,
      icon: Bookmark,
      match: (p: string) => p.startsWith("/salvati"),
      count: saved.length,
    },
    {
      to: "/richieste",
      label: t.nav.requests,
      icon: Inbox,
      match: (p: string) => p.startsWith("/richieste"),
      count: inquiries.length,
    },
  ] as const;

  return (
    <nav
      className="app-tabs fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 backdrop-blur-md md:hidden"
      aria-label={t.menu}
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          const count = "count" in tab ? tab.count : 0;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.625rem] uppercase tracking-[0.12em]",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 1.75 : 1.5} />
                <span>{tab.label}</span>
                {count ? (
                  <span className="absolute top-1.5 right-[calc(50%-1.4rem)] flex size-4 items-center justify-center bg-accent text-[0.5625rem] text-accent-fg">
                    {count > 9 ? "9+" : count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
