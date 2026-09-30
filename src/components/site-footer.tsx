import { Link } from "@tanstack/react-router";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export function SiteFooter() {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-2xl italic text-fg">{t.brand}</p>
          <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.24em] text-accent">
            {t.manifesto}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t.claim}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Link to="/catalogo" className="text-muted hover:text-fg">
            {t.nav.catalog}
          </Link>
          <Link to="/progetti" className="text-muted hover:text-fg">
            {t.nav.projects}
          </Link>
          <Link to="/atelier" className="text-muted hover:text-fg">
            {t.nav.atelier}
          </Link>
          <Link to="/licensing" className="text-muted hover:text-fg">
            {t.nav.licensing}
          </Link>
          <Link to="/contatto" className="text-muted hover:text-fg">
            {t.nav.contact}
          </Link>
          <Link to="/termini" className="text-muted hover:text-fg">
            {t.terms}
          </Link>
        </div>
        <div className="space-y-2 text-sm text-muted">
          <p>{t.footerDesigned}</p>
          <p>{t.footerMaterials}</p>
          <p>
            <a className="text-accent hover:text-fg" href="mailto:pooly.s_mood@outlook.com">
              pooly.s_mood@outlook.com
            </a>
          </p>
          <p>{t.footerLicense}</p>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-5 text-[0.6875rem] uppercase tracking-[0.16em] text-subtle md:px-8">
          {t.footerCopy}
        </p>
      </div>
    </footer>
  );
}
