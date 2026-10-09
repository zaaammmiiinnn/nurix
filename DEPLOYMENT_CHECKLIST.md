# Production Deployment Guide & Checklist — NEURALWAVES

> **Target Domain:** [https://NeuralWaves.in](https://NeuralWaves.in)  
> **Tech Stack:** Next.js 14 (App Router), Supabase (PostgreSQL + Auth + RLS), Vercel, Resend, Meta WhatsApp Cloud API.

---

## 1. Vercel Environment Variables Reference

Add the following environment variables to your Vercel Project under **Settings → Environment Variables** (select **Production**, **Preview**, and **Development**):

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` | Clerk Publishable Key (from Clerk Dashboard API Keys). |
| `CLERK_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Clerk Secret Key (Server-side API calls & JWT verification). |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/admin/login` | Redirect target for unauthenticated users. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/admin` | Post-login redirect destination for verified admins. |
| `ADMIN_EMAILS` | `admin@example.com,owner@example.com` | Whitelist of verified admin emails permitted in `/admin`. |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyzproject.supabase.co` | Supabase project API endpoint. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase public anonymous key. |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Supabase elevated admin key (kept secret, server-only). |
| `RESEND_API_KEY` | `re_abc123...` | API key from Resend for sending email notifications. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `918840936715` | Public E.164 phone number without `+` sign. |
| `WHATSAPP_TOKEN` | `EAAG...` | Meta WhatsApp Cloud API permanent system user token. |
| `PHONE_NUMBER_ID` | `102938475610293` | Meta WhatsApp Cloud API Phone Number ID. |
| `VERIFY_TOKEN` | `neuralwaves_wa_secret_verify_2026` | Custom secret string for webhook handshake verification. |
| `NEXT_PUBLIC_SITE_URL` | `https://neuralwaves.in` | Canonical production URL (used for Auth redirects and OG tags). |
| `NEXT_PUBLIC_CAL_COM_URL` | `https://cal.com/neuralwaves/15min` | Cal.com scheduling URL. |
| `ADMIN_EMAIL` | `admin@example.com` | Primary admin email for lead alerts and digests. |
| `CRON_SECRET` *(Optional)* | `cr_secret_token_...` | Protects `/api/cron/lead-digest` from unauthorized invocations. |

---

## 2. Step-by-Step Deployment Checklist

### Step 1: Create Supabase Project & Execute Schema
1. Log in to [Supabase](https://supabase.com) and click **New Project** (Region: **Frankfurt / eu-central-1** or **Middle East / me-central-1** if available).
2. Open the **SQL Editor** in the left sidebar.
3. Open [`supabase/schema.sql`](./supabase/schema.sql), copy its entire contents, paste it into the SQL editor, and click **Run**.
4. Navigate to **Project Settings → API** and copy:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role secret key** (`SUPABASE_SERVICE_ROLE_KEY`)
5. Under **Authentication → URL Configuration**, add:
   - **Site URL**: `https://neuralwaves.in`
   - **Redirect URLs**: `https://neuralwaves.in/**` and `http://localhost:3000/**`

---

### Step 2: Set Up Resend for Email Ingestion
1. Go to [Resend](https://resend.com) and click **Domains → Add Domain** (`neuralwaves.in`).
2. Add the provided DKIM and SPF TXT/MX records to your DNS provider (Cloudflare).
3. Under **API Keys**, create a new full-access key (`RESEND_API_KEY`).

---

### Step 3: Configure Meta WhatsApp Cloud API
1. Navigate to [developers.facebook.com](https://developers.facebook.com) and create or open your **Business App**.
2. Add the **WhatsApp** product.
3. Under **WhatsApp → API Setup**:
   - Copy the **Phone number ID** (`PHONE_NUMBER_ID`).
   - Create a **Permanent System User Token** under Meta Business Manager with permissions: `whatsapp_business_messaging` and `whatsapp_business_management` (`WHATSAPP_TOKEN`).
4. Decide on your `VERIFY_TOKEN` (e.g. `neuralwaves_wa_secret_verify_2026`).

---

### Step 4: Push Repository to GitHub
Ensure git is clean and committed:
```bash
git add .
git commit -m "feat: complete production readiness for NeuralWaves platform"
git branch -M main
git remote add origin https://github.com/your-org/neuralwaves.git
git push -u origin main
```

---

### Step 5: Import to Vercel & Initial Deploy
1. Open [Vercel](https://vercel.com) and select **Add New Project**.
2. Select your `neuralwaves` GitHub repository.
3. Framework Preset: **Next.js**.
4. In the **Environment Variables** section, paste all values from Section 1 above.
5. Click **Deploy**.

---

### Step 6: Configure Custom Domain & Cloudflare DNS
1. In Vercel, navigate to **Settings → Domains** and add `neuralwaves.in` and `www.neuralwaves.in`.
2. In Cloudflare DNS:
   - `A` record: `@` → `76.76.21.21` (DNS only / Proxied depending on SSL mode).
   - `CNAME` record: `www` → `cname.vercel-dns.com`.
3. Wait for Vercel to provision the SSL certificate.

---

### Step 7: Update `NEXT_PUBLIC_SITE_URL` & Redeploy
1. In Vercel, verify `NEXT_PUBLIC_SITE_URL` is set to `https://neuralwaves.in`.
2. Trigger a redeploy if the variable was updated after initial build.

---

### Step 8: Configure Meta WhatsApp Webhook
1. In the Meta App Dashboard, navigate to **WhatsApp → Configuration**.
2. Click **Edit** next to Webhook:
   - **Callback URL**: `https://neuralwaves.in/api/whatsapp/webhook`
   - **Verify token**: Value of your `VERIFY_TOKEN`
3. Click **Verify and Save**.
4. Under **Webhook fields**, click **Manage** and subscribe to:
   - `messages`
   - `message_deliveries`

---

### Step 9: Verify Webhook Verification
Test the webhook handshake using curl:
```bash
curl -i "https://neuralwaves.in/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=1158201236&hub.verify_token=neuralwaves_wa_secret_verify_2026"
```
*Expected response: HTTP 200 with raw body `1158201236`.*

---

### Step 10: Promote Your User Account to Admin
1. Go to `https://neuralwaves.in/admin/login` and sign in with your email address using magic link.
2. In the Supabase SQL Editor, run:
```sql
INSERT INTO public.admins (email, role)
VALUES ('admin@example.com', 'superadmin')
ON CONFLICT (email) DO UPDATE SET role = 'superadmin';
```
3. Refresh `https://neuralwaves.in/admin` — full access to Dashboard and Leads is unlocked.

---

### Step 11: Validate Inbound Contact Form
1. Visit `https://neuralwaves.in/contact`.
2. Fill out a test inquiry and submit.
3. Verify:
   - Instant success toast on the frontend.
   - Lead appears immediately in `public.leads` in Supabase.
   - Email alert arrives in your inbox via Resend.
   - Lead appears at `https://neuralwaves.in/admin/leads`.

---

### Step 12: Validate WhatsApp Inbound Messaging
1. Send a WhatsApp message to your verified business phone number.
2. Check Supabase table `public.messages` and `public.contacts` to confirm the webhook logged the thread.

---

### Step 13: Run Lighthouse Production Audit
1. Open Chrome DevTools in an incognito window at `https://neuralwaves.in`.
2. Run Lighthouse Audit on **Mobile** and **Desktop**.
3. Targets:
   - **Performance**: 90+
   - **Accessibility**: 95+
   - **Best Practices**: 95+
   - **SEO**: 100

---

### Step 14: Verify Vercel Cron Job
- Inspect **Vercel → Project → Settings → Cron Jobs**.
- Verify `/api/cron/lead-digest` is registered for weekly execution (`0 8 * * 1`).

---

### Step 15: Activate Vercel Analytics & Speed Insights
- In your Vercel Dashboard, enable **Analytics** and **Speed Insights** tabs to monitor Core Web Vitals (LCP, INP, CLS) in production.

---

## 3. Critical Gotchas (Next.js 14 + Supabase + Vercel)

### 1. Cookies in Server Actions & Route Handlers
- **The Issue**: Next.js 14 App Router prohibits mutating cookies in Server Components (only in Server Actions and Route Handlers).
- **Our Architecture**: Auth state reading is handled via `@supabase/ssr` cookies helper in `lib/supabase/server.ts`, ensuring middleware and server components don't throw read-only cookie errors.

### 2. Edge Runtime vs Node Runtime for OpenGraph
- **The Issue**: Node.js canvas libraries are heavy and fail on Vercel Edge.
- **Our Architecture**: Both `app/opengraph-image.tsx` and `app/api/og/route.tsx` export `export const runtime = "edge"`, rendering SVGs and HTML via `@vercel/og` with sub-50ms response times and zero cold starts.

### 3. Middleware Matcher Recursion
- **The Issue**: Matchers covering `/_next` or static files cause loops or block static asset chunk serving.
- **Our Architecture**: `middleware.ts` uses strict regex matcher `matcher: ["/admin/:path*"]`, preventing interception of static assets, images, and public routes.

### 4. Supabase RLS Recursion on `is_admin()`
- **The Issue**: Querying `admins` table from inside an RLS policy on `admins` triggers infinite SQL recursion.
- **Our Architecture**: In `supabase/schema.sql`, the `is_admin()` helper function is defined with `SECURITY DEFINER` and `SET search_path = public`, executing with owner privileges and avoiding recursion.

### 5. Client Component Metadata Exports
- **The Issue**: Next.js App Router throws a build error if a `"use client"` page attempts to export `metadata`.
- **Our Architecture**: Client interactive pages like `app/contact/page.tsx` have their `metadata` exported in `app/contact/layout.tsx`.
