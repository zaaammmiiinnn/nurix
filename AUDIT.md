# NeuralWaves (`nurix`) — Full Code, Security & Product Audit

**Audited:** 9 Oct 2026 · **Commit:** `460582b` · **Working tree:** clean · **Scope:** whole repo
**Method:** full static read of all source, RLS schema, config, docs and build output; `tsc --noEmit` clean; `next build` succeeds (43 routes); DNS/WHOIS and external-link checks; four independent parallel audits cross-checked against first-hand evidence.

---

## ✅ RESOLUTION STATUS (added after the fixes were implemented)

Everything below this line is the **original audit as written**, kept for reference. This section records what has since been fixed. Commits are on `main`; each was verified with `tsc`, `eslint` and a production build, and where noted by exercising a built server over HTTP.

### P0 security — all resolved

| # | Issue | Resolution |
|---|---|---|
| P0-1 | Chat PII world-readable/writable (`USING (true)`) | Permissive policies dropped in `schema.sql`, the Phase 12 migration, and a new idempotent migration. Verified at runtime: `400`/`[]` for anon reads. |
| P0-2 | Cookie bypass on `/api/admin/*` | Fallback deleted; both routes fail closed. Verified: `Cookie: __session=1` now returns **401**. |
| P0-3 | 22 of 24 admin actions unguarded | `requireAdmin()` added to every export in all 8 action modules. `db-queries.ts` no longer imports admin actions, so public reads and admin writes are separate. |
| P0-4 | Verification gate defeated in `verifyAdminAccess()` | Now considers **verified** emails only. Hardcoded admin addresses removed from source and from the login page, which was displaying the allowlist publicly. |
| P0-5 | WhatsApp webhook accepted forged POSTs | `X-Hub-Signature-256` HMAC verified over the raw body with `timingSafeEqual`; hardcoded `VERIFY_TOKEN` fallback removed; idempotency added. |
| P0-6 | Cron failed open | Fails closed with `503` when `CRON_SECRET` is unset; bearer compared with `timingSafeEqual`. |
| P0-7 | Next 14.2.35 EOL + `--dangerouslyUseUnsupportedNextVersion` | Upgraded to **Next 15.5.27 + React 19**; flag removed. `npm audit` critical count went **1 → 0**. The full OpenNext Cloudflare build now succeeds with no override. |

### Functional and commercial — resolved

- Homepage case-study links: all three 404s fixed; the section now renders real database rows. Verified all rendered links return 200.
- Chat-vs-pricing contradiction: the bot formats the live tiers. A third drifting price list in the contact form was removed.
- Admin edits not reaching the site: contact page, footer, nav, hero, CTA and chat widget now read admin settings; sitemap and service metadata read the database.
- False success reporting and the seven fabricated demo leads: removed; Supabase errors now propagate.
- WhatsApp: outbound send path implemented (`lib/whatsapp/send.ts`); `leads.email` made nullable so the fabricated `@wa.neuralwaves.in` addresses are gone.
- Writes that claimed success on failure: errors now returned and surfaced.
- Trust claims: "12+ projects" → real count; "Verified Outcome" on demos → labelled demo; "Google Meet link generated" removed; delivery promises no longer contradictory.
- Unused social proof: testimonials section added and rendering.
- Soft 404s on unknown `/work/*` and `/services/*` URLs: now `noindex` with no canonical, so they cannot be indexed.
- Positioning: footer reads "Engineered in India · Serving the UAE".

### P1 — resolved

Security headers (HSTS, nosniff, frame options, referrer, permissions) and `poweredByHeader: false`; CSP shipped **report-only**; `/privacy` and `/terms` added and linked; schema hardening (CHECK constraints, missing triggers/indexes, `search_path` pin, idempotent seeds); accessibility (SectionHeader ids for six dangling `aria-labelledby`, form `aria-describedby`/`aria-invalid`/`role="alert"` with focus management, Escape-closable dialogs); hero renders real values without JS; CI workflow added; dead Vercel analytics and 312 KB of unused assets removed; single canonical origin via `lib/config.ts`.

### ⚠️ Still outstanding — you must do these

1. **Apply the database migrations.** The RLS fix and schema hardening are delivered as SQL files; nothing changes in your live database until they run. Use `supabase db push`, or paste `supabase/migrations/20261009_fix_chat_rls_public_pii.sql` and `20261009_harden_schema.sql` into the SQL editor, then re-run the P0-1 curl and confirm it returns `[]`.
2. **Register `neuralwaves.in`.** Still unregistered. The live site is currently served from a `workers.dev` hostname while the code's canonical fallback points at the unregistered domain — set `NEXT_PUBLIC_SITE_URL` to whichever host you actually serve, and note `app/api/og`, `sitemap` and `robots` all follow it.
3. **Set `ADMIN_EMAILS` as a Worker secret.** It was removed from `wrangler.toml` because committing the allowlist is what an attacker targets. The admin check fails closed, so **the admin panel is inaccessible until you set it**: `npx wrangler secret put ADMIN_EMAILS`.
4. **The cron still will not run** without a `scheduled` handler — a Cloudflare Cron Trigger does not make an HTTP request, and OpenNext's generated Worker only exports `fetch`. Two options are documented in `wrangler.toml`.
5. **Rate limiting and bot protection** on the enquiry forms are still absent (the in-memory `Map` is per-isolate on Workers and the key is attacker-controlled). Use Cloudflare Rate Limiting rules plus Turnstile. An unauthenticated `POST` to the Supabase REST endpoint can also insert leads directly; consider revoking the anon insert policy now that submissions go through the server.
6. **Clerk 5.7.6 → 7.x** and **Tailwind 3 → 4** remain as majors; the remaining `npm audit` highs are the dev toolchain plus a Clerk advisory that concerns organizations/billing/reverification, none of which this app uses.
7. **`next lint` is deprecated** and removed in Next 16; migrate to the ESLint CLI before that upgrade.
8. **`/services/{chatbots,dashboards,agents}` duplicate `/services/[slug]`** (static routes shadow the dynamic one). They are in sync now, but consolidating them would remove ~600 lines of near-copies.
9. **The chat widget is still mounted in the root layout** and polls every 3–10s per visitor. Lazy-load it on interaction if you want the page-weight back.

---

## 0. Verdict

This is **well above** the usual early-startup repo. 18.5k lines that type-check, build, and mostly work. Real RLS on 14 tables, idempotent DDL, admin CRUD, structured data, sitemap, a coherent design system, delete confirmations, loading/error states. A lot of genuine engineering is here.

It is **not safe to deploy**, for two separate reasons:

