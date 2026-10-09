import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { getTestimonials } from "@/lib/data/db-queries";

/**
 * Client testimonials.
 *
 * These were already stored in the database and editable from the admin panel,
 * but `getTestimonials()` was not called from a single public page — verified
 * social proof that no visitor ever saw. This section renders active testimonials
 * and hides itself entirely when there are none, so it never shows an empty shell.
 */
export async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  const shown = testimonials.slice(0, 3);

  return (
    <section
      id="testimonials"
      className="py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto"
      aria-labelledby="testimonials-heading"
    >
      <SectionHeader
        id="testimonials-heading"
        label="05 / CLIENTS"
        title="What clients say."
        description="Feedback from the teams running these systems in production."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shown.map((t, idx) => (
          <figure
            key={t.id ?? `${t.clientName}-${idx}`}
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 flex flex-col justify-between gap-6"
          >
            <Quote size={20} className="text-violet-500/60" aria-hidden="true" />

            <blockquote className="text-sm text-zinc-300 leading-relaxed">
              {t.content}
            </blockquote>

            <figcaption className="pt-5 border-t border-white/[0.06] space-y-2">
              {t.rating > 0 && (
                <div
                  className="flex items-center gap-0.5"
                  aria-label={`Rated ${t.rating} out of 5`}
                >
                  {Array.from({ length: Math.min(5, Math.max(0, t.rating)) }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="text-amber-400 fill-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
              <div>
                <span className="block text-sm text-white font-medium">{t.clientName}</span>
                <span className="block text-xs font-mono text-zinc-500">
                  {[t.clientRole, t.company].filter(Boolean).join(" · ")}
                </span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
