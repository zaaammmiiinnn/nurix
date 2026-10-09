import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { getFeaturedProjects } from "@/lib/data/db-queries";
import { SITE_HOST } from "@/lib/config";

/**
 * Homepage "Recent builds" section.
 *
 * This was previously a client component holding a hardcoded array whose slugs
 * (`realestate-whatsapp-bot`, `logistics-dashboard`, `ecommerce-agent`) matched no
 * route — all three cards linked to 404s in the site's main proof-of-work section.
 * They also invented client URLs (`dxb-realestate.ai/lead-desk`) and preview
 * content that did not correspond to any real project.
 *
 * It now renders real rows from the database, so the links resolve, the content
 * is editable from the admin panel, and nothing is fabricated. It is a server
 * component, which also keeps it out of the client bundle.
 */
export async function FeaturedWork() {
  const projects = await getFeaturedProjects();
  const shown = projects.slice(0, 3);

  return (
    <section
      id="work"
      className="py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto"
      aria-labelledby="work-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <SectionHeader
          id="work-heading"
          label="03 / WORK"
          title="Recent builds."
          description="Selected systems, what they replaced, and the result. Each one is documented end to end."
          className="mb-0 md:mb-0"
        />

        <Link
          href="/work"
          className="hidden md:inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-white transition-colors group mb-4"
        >
          View all case studies
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>

      {shown.length === 0 ? (
        <p className="text-sm font-mono text-zinc-500">
          Case studies are being published. <Link href="/contact" className="text-violet-400 hover:text-violet-300">Talk to us</Link> about a similar build.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {shown.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] overflow-hidden flex flex-col transition-all duration-300 hover:border-violet-500/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)] relative"
            >
              {/* Browser chrome container */}
              <div className="p-3 pb-0">
                <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    </div>

                    {/* Real case-study path, not an invented client domain */}
                    <div className="px-3 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-zinc-500 truncate max-w-[200px]">
                      {SITE_HOST}/work/{project.slug}
                    </div>

                    <div className="w-6" />
                  </div>

                  <div className="relative h-44 overflow-hidden bg-gradient-to-b from-violet-950/20 to-black transition-transform duration-500 group-hover:scale-[1.03]">
                    <div className="relative z-10 h-full flex flex-col justify-between p-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] gap-2">
                        <span className="text-[11px] font-mono text-zinc-400 truncate">
                          {project.sector || project.tag}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                          {project.isDemo ? "DEMO" : "SHIPPED"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <span className="block text-[9px] font-mono uppercase tracking-wider text-zinc-500">
                          Outcome
                        </span>
                        <p className="text-base font-mono text-white leading-snug">
                          {project.resultMetric}
                        </p>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          Delivered in {project.deliveryDays}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-violet-300 border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 rounded-full">
                      {project.tag}
                    </span>
                    {project.isDemo && (
                      <span className="font-mono text-[10px] text-amber-400">Demo build</span>
                    )}
                  </div>

                  <h3 className="font-medium text-white text-base leading-snug group-hover:text-violet-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    {project.client || "Confidential client"}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-white transition-colors">
                  <span>Case study</span>
                  <span className="inline-flex items-center gap-1 text-violet-400 group-hover:translate-x-1 transition-all duration-200">
                    Read more <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-white"
        >
          View all case studies <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
