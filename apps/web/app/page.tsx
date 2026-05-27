import Link from "next/link";
import { ArrowRight, CalendarDays, Code2, Cpu, Sparkles, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Index() {
  const focusAreas = [
    {
      title: "Technical Excellence",
      description: "Hands-on labs, coding sprints, and mentorship-driven learning paths.",
      icon: Code2,
    },
    {
      title: "Research & Innovation",
      description: "Build impactful projects and explore emerging technologies with peers.",
      icon: Cpu,
    },
    {
      title: "Community Leadership",
      description: "Host events, collaborate across teams, and grow as future tech leaders.",
      icon: Users,
    },
  ];

  const events = [
    { name: "HackForge 2026", type: "Hackathon", date: "August 2026" },
    { name: "AI Builders Week", type: "Workshop Series", date: "September 2026" },
    { name: "Industry Connect Summit", type: "Conference", date: "October 2026" },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#060608] text-white">
        <Navbar />
        <main>
          <section className="relative overflow-hidden pt-36">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(110,76,255,0.3),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(0,194,255,0.2),transparent_45%)]" />
            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 pb-24 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs tracking-[0.2em] text-white/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  ACM MJCET STUDENT CHAPTER
                </span>
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                  Building a culture of
                  <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                    {" "}
                    innovation, leadership, and impact.
                  </span>
                </h1>
                <p className="max-w-xl text-base text-zinc-300 md:text-lg">
                  ACM MJCET is a community where students design, ship, and scale ideas through
                  workshops, hackathons, and collaborative engineering projects.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/join"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Join the Chapter
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/50 hover:bg-white/10"
                  >
                    Explore Events
                  </Link>
                </div>
              </div>
              <div className="grid w-full max-w-xl grid-cols-2 gap-4">
                {[
                  { label: "Active Members", value: "250+" },
                  { label: "Events Hosted", value: "40+" },
                  { label: "Projects Built", value: "60+" },
                  { label: "Industry Mentors", value: "25+" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
                  >
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-zinc-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-7xl px-6 pb-24">
            <div className="grid gap-6 md:grid-cols-3">
              {focusAreas.map((area) => (
                <article
                  key={area.title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6"
                >
                  <area.icon className="h-6 w-6 text-cyan-300" />
                  <h2 className="mt-5 text-xl font-semibold text-white">{area.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">{area.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-7xl px-6 pb-28">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1018]">
              <div className="border-b border-white/10 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Upcoming Highlights</p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Curated experiences for builders
                </h2>
              </div>
              <div className="divide-y divide-white/10">
                {events.map((event) => (
                  <div
                    key={event.name}
                    className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
                  >
                    <div>
                      <p className="text-xl font-medium text-white">{event.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{event.type}</p>
                    </div>
                    <p className="inline-flex items-center gap-2 text-sm text-cyan-300">
                      <CalendarDays className="h-4 w-4" />
                      {event.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}