1. **Your visitors' personal data is public.** Every chat transcript — name, email, phone, company, full message history — is readable *and rewritable* by anyone on the internet using a key that already ships in your browser bundle.
2. **Authorization is essentially absent.** 22 of 24 admin mutations have no auth check; the middleware only asks "is *anyone* logged in?"; self-signup is open; and two service-role API endpoints accept any cookie as proof of admin rights.

And it **does not do what you are selling**: the WhatsApp product only receives, never replies; the live chat quotes different prices than your pricing page; the homepage's three case-study cards all 404.

**The critical context:** `neuralwaves.in` **is not registered**. Nothing is deployed. Every P0 below is still un-exploited — you get to fix this quietly. Register the domain today.

---

## 1. Status: not deployed, and the brand's domain is not yours

```
$ dig +short neuralwaves.in A     → (empty)
$ dig +short example.com A        → 104.20.23.154        # control: network works
$ whois neuralwaves.in
>>> Domain neuralwaves.in is available for registration
```

`https://neuralwaves.in` is your `metadataBase`, root canonical, sitemap host, robots host, every page canonical, all JSON-LD, the OG URLs, the cron link and the README.

**Good news:** none of the P0s have been exposed. If this *had* been live, P0-1 alone would be a notifiable personal-data breach under UAE PDPL.

**Urgent:** anyone can register `neuralwaves.in` right now — a squatter, or a competitor. You are publishing it as your company identity. **Register it before you do anything else in this document** (~₹800/yr). Also try `neuralwaves.ae` and `neuralwaves.com`.

**Positioning mismatch to resolve.** The copy says Dubai/DIFC; the digital footprint says India — a `.in` TLD, `+91-8840936715` published as the contact number (`lib/data/site-data.ts:68-71`), and a Gmail address. For a UAE SME buyer evaluating a "Dubai studio", an Indian phone number and domain undercut the exact trust signal the copy works to build. Either commit to the UAE footprint (`.ae` domain, UAE number) or reposition honestly as an India-based studio serving UAE clients. Right now it reads as neither.

---

## 2. P0 — Security. Fix before any deploy.

### P0-1 · Every visitor chat transcript is publicly readable *and* rewritable

`supabase/schema.sql:731-744` (duplicated verbatim in `supabase/migrations/20261009_chat_system.sql:46-65`):

```sql
CREATE POLICY "Public can view chat sessions"   ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Public can insert chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update chat sessions" ON public.chat_sessions FOR UPDATE USING (true);
CREATE POLICY "Public can view chat messages"   ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public can insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
```

None of these specify `TO`, so they apply to `PUBLIC` — **including `anon`**. `chat_sessions` holds `visitor_name`, `visitor_email`, `visitor_phone`, `visitor_company`; `chat_messages` holds the full transcript. `lib/chat-flow.ts:61-83` actively mines email and phone out of free-text chat.

The anon key is public by design (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, used in `lib/supabase/client.ts:3-10`). So this needs no application interaction at all:

```bash
ANON=<your NEXT_PUBLIC_SUPABASE_ANON_KEY>; URL=https://<ref>.supabase.co
curl "$URL/rest/v1/chat_sessions?select=visitor_name,visitor_email,visitor_phone" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
curl "$URL/rest/v1/chat_messages?select=*" -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
```

The `FOR UPDATE USING (true)` policy has **no `WITH CHECK`**, so Postgres reuses `true` for the new row — meaning an anonymous attacker can rewrite **every column of every session**:

```bash
curl -X PATCH "$URL/rest/v1/chat_sessions?id=eq.<uuid>" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON" -H "Content-Type: application/json" \
  -d '{"status":"resolved","visitor_email":"attacker@evil.com"}'
```

Every other table does this correctly (`TO authenticated USING (public.is_admin())`, `schema.sql:238-333`). The chat tables were added later (Phase 12) and skipped the pattern. `is_admin()` already exists — use it.

**Fix:**

```sql
DROP POLICY IF EXISTS "Public can view chat sessions"   ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can insert chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can update chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can view chat messages"   ON public.chat_messages;
DROP POLICY IF EXISTS "Public can insert chat messages" ON public.chat_messages;

-- Visitor traffic never touches these tables directly — the API routes use the
-- service-role key (lib/chat-store.ts → supabaseAdmin), which bypasses RLS.
-- So no anon policy is needed at all.
CREATE POLICY "Admins read chat_sessions" ON public.chat_sessions
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins read chat_messages" ON public.chat_messages
  FOR SELECT TO authenticated USING (public.is_admin());
```

The existing `FOR ALL ... is_admin()` policies cover admin write access. **Verify** by re-running the curl — it must return `[]`. Fix the migration file too, or the hole returns on the next `supabase db push`. Then rotate the anon key if the project has been reachable.

### P0-2 · One cookie header bypasses admin auth on two service-role endpoints

`app/api/admin/chat-reply/route.ts:16-22` — identical at `chat-status/route.ts:15-21`:

```ts
const authResult = await verifyAdminAccess();
if (authResult.status !== "authorized") {
  const adminCookie = req.cookies.get("admin_session")?.value || req.cookies.get("__session")?.value;
  if (!adminCookie && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}
```

Trace it. If the request is **not** authorized but *does* carry any non-empty `admin_session` or `__session` cookie, the inner condition is false and execution **falls through to the handler** — in production as well. The cookie's **value is never checked**; only its existence. Both routes then write using `supabaseAdmin`, the service-role key that bypasses RLS entirely.

```bash
# works in production, no auth, no valid session:
curl -X POST https://<host>/api/admin/chat-reply \
  -H "Cookie: __session=1" -H "Content-Type: application/json" \
  -d '{"sessionId":"<any-uuid>","message":"attacker controlled"}'
```

**Fix** — delete the fallback; authorize unconditionally:

```ts
const authResult = await verifyAdminAccess();
if (authResult.status !== "authorized") {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}
```

### P0-3 · 22 of 24 admin mutations have no authorization check

Every `app/admin/*/actions.ts` opens with `"use server"`, which makes **every export a public HTTP endpoint**. Only `chats/actions.ts` calls `verifyAdminAccess()`. A repo-wide grep for `verifyAdminAccess|isEmailAuthorizedAdmin|currentUser|auth()|getUser()` returns 11 hits total.

Unguarded, and all calling the RLS-bypassing `supabaseAdmin` / `createAdminClient()`:

