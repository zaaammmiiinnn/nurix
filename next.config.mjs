/**
 * Next.js configuration.
 *
 * Security headers were previously absent entirely (this file was `{}`), so the
 * site shipped no HSTS, no nosniff, no referrer policy, and advertised the
 * framework version via `X-Powered-By` — on a framework release that is past
 * end-of-life.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not advertise the framework/version.
  poweredByHeader: false,

  // Fail the build on type errors rather than shipping them.
  typescript: { ignoreBuildErrors: false },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Clickjacking. frame-ancestors in the CSP below is the modern control;
          // X-Frame-Options covers older browsers.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // REPORT-ONLY on purpose.
            //
            // A CSP that omits an origin Clerk or Supabase needs will break the
            // sign-in flow and the admin panel — worse than having no CSP. This
            // reports violations without blocking anything, so the policy can be
            // validated against real traffic (login, chat, admin, Cal.com embeds)
            // and then promoted by renaming the header to
            // "Content-Security-Policy" and removing 'unsafe-inline'/'unsafe-eval'
            // in favour of a nonce.
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.clerk.accounts.dev https://*.clerk.com https://api.clerk.com",
              "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com https://cal.com https://app.cal.com",
              "worker-src 'self' blob:",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
