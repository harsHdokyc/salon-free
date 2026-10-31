import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import hero from "@/assets/hero.jpg";
import interior from "@/assets/interior.jpg";
import { CATEGORIES, GALLERY, SERVICES, TEAM, TESTIMONIALS, formatINR } from "@/lib/salon";
import { CountUp, FadeIn, Marquee, ParallaxImage, PillLink, RevealText, Arrow, Tilt } from "@/components/site/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rochers — Luxury Hair & Beauty Salon in Lodhi Colony, Delhi" },
      { name: "description", content: "Precision cuts, hand-painted colour, skin rituals, nails and bridal at Rochers, a modern salon in Lodhi Colony, New Delhi. Book online." },
      { property: "og:title", content: "Rochers — Hair & Beauty Salon, Delhi" },
      { property: "og:description", content: "Cuts, colour, skin, nails and bridal in Lodhi Colony. Book your appointment online." },
    ],
  }),
  component: Home,
});

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const mx = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });

  return (
    <section
      ref={ref}
      className="on-dark relative h-[100svh] min-h-[640px] overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 28);
      }}
      onMouseLeave={() => mx.set(0)}
    >
      <motion.img
        src={hero}
        alt="Woman with glossy brunette waves at Rochers salon"
        width={1920}
        height={1152}
        style={{ y, scale, x: smx }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute inset-[-3%] h-[106%] w-[106%] max-w-none object-cover object-[60%_30%] brightness-[0.62]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-espresso/25" />
      <div className="container-x relative flex h-full flex-col justify-end pb-24 md:pb-16">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="eyebrow mb-6 text-background/80">Hair & Beauty Atelier — Lodhi Colony, Delhi</motion.p>
        <RevealText as="h1" text="Beauty, *slowly* considered." className="display-xl max-w-[12ch]" delay={0.3} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-sm text-background/80">Cuts, colour, skin and bridal by a small team who would rather do one thing beautifully than ten things fast.</p>
          <div className="flex gap-3">
            <PillLink to="/book" variant="cream" size="lg">Book now</PillLink>
            <PillLink to="/services" variant="outlineLight" size="lg" className="hidden md:inline-flex">Services</PillLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="container-x grid gap-12 py-28 md:grid-cols-12 md:py-44">
      <div className="md:col-span-7">
        <FadeIn><p className="eyebrow text-muted-foreground">(01) — The House</p></FadeIn>
        <RevealText text="A small studio for people who notice the *details*." className="display-md mt-6" />
        <FadeIn delay={0.2} className="mt-10 grid max-w-2xl gap-6 text-muted-foreground md:grid-cols-2">
          <p>Rochers opened in a sunlit corner of Meherchand Market with one idea: that a great appointment should feel unhurried. Every visit begins with a real conversation.</p>
          <p>Our stylists train in London and Mumbai, work with low-tox colour, and build looks around your texture, your face and the way you actually live.</p>
        </FadeIn>
        <FadeIn delay={0.3} className="mt-14 flex gap-14 hairline pt-8">
          <div>
            <p className="font-serif text-5xl"><CountUp to={12} /></p>
            <p className="mt-1 text-xs text-muted-foreground">Years of craft</p>
          </div>
          <div>
            <p className="font-serif text-5xl"><CountUp to={9} suffix="k+" /></p>
            <p className="mt-1 text-xs text-muted-foreground">Happy clients</p>
          </div>
          <div>
            <p className="font-serif text-5xl">4.9</p>
            <p className="mt-1 text-xs text-muted-foreground">Google rating</p>
          </div>
        </FadeIn>
      </div>
      <div className="md:col-span-4 md:col-start-9 md:mt-32">
        <Tilt max={6}>
          <ParallaxImage src={interior} alt="Inside the Rochers studio" className="aspect-[4/5] rounded-[2rem]" />
        </Tilt>
      </div>
    </section>
  );
}

