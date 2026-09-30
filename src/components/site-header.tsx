import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const links = [
  { to: "/", key: "home" as const },
  { to: "/catalogo", key: "catalog" as const },
  { to: "/progetti", key: "projects" as const },
  { to: "/atelier", key: "atelier" as const },
  { to: "/licensing", key: "licensing" as const },
  { to: "/contatto", key: "contact" as const },
];

export function SiteHeader() {
  const lang = useMood((s) => s.lang);
  const setLang = useMood((s) => s.setLang);
  const t = ui[lang];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !overlay || scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300",
        solid
          ? "border-b border-border bg-bg/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-[4.5rem] md:px-8">
        <Link to="/" className="group min-w-0">
          <span className="font-display text-[1.35rem] italic leading-none text-fg md:text-[1.55rem]">
            {t.brand}
          </span>
          <span className="mt-0.5 block text-[0.625rem] uppercase tracking-[0.28em] text-accent">
            {t.manifesto}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "text-[0.72rem] uppercase tracking-[0.18em] transition-colors duration-150",
                  active ? "text-accent" : "text-muted hover:text-fg",
                )}
              >
                {t.nav[l.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-[0.6875rem] tracking-[0.14em] text-muted">
            {(["it", "en", "de"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn(
                  "min-h-11 min-w-9 px-1 uppercase transition-colors",
                  lang === code ? "text-accent" : "hover:text-fg",
                )}
                aria-pressed={lang === code}
              >
                {code}
              </button>
            ))}
          </div>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/personalizza">{t.nav.customize}</Link>
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center text-fg lg:hidden"
            aria-label={open ? t.close : t.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-bg lg:hidden">
          <nav className="flex flex-col px-5 py-6" aria-label={t.menu}>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex min-h-12 items-center border-b border-border font-display text-2xl italic text-fg"
              >
                {t.nav[l.key]}
              </Link>
            ))}
            <Link
              to="/personalizza"
              className="mt-4 flex min-h-12 items-center font-display text-2xl italic text-accent"
            >
              {t.nav.customize}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
