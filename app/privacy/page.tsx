import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, BRAND } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How NeuralWaves collects, uses and stores personal data submitted through the website, chat widget and WhatsApp.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const LAST_UPDATED = "9 October 2026";

/**
 * NOTE FOR THE OPERATOR: this policy describes what the code actually does today
 * (contact form → Supabase + Resend, chat widget → Supabase, WhatsApp → Supabase).
 * Have it reviewed by a qualified adviser before you rely on it, particularly if
 * you start handling client data inside delivered systems rather than just
 * enquiries.
 */
export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 md:px-8 relative z-10">
        <p className="font-mono text-xs uppercase tracking-widest text-violet-400 mb-4">
          Legal
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm font-mono text-zinc-500 mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-10 text-zinc-300 leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Who we are</h2>
            <p>
              {BRAND.name} builds AI chatbots, dashboards and automation systems. We are
              engaged by clients for delivery from India and serve clients across the UAE and
              the wider GCC. This policy explains what we do with information you send us
              through this website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">What we collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Enquiry form.</strong> Your name, email, phone
                number, company (optional), the service you are interested in, and your
                message.
              </li>
              <li>
                <strong className="text-white">Website chat.</strong> A random identifier
                stored in your browser&apos;s local storage, the messages you exchange with
                the assistant or an engineer, and — only if you type them — your name, email,
                phone and company.
              </li>
              <li>
                <strong className="text-white">WhatsApp.</strong> If you message our business
                number, Meta sends us your WhatsApp number, your profile display name and the
                content of your messages.
              </li>
              <li>
                <strong className="text-white">Technical data.</strong> Our hosting and
                database providers process standard request logs (IP address, user agent,
                timestamps) to serve and protect the site. We do not run advertising trackers
                or third-party analytics on this site.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Why we use it</h2>
            <p>
              To reply to your enquiry, scope and quote work, deliver and support systems you
              engage us for, and keep records of our business communications. We do not sell
              your data, and we do not use it for advertising.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Who processes it</h2>
            <p>
              We use a small number of service providers who process data on our behalf:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Supabase</strong> — database and storage for
                enquiries, chat transcripts and WhatsApp records.
              </li>
              <li>
                <strong className="text-white">Resend</strong> — transactional email
                delivery for enquiry notifications.
              </li>
              <li>
                <strong className="text-white">Clerk</strong> — authentication for our
                internal admin panel. Visitors do not sign in and are not affected.
              </li>
              <li>
                <strong className="text-white">Cloudflare</strong> — hosting and content
                delivery for this website.
              </li>
              <li>
                <strong className="text-white">Meta</strong> — the WhatsApp Business Platform,
                if you choose to contact us on WhatsApp.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">How long we keep it</h2>
            <p>
              Enquiries and chat transcripts are kept while we are in contact with you and for
              as long afterwards as we need them for legitimate business records. Ask us and
              we will delete your enquiry and transcript sooner.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Your choices</h2>
            <p>
              You can ask us for a copy of the information we hold about you, ask us to
              correct it, or ask us to delete it. Email{" "}
              <a className="text-violet-400 hover:text-violet-300" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>{" "}
              and we will respond within a reasonable period. You can also clear the chat
              widget&apos;s identifier at any time by clearing your browser storage for this
              site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Security</h2>
            <p>
              Access to enquiry and chat data is restricted to authorised administrators. Chat
              transcripts are readable only by us and are not published or exposed publicly.
              If you believe you have found a security issue, please tell us at{" "}
              <a className="text-violet-400 hover:text-violet-300" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>{" "}
              before disclosing it publicly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Changes</h2>
            <p>
              If this policy changes materially we will update the date at the top of this
              page.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-wrap gap-6 text-sm font-mono">
          <Link href="/terms" className="text-violet-400 hover:text-violet-300">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-zinc-400 hover:text-white">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
