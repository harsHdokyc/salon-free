import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FAQS } from "@/lib/salon";
import { FadeIn, PageHeader, PillLink } from "@/components/site/motion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Booking, Cancellations & More | Rochers Delhi" },
      { name: "description", content: "Answers about booking, cancellations, products, consultations and parking at Rochers salon in Lodhi Colony, Delhi." },
      { property: "og:title", content: "Rochers FAQ" },
      { property: "og:description", content: "Booking, cancellation, products and parking — answered." },
    ],
  }),
  component: Faq,
});

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Good *questions*." />
      <div className="container-x pb-28">
        <div className="border-t md:ml-[33%]">
          {FAQS.map((f, i) => (
            <FadeIn key={i} delay={i * 0.04} className="border-b">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-8 text-left">
                <span className="font-serif text-3xl md:text-4xl">{f.q}</span>
                <span className={`relative h-5 w-5 shrink-0 transition-transform duration-500 ${open === i ? "rotate-45 text-accent" : ""}`}>
                  <span className="absolute top-1/2 left-0 h-px w-5 bg-current" />
                  <span className="absolute top-0 left-1/2 h-5 w-px bg-current" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
                    <p className="max-w-2xl pb-8 text-lg text-muted-foreground">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </FadeIn>
          ))}
        </div>
        <div className="mt-16 flex justify-center gap-3"><PillLink to="/contact" variant="outline">Still curious? Contact us</PillLink></div>
      </div>
    </>
  );
}
