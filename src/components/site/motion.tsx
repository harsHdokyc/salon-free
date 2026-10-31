import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/** Word-by-word headline reveal. Wrap a word in *asterisks* for italic. */
export function RevealText({ text, className, delay = 0, as = "h2" }: { text: string; className?: string; delay?: number; as?: "h1" | "h2" | "h3" | "p" }) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px" }} transition={{ staggerChildren: 0.06, delayChildren: delay }}>
      {words.map((w, i) => {
        const italic = w.startsWith("*") && w.endsWith("*");
        const word = italic ? w.slice(1, -1) : w;
        return (
          <span
            key={i}
            className="inline-block align-bottom"
            style={{ clipPath: "inset(0.05em -0.12em -0.4em -0.12em)" }}
          >
            <motion.span
              className={cn("inline-block will-change-transform", italic && "italic")}
              variants={{ hidden: { y: "115%" }, show: { y: "0%", transition: { duration: 0.8, ease } } }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

export function FadeIn({ children, className, delay = 0, y = 32 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ duration: 0.8, delay, ease }}>
      {children}
    </motion.div>
  );
}

export function ParallaxImage({ src, alt, className, strength = 12, eager }: { src: string; alt: string; className?: string; strength?: number; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <motion.div ref={ref} className={cn("relative overflow-hidden", className)} initial={{ clipPath: "inset(12% 0 0 0)", opacity: 0 }} whileInView={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease }}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1 + strength / 50 }} loading={eager ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />
    </motion.div>
  );
}

const pill = cva(
  "relative inline-flex items-center justify-center gap-3 rounded-full font-medium tracking-wide transition-colors duration-300 overflow-hidden group",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground hover:bg-accent",
        accent: "bg-accent text-accent-foreground hover:bg-primary",
        cream: "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        outline: "border border-foreground/30 text-foreground hover:bg-foreground hover:text-background",
        outlineLight: "border border-background/40 text-background hover:bg-background hover:text-foreground",
      },
      size: { md: "h-12 px-7 text-sm", lg: "h-16 px-10 text-base" },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export function Magnetic({ children, className, strength = 0.3 }: { children: ReactNode; className?: string; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15 });
  const sy = useSpring(y, { stiffness: 220, damping: 15 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  return (
    <motion.div className={cn("inline-block", className)} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

/** 3D tilt on pointer — for team / gallery media. */
export function Tilt({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 16 });
  const sry = useSpring(ry, { stiffness: 180, damping: 16 });
  const transform = useMotionTemplate`perspective(900px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max);
    rx.set(-py * max);
  };
  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/** Count-up when scrolled into view. */
export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        animate(mv, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mv, to]);
  useEffect(() => {
    const unsub = mv.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
    });
    return unsub;
  }, [mv, suffix]);
  return <span ref={ref} className={className}>0{suffix}</span>;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}

type PillProps = VariantProps<typeof pill> & { children: ReactNode; className?: string };
export function PillLink({ to, children, variant, size, className }: PillProps & { to: "/book" | "/services" | "/team" | "/gallery" | "/contact" | "/faq" | "/" }) {
  return (
    <Magnetic>
      <Link
        to={to}
        className={cn(pill({ variant, size }), className)}
      >
        <span className="relative z-10">{children}</span>
        <Arrow className="relative z-10" />
        <span aria-hidden className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 ease-out group-hover:translate-x-0" />
      </Link>
    </Magnetic>
  );
}
export function PillButton({ children, variant, size, className, ...rest }: PillProps & import("react").ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(pill({ variant, size }), "disabled:opacity-40 disabled:pointer-events-none", className)} {...rest}>
      {children}
    </button>
  );
}
export const pillClass = pill;

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45", className)}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn("group/marquee overflow-hidden", className)}>
      <div className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center font-serif text-[clamp(3rem,8vw,7rem)] leading-[1.1] py-[0.08em] whitespace-nowrap transition-opacity duration-300 group-hover/marquee:opacity-40 hover:!opacity-100">
            <span className={i % 2 ? "italic" : ""}>{t}</span>
            <span className="mx-8 inline-block h-2.5 w-2.5 rotate-45 bg-accent md:mx-14" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="container-x pt-40 pb-16 md:pt-52 md:pb-24">
      <FadeIn><p className="eyebrow text-muted-foreground">{eyebrow}</p></FadeIn>
      <RevealText as="h1" text={title} className="display-lg mt-6 max-w-5xl" />
      {intro && <FadeIn delay={0.3} className="mt-8 max-w-xl text-lg text-muted-foreground">{intro}</FadeIn>}
    </section>
  );
}
