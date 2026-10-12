import { Terminal, Shield, Workflow, Layers } from "lucide-react";

const PILLARS = [
  {
    icon: Terminal,
    tag: "ENGINEERING DISCIPLINE",
    title: "Deterministic Systems, Not Prompt Magic",
    description:
      "We design AI with strict JSON schemas, fallback state machines, and human approval gates. Systems only execute actions when confidence thresholds are rigorously met.",
  },
  {
    icon: Layers,
    tag: "SCOPE INTEGRITY",
    title: "Fixed Scope & Upfront Architecture",
    description:
      "Every project begins with a locked technical blueprint. We define explicit inputs, outputs, and edge cases so there is zero hourly billing creep or surprise invoices.",
  },
  {
    icon: Workflow,
    tag: "COLLABORATION MODEL",
    title: "Direct Access to Senior Engineers",
    description:
      "Eliminate the traditional agency telephone game. You communicate directly with the senior full-stack developers writing your code and deploying your webhooks.",
  },
  {
    icon: Shield,
    tag: "INFRASTRUCTURE PRIVACY",
    title: "100% IP & Private Data Retained",
    description:
      "All code, databases, API keys, and model contexts belong exclusively to your organization. Deployed directly into your Supabase, Meta, or cloud accounts.",
  },
];

export function WhyNeuralWaves() {
  return (
    <section
      id="why-neuralwaves"
      className="py-24 md:py-36 border-b border-stone/80 bg-canvas"
      aria-labelledby="why-heading"
    >
      <div className="container-editorial">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              05 // ENGINEERING ETHOS
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                id="why-heading"
                className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight"
              >
                Built like software infrastructure, <br className="hidden sm:inline" />
                not experimental agency prototypes.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm md:text-base text-olive leading-relaxed font-sans">
                Why forward-thinking operations teams across India and the UAE partner with NeuralWaves over traditional software consultancies.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-8 md:p-10 border border-stone bg-white flex flex-col justify-between transition-colors hover:border-charcoal/60"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-stone/70 mb-6">
                    <span className="mono-label text-[10px] text-olive uppercase">
                      {pillar.tag}
                    </span>
                    <Icon className="w-4 h-4 text-charcoal" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-display font-medium text-xl sm:text-2xl text-charcoal tracking-tight mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone/50 flex items-center gap-2 text-[11px] font-mono text-charcoal">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  <span>PRODUCTION VERIFIED</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
