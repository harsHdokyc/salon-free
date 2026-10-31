import { createFileRoute } from "@tanstack/react-router";
import { TEAM } from "@/lib/salon";
import { FadeIn, PageHeader, PillLink } from "@/components/site/motion";
import { TeamCard } from "./index";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Stylists — Rochers Salon, Delhi" },
      { name: "description", content: "Meet the Rochers team: cut specialists, colourists and bridal artists in Lodhi Colony, New Delhi." },
      { property: "og:title", content: "Meet the Rochers Team" },
      { property: "og:description", content: "Cut specialists, colourists and bridal artists in Delhi." },
    ],
  }),
  component: Team,
});

function Team() {
  return (
    <>
      <PageHeader eyebrow="The Team" title="Small team, *serious* craft." intro="Hover over a portrait to see their work. Book with someone specific, or let us match you." />
      <div className="container-x grid gap-x-6 gap-y-16 pb-28 md:grid-cols-3">
        {TEAM.map((t, i) => (
          <FadeIn key={t.id} delay={i * 0.1} className={i === 1 ? "md:mt-28" : i === 2 ? "md:mt-12" : ""}>
            <TeamCard t={t} />
          </FadeIn>
        ))}
      </div>
      <div className="container-x flex justify-center pb-28"><PillLink to="/book" size="lg">Book with the team</PillLink></div>
    </>
  );
}