function StackedServices() {
  return (
    <section className="container-x pb-20">
      <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <FadeIn><p className="eyebrow text-muted-foreground">(02) — What we do</p></FadeIn>
          <RevealText text="Five crafts, *one* standard." className="display-lg mt-6" />
        </div>
        <PillLink to="/services" variant="outline">All services & prices</PillLink>
      </div>
      <div className="relative">
        {CATEGORIES.map((c, i) => {
          const from = Math.min(...SERVICES.filter((s) => s.category === c.name).map((s) => s.price));
          return (
            <motion.div
              key={c.name}
              className="sticky mb-6"
              style={{ top: `${96 + i * 22}px` }}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/services"
                className="group grid overflow-hidden rounded-[2rem] border bg-card transition-[box-shadow,transform] duration-500 hover:shadow-[0_24px_80px_-32px_rgba(30,26,23,0.45)] md:h-[70vh] md:grid-cols-2"
              >
                <div className="flex flex-col justify-between p-8 md:p-14">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-muted-foreground">0{i + 1}</span>
                    <span className="text-sm text-muted-foreground">from {formatINR(from)}</span>
                  </div>
                  <div className="py-10">
                    <h3 className="display-lg transition-transform duration-500 group-hover:translate-x-2">{c.name}</h3>
                    <p className="mt-6 max-w-sm text-lg text-muted-foreground">{c.line}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm">
                    Explore {c.name.toLowerCase()}
                    <Arrow />
                  </span>
                </div>
                <div className="relative h-72 overflow-hidden md:h-auto">
                  <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:bg-gradient-to-l" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function TeamPreview() {
  return (
    <section className="container-x py-28 md:py-40">
      <div className="mb-16 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <FadeIn><p className="eyebrow text-muted-foreground">(03) — The people</p></FadeIn>
          <RevealText text="Hands you'll *trust*." className="display-lg mt-6" />
        </div>
        <div className="md:col-span-4 md:text-right"><PillLink to="/team" variant="outline">Meet the team</PillLink></div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {TEAM.map((t, i) => (
          <FadeIn key={t.id} delay={i * 0.1} className={i === 1 ? "md:mt-24" : ""}>
            <TeamCard t={t} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export function TeamCard({ t }: { t: (typeof TEAM)[number] }) {
  return (
    <div className="group">
      <Tilt max={7}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-muted">
          <img src={t.image} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0" />
          <img src={t.alt} alt={`${t.name}'s work`} loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />
        </div>
      </Tilt>
      <div className="mt-5 flex items-baseline justify-between hairline pt-4">
        <h3 className="text-3xl transition-transform duration-500 group-hover:translate-x-1">{t.name}</h3>
        <p className="text-xs text-muted-foreground">{t.role}</p>
      </div>
      <p className="mt-1 font-serif text-lg italic text-muted-foreground">{t.specialty}</p>
    </div>
  );
}

function GalleryStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-35%"]);
  return (
    <section ref={ref} className="on-dark overflow-hidden py-28 md:py-40">
      <div className="container-x mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-background/60">(04) — Recent work</p>
          <RevealText text="The *gallery*." className="display-lg mt-6" />
        </div>
        <PillLink to="/gallery" variant="outlineLight">View all work</PillLink>
      </div>
      <motion.div style={{ x }} className="flex gap-6 pl-[4vw]">
        {GALLERY.slice(0, 6).map((g, i) => (
          <Link
            key={i}
            to="/gallery"
            className={`group relative shrink-0 overflow-hidden rounded-[1.5rem] ${i % 2 ? "mt-16 h-[48vh] w-[34vh]" : "h-[56vh] w-[42vh]"}`}
          >
            <img src={g.src} alt={g.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-espresso/80 to-transparent p-5 pt-16 text-sm text-background transition-transform duration-500 group-hover:translate-y-0">
              {g.label}
            </span>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container-x py-28 md:py-40">
      <FadeIn><p className="eyebrow text-muted-foreground">(05) — Kind words</p></FadeIn>
      <div className="mt-12 divide-y border-y">
        {TESTIMONIALS.map((t, i) => (
          <FadeIn key={i} className="grid gap-6 py-12 md:grid-cols-12">
            <p className="font-serif text-5xl text-accent md:col-span-1">“</p>
            <p className="font-serif text-3xl leading-tight md:col-span-8 md:text-5xl">{t.quote}</p>
            <div className="md:col-span-3 md:text-right">
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.detail}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="container-x pb-28">
      <motion.div
        className="relative overflow-hidden rounded-[2.5rem] bg-accent px-8 py-24 text-accent-foreground md:px-20 md:py-36"
        initial={{ clipPath: "inset(8% 4% 8% 4% round 2.5rem)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 2.5rem)" }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-background/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <RevealText text="Your chair is *waiting*." className="display-xl max-w-[10ch]" />
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md text-accent-foreground/85">Pick a service, a stylist and a time that suits you. It takes under a minute.</p>
          <PillLink to="/book" variant="cream" size="lg">Book an appointment</PillLink>
        </div>
      </motion.div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Story />
      <StackedServices />
      <div className="hairline border-b py-10">
        <Marquee items={["Signature Cut", "Balayage", "Ritual Facial", "Gel Manicure", "Bridal", "Keratin", "Gloss & Tone", "Blow-dry"]} />
      </div>
      <TeamPreview />
      <GalleryStrip />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
