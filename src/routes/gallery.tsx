import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GALLERY } from "@/lib/salon";
import { FadeIn, PageHeader } from "@/components/site/motion";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Hair, Colour & Bridal Work | Rochers Delhi" },
      { name: "description", content: "Before-and-after transformations, balayage, bobs, bridal looks and nail sets from the Rochers studio in Delhi." },
      { property: "og:title", content: "Rochers Gallery" },
      { property: "og:description", content: "Recent hair, colour, skin and bridal work from Rochers, Delhi." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((open + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setOpen((open - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <>
      <PageHeader eyebrow="Gallery" title="Recent *work*." intro="Real clients, natural light. Tap any photo to open it." />
      <div className="container-x columns-1 gap-6 pb-28 sm:columns-2 lg:columns-3">
        {GALLERY.map((g, i) => (
          <FadeIn key={i} delay={(i % 3) * 0.08} className="mb-6 break-inside-avoid">
            <button
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-[1.5rem] text-left"
            >
              <img src={g.src} alt={g.label} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${g.tall ? "aspect-[4/5]" : "aspect-[5/4]"}`} />
              <span className="absolute inset-0 bg-espresso/0 transition-colors duration-500 group-hover:bg-espresso/15" />
              <span className="on-dark absolute bottom-4 left-4 translate-y-2 rounded-full px-4 py-2 text-xs opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">{g.label}</span>
            </button>
          </FadeIn>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div className="on-dark fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.img key={open} src={GALLERY[open]!.src} alt={GALLERY[open]!.label} className="max-h-[80vh] max-w-full rounded-[1.5rem] object-contain" initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} onClick={(e: import("react").MouseEvent) => e.stopPropagation()} />
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-between px-6 text-sm" onClick={(e: import("react").MouseEvent) => e.stopPropagation()}>
              <button onClick={() => setOpen((open - 1 + GALLERY.length) % GALLERY.length)} className="rounded-full border border-background/30 px-5 py-2">Prev</button>
              <p className="font-serif text-xl italic">{GALLERY[open]!.label}</p>
              <button onClick={() => setOpen((open + 1) % GALLERY.length)} className="rounded-full border border-background/30 px-5 py-2">Next</button>
            </div>
            <button aria-label="Close" className="absolute top-6 right-6 rounded-full border border-background/30 px-5 py-2 text-sm">Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
