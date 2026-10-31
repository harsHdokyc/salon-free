import { createFileRoute } from "@tanstack/react-router";
import { SALON } from "@/lib/salon";
import { FadeIn, PageHeader, pillClass, Arrow } from "@/components/site/motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Hours — Rochers Salon, Lodhi Colony Delhi" },
      { name: "description", content: "Find Rochers in Meherchand Market, Lodhi Colony. Opening hours, phone, WhatsApp, Instagram and map directions." },
      { property: "og:title", content: "Visit Rochers, Lodhi Colony" },
      { property: "og:description", content: "Address, hours, phone and WhatsApp for Rochers salon in Delhi." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const wa = `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent("Hello Rochers, I'd like to book an appointment.")}`;
  return (
    <>
      <PageHeader eyebrow="Contact" title="Come say *hello*." />
      <div className="container-x grid gap-16 pb-28 md:grid-cols-12">
        <div className="space-y-12 md:col-span-5">
          <FadeIn>
            <p className="eyebrow text-muted-foreground">Address</p>
            <p className="mt-3 font-serif text-3xl leading-tight">{SALON.address}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="eyebrow text-muted-foreground">Hours</p>
            <div className="mt-3 divide-y border-y">
              {SALON.hours.map(([d, h]) => (
                <div key={d} className="flex justify-between py-3"><span>{d}</span><span className="text-muted-foreground">{h}</span></div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noreferrer" className={pillClass({ variant: "accent" })}>WhatsApp us <Arrow /></a>
            <a href={`tel:${SALON.phone.replace(/\s/g, "")}`} className={pillClass({ variant: "outline" })}>{SALON.phone}</a>
            <a href={SALON.instagram} target="_blank" rel="noreferrer" className={pillClass({ variant: "outline" })}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-4 w-4"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
              @rochers.delhi
            </a>
          </FadeIn>
        </div>
        <FadeIn delay={0.15} className="md:col-span-7">
          <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border">
            <iframe title="Map to Rochers" className="h-full w-full grayscale-[0.6] sepia-[0.25]" loading="lazy" src="https://www.google.com/maps?q=Meherchand+Market+Lodhi+Colony+New+Delhi&output=embed" />
          </div>
        </FadeIn>
      </div>
    </>
  );
}