| File | Unauthorized exports |
|---|---|
| `app/admin/leads/actions.ts` | `updateLeadStatus`, `bulkUpdateLeads`, **`bulkDeleteLeads`**, `createManualLead`, **`getLeads`** (all lead PII) |
| `app/admin/faqs/actions.ts` | `createAdminFaq`, `updateAdminFaq`, `deleteAdminFaq`, `getAdminFaqs` |
| `app/admin/services/actions.ts` | `createAdminService`, `updateAdminService`, `deleteAdminService`, `getAdminServices` |
| `app/admin/portfolio/actions.ts` | `createAdminProject`, `updateAdminProject`, `deleteAdminProject`, `uploadProjectImage`, `getAdminProjects` |
| `app/admin/pricing/actions.ts` | `createAdminPricingTier`, `updateAdminPricingTier`, `deleteAdminPricingTier`, `getAdminPricingTiers` |
| `app/admin/testimonials/actions.ts` | `createAdminTestimonial`, `updateAdminTestimonial`, `deleteAdminTestimonial`, `getAdminTestimonials` |
| `app/admin/settings/actions.ts` | `updateAdminSettings`, `deleteAdminSetting`, `getAdminSettings` |
| `app/admin/chats/actions.ts` | `getAdminChatSessions`, `getAdminChatSessionWithMessages` (reads every transcript) |

`bulkDeleteLeads` (`app/admin/leads/actions.ts:228-243`) is an unauthenticated hard-delete primitive against your entire lead table.

**Why middleware doesn't cover it** (`middleware.ts:17-26`):

```ts
if (isAdminRoute(req) && !isAuthRoute(req)) {
  const { userId } = auth();
  if (!userId) { /* redirect */ }        // ← only "is anyone logged in?"
}
```

It never consults `ADMIN_EMAILS`. And anyone can become a logged-in user — `app/sign-up/[[...sign-up]]/page.tsx` is a bare `<SignUp />`: **open public registration**, no allowlist.

`app/admin/(dashboard)/layout.tsx:17` *does* enforce the whitelist — but that is a **React render**, not an authorization boundary. It gates *seeing* the page; it cannot gate a POST to a server action, which never renders the dashboard layout.

**Fix — all four layers:**

1. A guarded helper, called as the first statement of every export:

```ts
// lib/auth/require-admin.ts
import { verifyAdminAccess } from "./admin-auth";

export async function requireAdmin() {
  const auth = await verifyAdminAccess();
  if (auth.status !== "authorized") throw new Error("Unauthorized");   // fail closed, never fall through
  return auth;
}
```

2. Remove the fail-open escape hatch at `app/admin/chats/actions.ts:90` and `:128`:

```ts
// WRONG — allows unauthenticated mutation whenever NODE_ENV !== "production"
if (auth.status !== "authorized" && process.env.NODE_ENV === "production") { ... }
// RIGHT
if (auth.status !== "authorized") { ... }
```

This is worse on Cloudflare Workers, where `NODE_ENV` is not guaranteed to be `"production"` at runtime — the check can silently evaluate false in production and let everything through.

3. Enforce the whitelist in middleware, not merely "signed in":

```ts
clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && !isAuthRoute(req)) {
    const { userId, sessionClaims } = auth();
    if (!userId) return NextResponse.redirect(new URL("/admin/login", req.url));
    const email = (sessionClaims?.email as string | undefined)?.toLowerCase();
    if (!email || !getAuthorizedAdminEmails().has(email)) {
      return NextResponse.redirect(new URL("/admin/login?error=not_authorized", req.url));
    }
  }
});
```

4. **Disable self-signup in the Clerk dashboard** (User & Authentication → Restrictions). An admin-only panel has no business accepting public registrations.

### P0-4 · The email-verification gate in `verifyAdminAccess()` is defeated

`lib/auth/admin-auth.ts:124-156`:

```ts
const candidateEmails = [
  ...verifiedEmails,
  primaryEmail.toLowerCase(),
  ...emailObjects.map((e) => e.emailAddress.toLowerCase()),   // ← includes UNVERIFIED
].filter(Boolean);

for (const candidateEmail of candidateEmails) {
  if (await isEmailAuthorizedAdmin(candidateEmail)) {
    const isVerified = /* ... */;
    if (!isVerified && verifiedEmails.length === 0) {          // ← the bug
      return { status: "unverified", ... };
    }
    return { status: "authorized", email: candidateEmail, ... }; // ← unverified address accepted
  }
}
```

Two defects compound: the candidate list includes **unverified** addresses, and the verification requirement only applies when the account has **zero** verified addresses. So a user holding one verified email of their own **plus** any unverified address on the admin whitelist is returned `authorized` — under the unverified address — and enters the panel.

Whether this is trivially weaponisable depends on Clerk's cross-account email-uniqueness rules, but it directly contradicts the function's own contract ("Enforces Clerk authentication, email verification status, and admin whitelist check") and is one line wide.

**Fix** — only ever consider verified addresses:

```ts
const verifiedEmails = emailObjects
  .filter((e) => e.verification?.status === "verified")
  .map((e) => e.emailAddress.toLowerCase());

if (verifiedEmails.length === 0) {
  return { status: "unverified", email: primaryEmail, authProvider: "clerk", user,
           message: "Verify your email before entering the admin portal." };
}
const authorized = verifiedEmails.find((e) => getAuthorizedAdminEmails().has(e));
if (!authorized) {
  return { status: "unauthorized", email: verifiedEmails[0], authProvider: "clerk", user,
           message: "Your verified account is not on the authorized administrator whitelist." };
}
return { status: "authorized", email: authorized, authProvider: "clerk", user };
```

Also delete the hardcoded admin emails from source (`lib/auth/admin-auth.ts:47-50`). They are committed to a public GitHub repo — along with `.env.example:12,21`, `DEPLOYMENT_CHECKLIST.md:18,29`, `README.md:105` and the `superadmin` promotion value in the SQL. Anyone with repo access learns your exact admin allowlist. Replace with `admin@example.com` placeholders; keep real values only in `.env.local`/platform env. And fail closed when `ADMIN_EMAILS` is unset.

### P0-5 · The WhatsApp webhook accepts forged requests, and its verification token is public

`app/api/whatsapp/webhook/route.ts:31-140`. The POST handler never verifies Meta's `X-Hub-Signature-256` HMAC — a repo-wide grep for `x-hub-signature|createHmac|timingSafeEqual|APP_SECRET` returns nothing. It only checks `body.object === "whatsapp_business_account"`, which an attacker simply sets.

An unauthenticated loop can flood `contacts`, `conversations`, `messages` and — worst — `leads` (`route.ts:117-128`), poisoning the sales pipeline at will. None of the six `await` results in that block are inspected (lines 63, 80, 89, 94, 108, 117), so failures are silent. There is also no idempotency, so Meta's own retries create duplicate rows.

