import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES, SLOTS, TEAM, formatDuration, formatINR } from "@/lib/salon";
import { PageHeader, PillButton, PillLink } from "@/components/site/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — Rochers Salon, Delhi" },
      { name: "description", content: "Book a haircut, colour, facial, manicure or bridal appointment at Rochers in Lodhi Colony. Live availability." },
      { property: "og:title", content: "Book at Rochers" },
      { property: "og:description", content: "Choose a service, stylist and time in under a minute." },
    ],
  }),
  component: Book,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().regex(/^[0-9+ ()-]{7,20}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
});

const STEPS = ["Service", "Stylist", "Date & time", "Details"];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function Book() {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [stylist, setStylist] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState<{ stylist_id: string; time_slot: string }[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ stylist: string } | null>(null);

  const service = SERVICES.find((s) => s.id === serviceId);
  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 14) { if (d.getDay() !== 1) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
    return out;
  }, []);

  useEffect(() => {
    if (!date) return;
    supabase.rpc("get_booked_slots", { _date: date }).then(({ data }) => setBooked(data ?? []));
  }, [date]);

  const isTaken = (t: string) => {
    if (date === iso(new Date())) { const [h] = t.split(":"); if (Number(h) <= new Date().getHours()) return true; }
    if (stylist === "any") return TEAM.every((m) => booked.some((b) => b.stylist_id === m.id && b.time_slot === t));
    return booked.some((b) => b.stylist_id === stylist && b.time_slot === t);
  };

  const submit = async () => {
    const r = contactSchema.safeParse(form);
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({});
    setBusy(true);
    const { data, error } = await supabase.rpc("create_booking", {
      _service_id: service!.id, _service_name: service!.name, _stylist_id: stylist!, _date: date!, _slot: slot!,
      _name: r.data.name, _phone: r.data.phone, _email: r.data.email, _stylists: TEAM.map((t) => t.id),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("available") ? "That slot was just taken — please pick another." : "Something went wrong. Please try again.");
      if (error.message.includes("available")) { setSlot(null); setStep(2); supabase.rpc("get_booked_slots", { _date: date! }).then(({ data }) => setBooked(data ?? [])); }
      return;
    }
    const sid = data?.[0]?.stylist_id;
    setDone({ stylist: TEAM.find((t) => t.id === sid)?.name ?? "our team" });
  };

  if (done) {
    return (
      <section className="container-x flex min-h-[80vh] flex-col justify-center pt-32 pb-20">
        <p className="eyebrow text-accent">Confirmed</p>
        <h1 className="display-lg mt-6">See you <em>soon</em>, {form.name.split(" ")[0]}.</h1>
        <div className="mt-12 grid max-w-2xl gap-4 border-t pt-8 sm:grid-cols-2">
          <Info k="Service" v={service!.name} /><Info k="With" v={done.stylist} />
          <Info k="Date" v={new Date(date!).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} /><Info k="Time" v={slot!} />
        </div>
        <div className="mt-12"><PillLink to="/">Back home</PillLink></div>
      </section>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Booking" title="Reserve your *chair*." />
      <div className="container-x pb-32">
        <div className="mb-12 flex gap-2 overflow-x-auto border-b pb-4">
          {STEPS.map((s, i) => (
            <button key={s} disabled={i > step} onClick={() => setStep(i)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm", i === step ? "bg-primary text-primary-foreground" : i < step ? "text-foreground" : "text-muted-foreground")}>
              0{i + 1} {s}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {SERVICES.map((s) => (
              <button key={s.id} onClick={() => { setServiceId(s.id); setStep(1); }} className={cn("rounded-2xl border p-6 text-left transition-colors hover:border-foreground", serviceId === s.id && "border-accent")}>
                <p className="eyebrow text-muted-foreground">{s.category}</p>
                <div className="mt-2 flex justify-between gap-4"><span className="font-serif text-2xl">{s.name}</span><span className="font-serif text-2xl">{formatINR(s.price)}</span></div>
                <p className="mt-1 text-sm text-muted-foreground">{formatDuration(s.duration)}</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-4">
            <button onClick={() => { setStylist("any"); setStep(2); }} className="flex aspect-[4/5] flex-col justify-end rounded-2xl border p-6 text-left hover:border-foreground">
              <span className="font-serif text-3xl">Any stylist</span><span className="text-sm text-muted-foreground">Most availability</span>
            </button>
            {TEAM.map((t) => (
              <button key={t.id} onClick={() => { setStylist(t.id); setStep(2); }} className="group text-left">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl"><img src={t.image} alt={t.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <p className="mt-3 font-serif text-2xl">{t.name}</p><p className="text-sm text-muted-foreground">{t.specialty}</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex gap-2 overflow-x-auto pb-4">
              {days.map((d) => {
                const k = iso(d);
                return (
                  <button key={k} onClick={() => { setDate(k); setSlot(null); }} className={cn("flex w-20 shrink-0 flex-col items-center rounded-2xl border py-4", date === k && "bg-primary text-primary-foreground")}>
                    <span className="text-xs">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                    <span className="font-serif text-3xl">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
            {date && (
              <>
                <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-5">
                  {SLOTS.map((t) => {
                    const taken = isTaken(t);
                    return (
                      <button key={t} disabled={taken} onClick={() => setSlot(t)} className={cn("rounded-full border py-3 text-sm", taken ? "cursor-not-allowed text-muted-foreground line-through opacity-50" : "hover:border-foreground", slot === t && "border-accent bg-accent text-accent-foreground")}>
                        {t}{taken && " · booked"}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-10"><PillButton disabled={!slot} onClick={() => setStep(3)}>Continue</PillButton></div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              {(["name", "phone", "email"] as const).map((f) => (
                <label key={f} className="block">
                  <span className="eyebrow text-muted-foreground">{f}</span>
                  <input value={form[f]} maxLength={f === "email" ? 255 : 100} type={f === "email" ? "email" : f === "phone" ? "tel" : "text"} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="mt-2 w-full border-b bg-transparent py-3 text-xl outline-none focus:border-foreground" />
                  {errors[f] && <span className="text-sm text-destructive">{errors[f]}</span>}
                </label>
              ))}
              <PillButton onClick={submit} disabled={busy} size="lg">{busy ? "Booking…" : "Confirm booking"}</PillButton>
            </div>
            <div className="rounded-2xl bg-card p-8">
              <p className="eyebrow text-muted-foreground">Summary</p>
              <div className="mt-6 space-y-4">
                <Info k="Service" v={`${service?.name} · ${formatINR(service?.price ?? 0)}`} />
                <Info k="Stylist" v={stylist === "any" ? "Any stylist" : TEAM.find((t) => t.id === stylist)?.name ?? ""} />
                <Info k="When" v={`${date} at ${slot}`} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return <div><p className="text-xs text-muted-foreground">{k}</p><p className="font-serif text-2xl">{v}</p></div>;
}
