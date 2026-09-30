import { createFileRoute } from "@tanstack/react-router";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero, PageShell } from "@/components/page-shell";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";

export const Route = createFileRoute("/licensing")({ component: Licensing });

function Licensing() {
  const lang = useMood((s) => s.lang);
  const t = ui[lang];

  return (
    <PageShell>
      <PageHero kicker={t.licensingKicker} title={t.licensingTitle} lead={t.licensingLead} />
      <section className="relative overflow-hidden">
        <img src="/products/allestimenti.jpg" alt="" className="h-[42vh] w-full object-cover" />
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8">
        <div className="space-y-6 text-muted leading-relaxed">
          <p>{t.atelierP2}</p>
          <p>{t.footerLicense}</p>
          <p>
            <a className="text-accent hover:text-fg" href="mailto:pooly.s_mood@outlook.com">
              pooly.s_mood@outlook.com
            </a>
          </p>
        </div>
        <InquiryForm />
      </section>
    </PageShell>
  );
}
