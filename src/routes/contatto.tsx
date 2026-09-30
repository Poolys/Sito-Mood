import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero, PageShell } from "@/components/page-shell";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/contatto")({ component: Contatto });

function Contatto() {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];

  return (
    <PageShell>
      <PageHero kicker={t.contactKicker} title={t.contactTitle} lead={t.contactLead} />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <aside className="space-y-8">
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-4 text-accent" />
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.email}</p>
              <a className="text-fg hover:text-accent" href="mailto:pooly.s_mood@outlook.com">
                pooly.s_mood@outlook.com
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-4 text-accent" />
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">{t.location}</p>
              <p className="text-fg">{t.locationNote}</p>
            </div>
          </div>
        </aside>
        <InquiryForm />
      </section>
    </PageShell>
  );
}