Separately, the GET handshake uses a hardcoded fallback that **is the real value**:

```ts
const verifyToken = process.env.VERIFY_TOKEN || "neuralwaves_wa_secret_verify_token_2026";  // :16
if (mode === "subscribe" && token === verifyToken) { ... }                                   // :18, not timing-safe
```

That literal equals your `.env.local` `VERIFY_TOKEN` and is also committed to `.env.example`. Meanwhile `DEPLOYMENT_CHECKLIST.md:118` publishes a *third*, different value — so the checklist's own smoke test returns 403.

**Fix** — verify the signature over the raw body before parsing:

```ts
import crypto from "node:crypto";

function verifyMetaSignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const received = header.slice(7);
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(received, "hex"));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();                    // raw, NOT req.json()
  if (!verifyMetaSignature(rawBody, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const body = JSON.parse(rawBody);
  // ...
}
```

Add `META_APP_SECRET`, remove the token fallback (fail closed when unset), rotate the token, scrub `DEPLOYMENT_CHECKLIST.md:118`, and dedupe on `message.id`.

### P0-6 · The cron endpoint is unauthenticated

`app/api/cron/lead-digest/route.ts:9-12`:

```ts
if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

`CRON_SECRET` is **absent from `.env.local`** (verified), so `&&` short-circuits and **the guard never runs**. Anyone can `GET /api/cron/lead-digest` to read lead counts with the service-role key and trigger a Resend digest email on demand — a spam amplifier and an unauthenticated data-read primitive. `DEPLOYMENT_CHECKLIST.md:30` marks the var "Optional", which is how this happened. The comparison is also a plain `!==` (not timing-safe).

**Fix** — fail closed, compare in constant time:

```ts
const secret = process.env.CRON_SECRET;
if (!secret) return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
const provided = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
if (provided.length !== secret.length ||
    !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(secret))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### P0-7 · You are shipping an end-of-life framework, and the build script hides it

`package.json:29` pins `next@14.2.35`. Per OpenNext's own support table (`node_modules/@opennextjs/aws/dist/build/helper.js:232,252-256`), Next 14 support ended **2025-10-26 — about 12 months ago**. The library's error text is explicit: *"Unsupported releases may contain unpatched security vulnerabilities."* Without a bypass it calls `process.exit(1)`.

`scripts/build.js:9` passes `--dangerouslyUseUnsupportedNextVersion`. That flag is **load-bearing**: remove it and the build fails. It is the only reason production is deployable.

Independently confirmed by the peer contract: `@opennextjs/cloudflare@1.20.10` requires `next >=15.5.27 <16 || >=16.3.8`. Next 14 is outside the supported combination. `.npmrc`'s `legacy-peer-deps=true` plus the `overrides.next = "$next"` block (`package.json:52-57`) suppress exactly this one conflict — `npm ls --depth=0` exits clean precisely *because* the warning is silenced.

**Fix:** upgrade to `next@15.5.x` (or ≥16.3.8), then delete the flag and both escape hatches, and re-install so real conflicts surface.

---

## 3. P0/P1 — The product does not do what it says

### F-1 · Your WhatsApp product cannot reply, and is advertised as conversational

`WHATSAPP_TOKEN` and `PHONE_NUMBER_ID` are documented in `.env.example` but **never read anywhere in the codebase**, and there is no call to `graph.facebook.com` in the entire repo. The webhook only ingests.

So the README's headline product — *"Verified Meta WhatsApp Cloud API bots with bilingual (Arabic & English) natural language understanding, instant calendar booking, and live agent escalation"* — is not implemented here. Inbound messages are stored and turned into leads, and then silence. If a prospect messages your demo number, nothing comes back.

(Note: the lead insert itself does succeed — `leads.source` has `DEFAULT 'website_contact'` at `schema.sql:33` — but no reply is ever sent.)

**Fix** — build the send path or stop advertising it:

```ts
// lib/whatsapp/send.ts
export async function sendWhatsAppText(to: string, body: string) {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body } }),
    }
  );
  if (!res.ok) throw new Error(`WhatsApp send failed: ${res.status} ${await res.text()}`);
}
```

Then decide honestly whether Arabic/English *NLU* is something you can deliver before it stays on a pricing page. `lib/chat-flow.ts` is keyword matching (`:184` matches `lower.includes("demo")`) — perfectly fine for an FAQ bot, not "natural language understanding".

### F-2 · Your chat bot quotes different prices than your pricing page

Three sources of truth, two of them wrong:

| Source | Starter | Growth | Enterprise |
|---|---|---|---|
| **Public pricing page** — `lib/data/site-data.ts:290,307,324,341` | AED 1,500 | 3,500 | 7,500 (+15,000 tier) |
| **Seeded chat copy** — `schema.sql:674,678-680` | AED 1,500 | 3,500 | 7,500 |
| **Live chat widget** — `lib/chat-flow.ts:124,129,134,155-164` | **AED 2,000** | **4,500** | **9,500** |

`lib/chat-flow.ts` is what the website chat actually runs, so a visitor can be quoted **AED 2,000** in chat and then see **AED 1,500** on `/pricing` thirty seconds later. For a studio whose entire pitch is "transparent fixed pricing, no hourly rates, no surprise invoices", this is the most credibility-destroying bug in the repo.

**Fix** — delete the hardcoded figures from `chat-flow.ts` and read `getPricingTiers()`, so there is one source of truth. Add a test that asserts the chat copy and the pricing page agree.

### F-3 · All three homepage case-study cards link to 404s

`components/sections/featured-work.tsx:9,29,55` hardcodes slugs and links `/work/${slug}` at `:108`:

| Linked | Actual route | Result |
|---|---|---|
| `/work/realestate-whatsapp-bot` | `/work/dubai-real-estate-whatsapp-bot` | **404** |
| `/work/logistics-dashboard` | `/work/abu-dhabi-logistics-lead-agent` | **404** |
| `/work/ecommerce-agent` | `/work/restaurant-ordering-dashboard` | **404** |

`app/work/[slug]/page.tsx:54-55` calls `notFound()` for unknown slugs, so all three render your 404 page. This is a full viewport of your homepage — the "proof of work" section of a studio selling shipped systems — sending every curious buyer to a dead end.

**Fix** — delete the local `PROJECTS` array and render `getFeaturedProjects()` (`lib/data/db-queries.ts:134`, already exists). That fixes the links *and* makes the homepage portfolio admin-editable, which it currently is not.

