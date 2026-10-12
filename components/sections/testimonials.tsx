import { Quote, Star } from "lucide-react";
import { getTestimonials } from "@/lib/data/db-queries";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  const shown = testimonials.slice(0, 3);

  return (
    <section
      id="testimonials"
      className="py-24 md:py-36 border-b border-stone/80 bg-canvas"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-editorial">
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              FEEDBACK // PRODUCTION STAKEHOLDERS
            </p>
          </div>
          <h2
            id="testimonials-heading"
            className="font-display font-medium text-3xl sm:text-4xl text-charcoal tracking-tight"
          >
            Direct feedback from engineering deployments.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shown.map((t, idx) => (
            <figure
              key={t.id ?? `${t.clientName}-${idx}`}
              className="border border-stone bg-white p-8 flex flex-col justify-between gap-6"
            >
              <Quote size={20} className="text-olive/60" aria-hidden="true" />

              <blockquote className="text-sm text-charcoal font-sans leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </blockquote>

              <figcaption className="pt-6 border-t border-stone/60 space-y-2">
                {t.rating > 0 && (
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`Rated ${t.rating} out of 5`}
                  >
                    {Array.from({ length: Math.min(5, Math.max(0, t.rating)) }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="text-charcoal fill-charcoal"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                )}
                <div>
                  <span className="block text-sm text-charcoal font-medium font-sans">{t.clientName}</span>
                  <span className="block text-xs font-mono text-olive">
                    {[t.clientRole, t.company].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
