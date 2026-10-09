# NeuralWaves — AI that ships.

> Fast, fixed-price AI & automation for UAE SMEs. Delivered in days, not months.  
> **Location:** Dubai, United Arab Emirates  
> **Production Site:** [https://NeuralWaves.in](https://NeuralWaves.in)

---

## Overview

NeuralWaves is a specialized AI automation studio based in Dubai, UAE. We engineer production-grade systems across three primary disciplines:
1. **AI Chatbots & WhatsApp Automation**: Verified Meta WhatsApp Cloud API bots with bilingual (Arabic & English) natural language understanding, instant calendar booking, and live agent escalation.
2. **Web & Admin Dashboards**: High-speed, secure internal operations portals and client consoles built with Next.js, Supabase, and Tailwind CSS.
3. **AI Agents for Business**: Deterministic background workers for commercial tender scraping, document parsing (OCR), and automated executive briefing digests.

---

## Tech Stack & Architecture

- **Frontend & Routing**: [Next.js 14](https://nextjs.org) (App Router, Server Actions, Edge Runtime OG image generator)
- **Styling & System**: [Tailwind CSS](https://tailwindcss.com), Custom Signal Design System (`#07070A`, `#8B5CF6`, `#22D3EE`), `@vercel/font` Inter + Geist Mono
- **Motion & Interaction**: [Framer Motion](https://www.framer.com/motion) with global `prefers-reduced-motion` compliance
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL 15, Row Level Security, Magic Link Auth, Real-time)
- **Email Ingestion**: [Resend](https://resend.com)
- **WhatsApp**: Official Meta WhatsApp Business Cloud API (`/api/whatsapp/webhook`)
- **Hosting & Analytics**: [Vercel](https://vercel.com) with Edge Network, Speed Insights, and Analytics

---

## Project Structure

```text
├── app/
│   ├── (dashboard)/            # Protected admin route group
│   │   ├── admin/              # Executive overview dashboard
│   │   └── admin/leads/        # Interactive pipeline data table & drawer
│   ├── admin/login/            # Magic link & demo login portal
│   ├── api/
│   │   ├── cron/lead-digest/   # Weekly lead digest cron handler
│   │   ├── og/                 # Dynamic Edge OpenGraph image generator
│   │   └── whatsapp/webhook/   # Meta WhatsApp Cloud API verification & intake
│   ├── services/               # Services overview & deep dives
│   │   ├── chatbots/           # AI Chatbots service page
│   │   ├── dashboards/         # Web Dashboards service page
│   │   └── agents/             # AI Agents service page
│   ├── work/                   # Portfolio grid
│   │   └── [slug]/             # Dynamic client case study pages
│   ├── pricing/                # Fixed pricing tiers & comparison matrix
│   ├── about/                  # Studio ethos & UAE presence
│   ├── contact/                # Scoping form & Cal.com embed toggle
│   ├── sitemap.ts              # Dynamic XML sitemap generator
│   ├── robots.ts               # Robots.txt configuration
│   └── opengraph-image.tsx     # Root Edge dynamic social preview
├── components/
│   ├── admin/                  # Admin layout shell, tables, drawers
│   ├── layout/                 # Nav, footer, progress bar
│   ├── sections/               # Homepage hero, marquee, bento, FAQ
│   ├── seo/                    # JSON-LD schemas (LocalBusiness, Service, Breadcrumb)
│   └── ui/                     # Primitives (buttons, modals, tooltips)
├── lib/
│   ├── data/site-data.ts       # Typed services, projects, pricing data
│   └── supabase/               # Client, server, and admin Supabase instances
└── supabase/
    └── schema.sql              # Complete idempotent DDL, RLS, and seed data
```

---

## Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/neuralwaves.git
cd neuralwaves
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase, Resend, and Meta Cloud API credentials.

### 3. Initialize the Database
Open your Supabase project SQL Editor, copy [`supabase/schema.sql`](./supabase/schema.sql), and run the script to create all 12 tables, indexes, RLS policies, and seed data.

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Admin Panel Access

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
2. For local evaluation without configured Supabase credentials, click **1-Click Demo Login** to explore the pre-seeded pipeline.
3. For production access with Supabase Auth:
   - Request a magic link to your email.
   - Run the promotion query in Supabase SQL Editor:
     ```sql
     INSERT INTO public.admins (email, role)
     VALUES ('admin@example.com', 'superadmin')
     ON CONFLICT (email) DO UPDATE SET role = 'superadmin';
     ```

---

## Deployment to Vercel

Follow the complete step-by-step checklist documented in [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md).

```bash
npm run build
```
Verify that all 23 static and dynamic routes compile with zero errors.

---

## License

Proprietary © 2026 NeuralWaves AI Studio. All rights reserved.