### F-4 · Admin edits silently fail to reach parts of the public site

`lib/data/db-queries.ts` correctly routes most pages through the DB. These do not:

- **`components/sections/featured-work.tsx:7`** — hardcoded projects. Homepage portfolio frozen (see F-3).
- **`app/contact/page.tsx:199,208,240,249`** — hardcoded `SITE_CONFIG.contact.*`. `updateAdminSettings` even calls `revalidatePath("/contact")` (`app/admin/settings/actions.ts:61`), so it *looks* wired. Changing your phone number in the panel will not change the contact page.
- **Detail pages are statically generated** — the build marks `/services/[slug]` and `/work/[slug]` as `● SSG`, and `app/admin/services/actions.ts` and `portfolio/actions.ts` contain **zero `revalidatePath` calls** (verified). Editing a service updates `/services` but not `/services/chatbots`.
- **`app/sitemap.ts:2`** and `components/seo/json-ld.tsx:2` read static `PROJECTS_DATA`/`SERVICES_DATA`, so DB-added content never reaches the sitemap (or becomes a listed 404 when deleted).
- **`app/services/{agents,chatbots,dashboards}/page.tsx:7`** build `metadata` from `SERVICES_DATA[i]` but render the body from `getServiceBySlug()`. After one admin edit, `<title>`, OG tags and H1 disagree with each other.
- **WhatsApp number hardcoded in 7 places** (`nav.tsx:28`, `footer.tsx:23`, `hero.tsx:10`, `final-cta.tsx:11`, `contact/page.tsx:23`, `ChatWidget.tsx:469`, `error.tsx:72`), so the admin `whatsapp_number` setting is ignored.

**Fix** — route all of it through `db-queries.ts`; add `revalidatePath("/services/[slug]", "page")`-style calls to the service and portfolio actions.

### F-5 · Writes report success when they failed, and empty tables serve fabricated data

`app/admin/faqs/actions.ts:124-139` (same shape in `services`, `settings`, `leads`) catches a Supabase error, falls through to the in-memory cache, and:

```ts
return { success: true, faq: newFaq };   // ← the write never happened
```

`app/admin/leads/actions.ts:181-191` doesn't even inspect the result:

```ts
await supabase.from("leads").update({ ... }).eq("id", leadId);   // error discarded
```

The UI then toasts success — `components/admin/leads-table.tsx:120,137,159` do it unconditionally. An operator sees "Lead updated successfully" for a change that was never saved.

Worse, `app/admin/leads/actions.ts:137` guards with `if (!error && data && data.length > 0)`, so a production table with **zero** leads falls through to `return memoryLeads` (`:170`) — **seven invented leads** with fake `.ae` emails and "Deposit paid" notes seeded at `:41-126`. On day one your dashboard shows pipeline that does not exist. Same at `services/actions.ts:54` and `faqs/actions.ts:35`.

**Fix** — treat `length === 0` as a valid empty result; never seed demo data outside development; always propagate Supabase errors as `{ success: false, message }`; branch the UI on the real result.

### F-6 · The weekly digest will never run

`vercel.json:2-7` declares a Vercel cron for `/api/cron/lead-digest`, but `scripts/build.js` and `wrangler.toml` deploy to **Cloudflare Workers**, which ignores `vercel.json`. `wrangler.toml` has no `[triggers]`. The digest is dead config. `@vercel/analytics` and `@vercel/speed-insights` (`app/layout.tsx:4-5`) are likewise Vercel-only and collect nothing on Workers.

**Fix** — add to `wrangler.toml`:

```toml
[triggers]
crons = ["0 8 * * 1"]
```

Keep the P0-6 auth fix (a trigger still hits a public URL), and drop the Vercel analytics deps if Cloudflare is the target.

### F-7 · OpenNext + Vercel: pick one, and make the docs tell the truth

`package.json:7,9` — `build` and `build:cloudflare` are the *same* command, and the only deploy script is `deploy:cloudflare`. Corroborating Cloudflare artifacts: `wrangler.toml:1-6`, `open-next.config.ts:3`, a real `.open-next/worker.js` on disk.

Yet **100% of the documentation describes Vercel**: `README.md:111` ("Deployment to Vercel"), `README.md:116-118` (says verify "all 23 routes compile" — you have 43), and `DEPLOYMENT_CHECKLIST.md:8-30,79-99,164-171` is exclusively Vercel. Neither doc mentions wrangler, OpenNext or Cloudflare once. The `scripts/build.js:8` comment even says *"In Cloudflare CI"* — and there is no CI at all.

Also stale/broken: `wrangler.toml:3` `compatibility_date = "2024-12-30"` is ~22 months behind OpenNext's own default, and `open-next.config.ts:3` is a bare `defineCloudflareConfig()` with no `incrementalCache` and no `r2_buckets` — so ISR/`revalidate` cannot persist, unlike the Vercel behaviour the docs assume.

Docs also describe code that does not exist: `DEPLOYMENT_CHECKLIST.md:187` claims `matcher: ["/admin/:path*"]` (reality: `middleware.ts:106-110`); `:183` claims both OG routes export `runtime = "edge"` and use `@vercel/og` (neither exports `runtime`; both import from `next/og`); `README.md:21` claims `@vercel/font` (you use `next/font`).

**Fix** — choose Cloudflare (it is what the code does), rewrite both docs, delete `vercel.json`, bump `compatibility_date`, add an R2 incremental-cache binding, and add CI.

---

## 4. P1 — Conversion, trust and accessibility

- **Pricing CTAs drop the chosen tier.** `app/pricing/page.tsx:157` links `/contact?tier=Growth`, but `app/contact/page.tsx` never reads search params (zero matches for `tier`). The buyer clicks "Get started" on a tier and lands on a blank, unselected form. Read the param and preselect the service field.
- **You have testimonials and show none of them.** Three named 5-star quotes exist at `lib/data/db-queries.ts:29-51,203-224` and are wired only to the admin panel. **No public page calls `getTestimonials()`** (grep: 0 hits). There are no client logos and no team section. This is free, already-written social proof you are not using.
- **Trust claims that don't survive a click.**
  - "12+ Projects Shipped" (`components/sections/hero.tsx:206`, `app/work/page.tsx:87`, `app/opengraph-image.tsx:149`) vs **4 projects total, 2 of them labelled Demo** (`lib/data/site-data.ts:239,264`).
  - `app/work/page.tsx:83` — "Every system below was architected, coded, and deployed for UAE SMEs in under 10 days" — while half the cards are demos.
  - `app/work/[slug]/page.tsx:126-138` stamps a **"Verified Outcome"** badge on a demo result.
  - `app/contact/page.tsx:367` claims "Google Meet link generated" — there is no calendar integration; the slot is only pasted into the message textarea (`:97-105`).
  - "Dubai-based, DIFC Gate Precinct" (`lib/data/site-data.ts:55-57`) vs a +91 phone and a Gmail address.
  - Delivery promise varies across the site: "5 days" (hero, how-it-works, work) vs 3–5/5–7/7–10/10–15 (pricing) vs "3 to 7 working days" (FAQ, `site-data.ts:368`).
  
  For B2B, an unverifiable claim a prospect can check is worse than no claim. Replace the numbers with real ones, label demos as demos everywhere, and drop the Google Meet line.
