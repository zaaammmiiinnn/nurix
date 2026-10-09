#!/usr/bin/env node
const { execSync } = require('child_process');

// If invoked by OpenNext during its internal packaging step, or on Vercel:
if (process.env.NEXT_PRIVATE_STANDALONE === 'true' || process.env.VERCEL) {
  execSync('next build', { stdio: 'inherit' });
} else {
  // In Cloudflare CI (or standalone run), build the complete Cloudflare Worker bundle:
  execSync('opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion', { stdio: 'inherit' });
}
