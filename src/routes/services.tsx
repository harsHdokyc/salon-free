import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, SERVICES, formatDuration, formatINR } from "@/lib/salon";
import { FadeIn, PageHeader, ParallaxImage, PillLink } from "@/components/site/motion";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Prices — Rochers Salon, Delhi" },
      { name: "description", content: "Haircuts, balayage, facials, manicures and bridal packages at Rochers, Lodhi Colony. Clear durations and prices in rupees." },
      { property: "og:title", content: "Services & Prices — Rochers Salon" },
      { property: "og:description", content: "Hair, colour, skin, nails and bridal menu with durations and prices." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHeader eyebrow="Services & Pricing" title="The *menu*." intro="Every service includes a consultation. Prices are starting points and may vary with hair length and density." />
      <div className="container-x pb-28">
        {CATEGORIES.map((c, ci) => (
          <section key={c.name} className="grid gap-10 hairline py-16 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="md:sticky md:top-28">
                <p className="eyebrow text-muted-foreground">0{ci + 1}</p>
                <h2 className="display-md mt-3">{c.name}</h2>
                <ParallaxImage src={c.image} alt={c.name} className="mt-8 hidden aspect-[4/5] rounded-[1.5rem] md:block" strength={8} />
              </div>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              {SERVICES.filter((s) => s.category === c.name).map((s, i) => (
                <FadeIn key={s.id} delay={i * 0.05} className="group grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 border-b py-7 transition-colors">
                  <h3 className="font-serif text-3xl transition-transform duration-500 group-hover:translate-x-2">{s.name}</h3>
                  <p className="font-serif text-3xl">{formatINR(s.price)}</p>
                  <p className="text-muted-foreground">{s.desc}</p>
                  <p className="text-right text-sm text-muted-foreground">{formatDuration(s.duration)}</p>
                </FadeIn>
              ))}
            </div>
          </section>
        ))}
        <div className="mt-16 flex justify-center"><PillLink to="/book" size="lg">Book a service</PillLink></div>
      </div>
    </>
  );
}