- **`ar-AE` hreflang points at `/ar/*` routes that do not exist** (`app/layout.tsx:69` + 7 more pages; there is no `app/ar`). Google crawls them, gets 404s, and devalues the cluster. Build the Arabic locale — genuinely valuable for your market, and you already claim bilingual capability — or delete every alternate.
- **Form errors are invisible to assistive tech.** `app/contact/page.tsx:470-472,492-494,516-518,581-583` render bare `<p class="text-red-400">` with no `id`, no `aria-describedby`, no `aria-invalid`; `:440` sets `noValidate` so the browser can't help either. The homepage form discards `fieldErrors` entirely (`components/sections/final-cta.tsx:115-121`). Zero `aria-describedby`/`aria-invalid`/`aria-live` in the whole public tree.
- **No dialog focus management.** Mobile nav (`components/layout/nav.tsx:139-161`) and the chat panel (`components/ChatWidget.tsx:277-283`) are `role="dialog" aria-modal` with no focus trap, no Escape handler and no focus return; the chat log has no `aria-live`, the text input has no label (placeholder only, `:442-454`), and the refresh/minimise buttons are `title`-only (`:328-342`).
- **Six dangling `aria-labelledby`.** `components/ui/section-header.tsx:47` renders `<h2>` with no `id`, while `faq.tsx:51`, `featured-work.tsx:82`, `pricing-teaser.tsx:73`, `how-it-works.tsx:56`, `why-neuralwaves.tsx:38` and `services.tsx:209` all reference ids that are never rendered. Only `final-cta.tsx:17/58` is correct. Add an `id` prop to `SectionHeader`.
- **The chat widget taxes every page view.** Mounted in the root layout (`app/layout.tsx:12,164`), it statically imports `@supabase/supabase-js` (`components/ChatWidget.tsx:16-17`) — pulling Supabase into the shared public bundle — fetches `/api/chat/session` on load (`:68-86`) and then polls every 10s (closed) / 3s (open) forever (`:146-166`). Lazy-load it on interaction.
- **`"use client"` on fully static content:** `trust-strip.tsx:1`, `featured-work.tsx:1`, `why-neuralwaves.tsx:1`, `section-header.tsx:1`, `logo.tsx:1`, `footer.tsx:1`. `services.tsx:49-54` runs a `setInterval` every 2.4s forever with no IntersectionObserver, and `SpotlightCard` (`:20-24`) re-renders on every mousemove per card.
- **Hero stats render "0+" without JS.** `components/ui/reveal.tsx:120` SSRs `0{suffix}`, filled only after hydration — crawlers and JS-failure visitors see "0+ projects shipped / 0-day avg delivery". Render the final value and animate transform/opacity only.
- **Homepage pricing grid is over-filled.** `app/page.tsx:51-59,75` passes all 4 DB tiers into a `lg:grid-cols-3` template (`pricing-teaser.tsx:96`), so the 4th card wraps alone and the "Most popular" centring breaks. `:170` also says "5-day delivery" while that 4th tier is 10–15 days.
- **`robots.ts:9` disallows `/api/og/*`**, so your per-route OG images cannot be crawled. `/sign-in` and `/sign-up` are crawlable and not disallowed.
- **Dead external links published as entity signals:** `https://github.com/neuralwaves` → 404 (in `sameAs`, `components/seo/json-ld.tsx:42`), `https://twitter.com/neuralwaves_in` → 404 (`layout.tsx:95-96`), `https://cal.com/neuralwaves/15min` → 404 (`lib/data/site-data.ts:72`). Broken `sameAs` links weaken the entity graph, and a dead booking link kills the highest-intent CTA.
- **No privacy policy or terms page anywhere** (no `/privacy`, `/terms` in the build). You set a persistent identifier (`ChatWidget.tsx:59-62` writes `neuralwaves_chat_vid` to `localStorage`) linked to stored PII, capture names/emails/phones, and run analytics. Under UAE PDPL — and GDPR for any EU visitor — that is a compliance gap, and UAE enterprise buyers notice its absence.
- **Rate limiting does not work.** `app/contact/actions.ts:8` uses a module-level `Map`, so it is per-isolate on Workers and collapses on cold start; the key `${email}:${phone}` is attacker-controlled, so varying the phone number defeats it. `app/actions/lead.ts` — the action actually wired to the public form — has no rate limiting at all. `leads` also accepts `INSERT TO anon WITH CHECK (true)` (`schema.sql:249-251`) with no DB throttle, so the publishable key alone allows unlimited spam. Add Cloudflare rate limiting + Turnstile, or move the insert server-side.
- **Missing security headers.** `next.config.mjs:2` is literally `const nextConfig = {};` — no CSP (hence no `frame-ancestors`, the only real clickjacking control), no HSTS, no `nosniff`, no `Referrer-Policy`, no `Permissions-Policy`, and `X-Powered-By: Next.js` still advertises an EOL framework. Add them (see the snippet at the end of §8).
- **`getSession()` gates the admin route.** `middleware.ts:79` uses `supabase.auth.getSession()`, which reads the cookie without validating the JWT. Supabase's guidance is that it must never gate server-side authorization — use `getUser()`. (Currently dead because Clerk short-circuits at `:31-33`, which is itself P0-3.)
- **Admin edits report success through a fake cache.** `lib/supabase.ts:60-64` and `lib/supabase/server.ts:9-13` fall back to the **anon key** when `SUPABASE_SERVICE_ROLE_KEY` is missing. Then `is_admin()` is false, `leads` returns 0 rows, and `leads/actions.ts:137→170` returns the seven fabricated leads as if real. Fail loudly at boot instead.
- **Brand: `nurix` leaks into customer-visible copy.** `supabase/schema.sql:673,675` seeds chatbot replies saying *"Recent **Nurix** builds… Visit **nurix.ae/work**"* and *"book a 15-min call at **nurix.ae/contact**"* — a **different domain** than the canonical `neuralwaves.in` used everywhere else, shown to real visitors. Also `wrangler.toml:1` `name = "nurix"` (which sets your workers.dev URL), `package.json:2`, and dead cookie cleanup at `app/admin/login/actions.ts:90-91`. Rename the Worker, fix the seeds, rotate the token.
- **No CI at all.** No `.github` directory. Given P0-7 and the auth bugs above, a PR workflow running `npm ci && npx tsc --noEmit && npm run lint && npm run build` is cheap insurance — and nothing else would have caught that you're shipping EOL Next.

