#!/usr/bin/env node
/**
 * Build entry point.
 *
 * Two contexts:
 *   1. OpenNext re-invokes `npm run build` while packaging the Worker, and sets
 *      NEXT_PRIVATE_STANDALONE=true. That must run a plain `next build`, or the
 *      script would recurse forever.
 *   2. Otherwise we build the complete Cloudflare Worker bundle.
 *
 * NOTE: this previously passed --dangerouslyUseUnsupportedNextVersion to bypass
 * OpenNext's end-of-life check. That flag was the only reason the project could
 * be deployed at all, and it meant shipping an unpatched Next.js release with a
 * known critical advisory. Next is now on 15.5.27, which OpenNext supports, so
 * the override is gone — if the version check ever fails again, upgrade Next
 * rather than re-adding the flag.
 */
const { execSync } = require("child_process");

const opts = { stdio: "inherit" };

if (process.env.NEXT_PRIVATE_STANDALONE === "true" || process.env.VERCEL) {
  execSync("next build", opts);
} else {
  execSync("opennextjs-cloudflare build", opts);
}
