import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { SALON } from "@/lib/salon";
import { cn } from "@/lib/utils";
import { Arrow, ScrollProgress } from "./motion";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/team", label: "Team" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

/** Butter-smooth Lenis options used by the root ReactLenis provider. */
export const lenisOptions = {
  autoRaf: true,
  duration: 1.35,
  lerp: 0.075,
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.4,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
} as const;

export function Nav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = path === "/" && !scrolled;
  useLenis((lenis) => setScrolled(lenis.scroll > 60));
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <ScrollProgress />
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "bg-background/95 py-3 border-b backdrop-blur-md" : "py-6", overHero ? "text-background" : "text-foreground")}>
        <div className="container-x flex items-center justify-between">
          <Link to="/" className="font-serif text-3xl tracking-tight transition-opacity hover:opacity-70">
            Rochers<span className="text-accent">.</span>
          </Link>
          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="group relative text-sm">
                {n.label}
                <span className={cn("absolute -bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-500", path === n.to ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
              </Link>
            ))}
            <Link
              to="/book"
              className={cn("group inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm transition-colors", overHero ? "bg-background text-foreground hover:bg-accent hover:text-accent-foreground" : "bg-primary text-primary-foreground hover:bg-accent")}
            >
              Book now <Arrow />
            </Link>
          </nav>
          <button aria-label="Menu" className="md:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5" onClick={() => setOpen((o) => !o)}>
            <span className={cn("h-px w-6 bg-current transition-transform", open && "translate-y-[3.5px] rotate-45")} />
            <span className={cn("h-px w-6 bg-current transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="on-dark fixed inset-0 z-40 flex flex-col justify-end p-6 pb-28 md:hidden" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            {[{ to: "/", label: "Home" }, ...NAV, { to: "/book", label: "Book" }].map((n, i) => (
              <motion.div key={n.to} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <Link to={n.to} className="block border-t border-background/15 py-3 font-serif text-5xl">{n.label}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {path !== "/book" && (
        <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
          <Link to="/book" className="flex h-14 items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground">Book an appointment <Arrow /></Link>
        </div>
      )}
    </>
  );
}

export function PageTransition({ children }: { children: import("react").ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const lenis = useLenis();

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      }}
    >
      <motion.main
        key={path}
        initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.4, 0.85, 1]);

  return (
    <footer ref={ref} className="on-dark pb-28 md:pb-10">
      <div className="container-x pt-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-serif display-md">Hair, skin & <em>quiet</em> luxury in Lodhi Colony.</p>
          </div>
          <div className="md:col-span-3 space-y-2 text-sm text-background/70">
            <p className="eyebrow text-background/50 mb-4">Visit</p>
            <p>{SALON.address}</p>
            <a href={`tel:${SALON.phone.replace(/\s/g, "")}`} className="block transition-colors hover:text-background">{SALON.phone}</a>
            <a href={`mailto:${SALON.email}`} className="block transition-colors hover:text-background">{SALON.email}</a>
          </div>
          <div className="md:col-span-3 space-y-2 text-sm text-background/70">
            <p className="eyebrow text-background/50 mb-4">Explore</p>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="block transition-colors hover:text-background">{n.label}</Link>
            ))}
            <a href={SALON.instagram} target="_blank" rel="noreferrer" className="block transition-colors hover:text-background">Instagram</a>
          </div>
        </div>
        <motion.p style={{ y, opacity }} className="mt-24 select-none font-serif leading-none tracking-tighter text-[clamp(6rem,27vw,26rem)] pb-[0.06em]">
          Rochers<span className="text-accent">.</span>
        </motion.p>
        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-background/15 pt-6 text-xs text-background/50 md:flex-row">
          <p>© {new Date().getFullYear()} Rochers Salon, New Delhi</p>
          <p>Tue – Sun · 10:00 – 20:00</p>
        </div>
      </div>
    </footer>
  );
}