---

## 5. P1 — Data layer and schema

- **`leads.status` enum drift.** `schema.sql:32` documents `new/contacted/qualified/closed/archived`; the TypeScript union is `new/contacted/won/lost/archived` (`app/admin/leads/actions.ts:35`). No `CHECK` constraint, so both sets coexist in production. `chat_sessions.status`, `chat_messages.sender` and `messages.sender_type` also have no `CHECK`.
- **Non-idempotent seeds.** `testimonials` (`schema.sql:565-593`) and `faqs` (`:596-653`) have no unique key and no `ON CONFLICT`, so every run of `schema.sql` appends 3 and 8 duplicate rows. `menu_items` uses `ON CONFLICT (id) DO NOTHING` (`:682`) but never supplies `id` (`:669-681`), so all 8 rows duplicate on every re-run.
- **Missing `updated_at` triggers.** `set_updated_at()` exists (`schema.sql:201-209`) but triggers were created only for `leads` (`:212`) and `contacts` (`:217`). `chat_sessions` (`:710`) and `site_settings` (`:122`) are missing, so `lib/chat-store.ts:59` and the API routes poke `updated_at` by hand — exactly the drift a trigger prevents.
- **Missing indexes on hot paths.** No `chat_sessions(status, last_message_at DESC)` for the admin inbox sort (`app/admin/chats/actions.ts:25`); no `leads(created_at)` for the digest — `idx_leads_status_created` (`:176`) leads with the wrong column, so it is unusable for `created_at >=` (`route.ts:23`); no `admins(email)`/`admins(user_id)` despite `is_admin()` filtering on both (`:195-196`).
- **`is_admin()` is `SECURITY DEFINER` with an unpinned `search_path`** (`schema.sql:187-198`) — the classic privilege-escalation vector. Add `SET search_path = public, auth`.
- **Over-permissive reads on config tables.** `site_settings FOR SELECT USING (true)` (`:304-305`) and `pricing_tiers USING (true)` (`:278`) expose every row to `anon`, including unpublished pricing tiers. (Checked: `site_settings` currently holds only public contact info, so no secret leaks today — but the policy is a footgun.)
- **The admin chat RLS policies are dead code.** `schema.sql:747-762` key on `auth.uid()`/`auth.jwt()`, and with Clerk as the IdP no Supabase JWT ever exists. All admin access flows through the service-role key, so **RLS is decorative for admins** — which is precisely why the missing checks in P0-3 are the real boundary.
- **Schema drift.** `supabase/migrations/20261009_chat_system.sql` is a byte-equivalent duplicate of `schema.sql:692-778`, so the same permissive policies ship twice and running both re-applies everything.

---

## 6. Architecture — the root cause

You are running **two complete authentication stacks at once**. Both installed, both configured in `.env.local`, with two parallel login flows:

| Clerk | Supabase Auth |
|---|---|
| `app/sign-in/[[...sign-in]]/page.tsx` | `app/admin/login/[[...rest]]/page.tsx` |
| `app/sign-up/[[...sign-up]]/page.tsx` | `app/admin/login/actions.ts` (`sendMagicLink`) |
| `app/admin/login/[[...rest]]` renders `<SignIn />` | `app/auth/callback/route.ts` |
| `middleware.ts:17-26` (`userId`) | `middleware.ts:35-95` (cookie session) |
| `lib/auth/admin-auth.ts:105-160` | `lib/auth/admin-auth.ts:180-215` |

Plus `app/admin/auth/callback/route.ts` is a **byte-identical duplicate** of `app/auth/callback/route.ts` and is dead (login sends users to `/auth/callback`) — yet `middleware.ts:13` still exempts `/admin/auth(.*)` from protection.

`lib/supabase.ts:14-40` contains four separate placeholder-detector functions, and `isSupabaseConfigured` is re-implemented in four more places (`middleware.ts:40-52`, `admin-auth.ts:166-176`, `leads/actions.ts:15-26`, `login/actions.ts:23-33`). The auth path forks on `isClerkConfigured()` and on **string-sniffing env vars** (`!key.includes("YOUR_")`, `!url.includes("xxxxxxxx")`), producing four different runtime behaviours. Every branch that isn't the happy path is a latent authorization hole — which is exactly where P0-2, P0-3 and P0-4 live.

**Fix** — pick one. Both are configured, so keep **Clerk for identity** (the UI is built around it) and use **Supabase strictly as a database** via the service-role key:

- delete the Supabase magic-link path in `app/admin/login/actions.ts`, `app/auth/callback/route.ts` and the dead `/admin/auth` copy
- delete the Supabase branch of `middleware.ts` and `verifyAdminAccess()`
- drop `@supabase/ssr` cookie handling (`lib/supabase/server.ts`/`client.ts`)
- stop sniffing env vars — one validated `lib/config.ts` that reads every var once with Zod, throws on missing values in production, and is the only place `process.env` is touched

This single refactor collapses P0-2, P0-3, P0-4, the rate-limit/revalidation inconsistencies, the four `isSupabaseConfigured` copies, and the `supabaseAdmin → anon` fallback.

---

## 7. P2 — Cleanup

- **Dead route duplicates.** `app/services/{chatbots,dashboards,agents}/page.tsx` shadow `app/services/[slug]/page.tsx` (static beats dynamic), so the dynamic page's `generateStaticParams` is wasted and three ~200-line near-copies must stay in sync — they already diverge (`agents:113` "30-Day SLA" vs `[slug]:132` "14-day warranty").
- **307 KB of unused assets:** `public/logo.png` (307 KB), `logo.svg`, `logo-icon.svg` — zero references; the brand mark is inline SVG (`components/ui/logo.tsx:25-111`). There are no `<img>` or `next/image` usages, so no missing-alt problem exists — just dead weight.
- **Two divergent OG templates** for the same 1200×630 image: `app/api/og/route.tsx:183-188` ("5-Day Delivery • 100% Fixed Price") vs `app/opengraph-image.tsx:149-153` ("12+ Projects Shipped • 5-Day Delivery"). Satori markup is duplicated a third time in `app/icon.tsx`.
- **`prefers-reduced-motion` only covers CSS** (`app/globals.css:324-333`); framer-motion animations still run (`hero.tsx:58-98`, `how-it-works.tsx:67-78`, `faq.tsx:78-94`). Add `<MotionConfig reducedMotion="user">` in `app/layout.tsx`.
- **Scroll-linked low contrast:** `how-it-works.tsx:86` renders all four steps at `opacity: 0.3` (`text-zinc-400`, `:102`) until scroll progress.
- **Heading order:** `app/contact/page.tsx:166` h1 → `:274` h3 (no h2); the FAQ accordion button has no `aria-controls`/panel `id` and no wrapping heading (`faq.tsx:68-85`).
- **Admin/auth chrome in the public nav** (`nav.tsx:88-120`, `footer.tsx:19,129`) competes with your single conversion CTA, and the hero's primary CTA is "See pricing" rather than "Book a call" (`hero.tsx:171-183`).
- **`sitemap.ts:6`** stamps build time as `lastModified` for every URL, which teaches Google your dates are meaningless.
- **`.mono-label` hardcodes JetBrains Mono** (`globals.css:180`) instead of the self-hosted GeistMono (`layout.tsx:23-28`, `tailwind.config.ts:59`).
- **`metadata.icons` (`layout.tsx:111`)** suppresses the generated `app/icon.tsx` PNG and there is no apple-touch-icon. Per-page `openGraph` blocks (`about:17`, `pricing:18`, …) replace the layout's and drop `siteName`/`locale`/`type`. The root `alternates.canonical` (`layout.tsx:66`) is inherited by any page omitting `alternates` — canonicalising `not-found.tsx` to the homepage.
- **No `useTransition`/`isPending` in any of the 12 admin components.** Every save is a blocking round-trip, and the optimistic updates in `leads-table.tsx:110-119` have no rollback on failure.
- **21 swallowed `catch {}` blocks** in `components/admin/` (e.g. `chat-thread.tsx:97` discards entirely). At minimum log them.
- **`uploadProjectImage`** (`app/admin/portfolio/actions.ts:215`) writes to Storage with no auth check (P0-3), no MIME validation and no size cap. Fix the auth, then validate.
- **`shadcn@4.21.4` is a CLI in `dependencies`** — move to devDependencies. `@opennextjs/cloudflare` is a devDependency but the default `build` requires it, so `npm ci --omit=dev` breaks the build. `@img/sharp-wasm32@0.35.5` is extraneous. Repo is 1.6 GB, of which `.next` is 720 MB (682 MB is `.next/cache`) and `node_modules` 925 MB.
- **`app/api/og/route.tsx` is unauthenticated and unbounded** — it renders an image per request with caller-supplied `title`/`subtitle`. Cap input length and cache aggressively.

---

## 8. Fix order

**Today, before anything else**
1. **Register `neuralwaves.in`** (and `.ae`/`.com`). Nothing else matters if a squatter takes your brand.
2. Apply the **P0-1** RLS migration, then re-run the curl and confirm it returns `[]`. Your visitors' PII is the highest-value thing you currently expose.
3. Apply **P0-2** (cookie bypass) — one header currently defeats admin auth in production.
4. Apply **P0-6** and **P0-5** (cron and webhook guards).

**This week — make the panel safe, then fix what customers see**
5. **P0-3**: `requireAdmin()` in all 24 mutations, drop the `NODE_ENV` fail-open, enforce `ADMIN_EMAILS` in middleware, disable Clerk self-signup.
6. **P0-4**: rewrite `verifyAdminAccess()` to consider verified emails only; remove hardcoded admin emails from the repo.
7. **F-3** (the three 404 homepage links) and **F-2** (the price contradiction). These are the two cheapest, highest-impact commercial fixes in the repo.
8. **F-5**: stop reporting success on failure; stop serving fabricated leads as real.

**Next — make it honest and make it work**
9. **F-1**: decide whether WhatsApp outbound is in scope. If yes, build it; if no, remove the claim from the README and pricing page.
10. **F-4 + F-6**: revalidation coverage, and move the cron to a Cloudflare trigger.
11. Publish the three testimonials you already have; wire `?tier=`; fix the unverifiable trust claims.
12. **P0-7**: upgrade Next off 14.2.35 and delete `--dangerouslyUseUnsupportedNextVersion`.

**Then — harden and launch**
13. Arabic hreflang (build `/ar` or delete it), `lib/config.ts`, rate limiting + Turnstile, `/privacy` and `/terms`, security headers, form/dialog accessibility.
14. §6: collapse the two auth stacks into one. Do this before the codebase grows — it is the source of most of the P0s above.
15. §5 schema hygiene, §7 cleanup, and CI.

**Security headers to add to `next.config.mjs` while you're there:**

```js
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];
const nextConfig = {
  poweredByHeader: false,
  async headers() { return [{ source: "/(.*)", headers: securityHeaders }]; },
};
```

A CSP needs Clerk and Supabase origins allow-listed — add it once those are stable.

---

## 9. Summary

| Priority | Count | Theme |
|---|---|---|
| **P0** | 7 | Public PII exposure · cookie auth bypass · 22 unguarded mutations · verification-gate bypass · forged webhooks · open cron · EOL Next.js |
| **P0/P1 functional** | 7 | WhatsApp can't reply · **chat quotes wrong prices** · 3 homepage 404s · admin edits don't land · false success + fake data · dead cron · Cloudflare/Vercel split |
| **P1** | ~30 | Conversion, trust claims, accessibility, SEO, legal, security headers, schema hygiene |
| **P2** | ~15 | Dead code, deps, asset weight, polish, CI |

**What's genuinely good, and worth protecting:** `tsc --noEmit` is clean; the build succeeds with 43 routes; DDL is idempotent; RLS is *enabled* on all 14 tables and works correctly on 12 of them; there are FK cascades, a `set_updated_at` pattern, LocalBusiness/Service/Breadcrumb JSON-LD, one `h1` per page, a working skip link, `next/font` with `display: swap`, delete confirmations everywhere, `loading.tsx` on every admin route, a root `error.tsx`, and no secret has ever been committed to git (verified across all history). The foundation is real.

Almost every P0 traces back to just two omissions: **one authorization model, applied everywhere**, and **one source of truth per config value**. Fix those two things and this becomes a genuinely solid product.

**Start here:** register the domain, then run the P0-1 curl. If it prints your visitors' names and phone numbers, the priority order will be obvious.
