-- ═══════════════════════════════════════════════════════════════════════════
-- NEURALWAVES SUPABASE DATABASE SCHEMA & SEED SCRIPT
-- Fast, Fixed-Price AI & Automation Studio (Dubai, UAE)
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ───────────────────────────────────────────────────────────────────────────
-- 1. TABLES
-- ───────────────────────────────────────────────────────────────────────────

-- Admins Table (Maps Supabase auth.users to platform administrators)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'superadmin',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Leads Table (Inbound website & contact form submissions)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    -- Nullable: WhatsApp enquiries arrive with a phone number and no email.
    email TEXT,
    phone TEXT NOT NULL,
    company TEXT,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL
        CONSTRAINT leads_status_check
        CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost', 'archived')),
    source TEXT DEFAULT 'website_contact' NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Services Table (Core offerings: Chatbots, Dashboards, Agents)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb NOT NULL,
    pricing TEXT,
    delivery_days TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Projects Table (Portfolio case studies and demo systems)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    client TEXT,
    sector TEXT NOT NULL,
    tag TEXT NOT NULL,
    result_metric TEXT NOT NULL,
    overview TEXT,
    problem TEXT,
    solution TEXT,
    tech_stack JSONB DEFAULT '[]'::jsonb NOT NULL,
    image_url TEXT,
    url_preview TEXT,
    is_demo BOOLEAN DEFAULT false NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pricing Tiers Table (Transparent fixed pricing tiers in AED)
CREATE TABLE IF NOT EXISTS public.pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    price TEXT NOT NULL,
    price_numeric NUMERIC,
    description TEXT,
    delivery_timeframe TEXT,
    features JSONB DEFAULT '[]'::jsonb NOT NULL,
    cta_label TEXT DEFAULT 'Get started' NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Testimonials Table (Client quotes and feedback)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_role TEXT,
    company TEXT,
    content TEXT NOT NULL,
    avatar_url TEXT,
    rating INT DEFAULT 5 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- FAQs Table (Common questions and answers)
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general' NOT NULL, -- 'general', 'pricing', 'technical'
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site Settings Table (Global dynamic config: WhatsApp, email, links)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contacts Table (WhatsApp & messaging leads/identities)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wa_id TEXT NOT NULL UNIQUE, -- E.164 phone string without plus or Meta WA ID
    name TEXT,
    phone TEXT,
    profile_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Conversations Table (Chat threads for WhatsApp & Web bots)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'pending_human', 'closed'
    channel TEXT DEFAULT 'whatsapp' NOT NULL,
    last_message_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages Table (Individual chat messages in a conversation)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL
        CONSTRAINT messages_sender_type_check
        CHECK (sender_type IN ('user', 'bot', 'agent')),
    content TEXT NOT NULL,
    raw_payload JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu Items Table (WhatsApp interactive menu tree & button choices)
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    parent TEXT, -- Null for root/main menu, or parent key string
    title TEXT NOT NULL,
    payload TEXT,
    response_text TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ───────────────────────────────────────────────────────────────────────────
-- 2. INDEXES
-- ───────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published_order ON public.projects(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON public.leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_convo_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_contact ON public.conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_contacts_wa_id ON public.contacts(wa_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_active_order ON public.menu_items(parent, is_active, sort_order);

-- ───────────────────────────────────────────────────────────────────────────
-- 3. HELPER FUNCTIONS & TRIGGERS
-- ───────────────────────────────────────────────────────────────────────────

-- Helper function to check if the executing user is in the admins table.
-- search_path is pinned because this is SECURITY DEFINER.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
       OR (email IS NOT NULL AND lower(email) = lower(auth.jwt() ->> 'email'))
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_contacts_updated_at ON public.contacts;
CREATE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes for hot query paths
-- (the existing idx_leads_status_created leads with `status`, so it cannot serve
--  the weekly-digest filter on created_at alone)
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(lower(email));
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);

-- ───────────────────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ───────────────────────────────────────────────────────────────────────────

-- Enable RLS on every table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- 4.1 Admins Table
DROP POLICY IF EXISTS "Admins can view admins list" ON public.admins;
CREATE POLICY "Admins can view admins list" ON public.admins
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;
CREATE POLICY "Admins can manage admins" ON public.admins
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.2 Leads Table
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to leads" ON public.leads;
CREATE POLICY "Admins have full access to leads" ON public.leads
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.3 Services Table
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
CREATE POLICY "Admins have full access to services" ON public.services
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.4 Projects Table
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "Admins have full access to projects" ON public.projects;
CREATE POLICY "Admins have full access to projects" ON public.projects
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.5 Pricing Tiers Table
DROP POLICY IF EXISTS "Public can view pricing tiers" ON public.pricing_tiers;
CREATE POLICY "Public can view pricing tiers" ON public.pricing_tiers
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins have full access to pricing tiers" ON public.pricing_tiers;
CREATE POLICY "Admins have full access to pricing tiers" ON public.pricing_tiers
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.6 Testimonials Table
DROP POLICY IF EXISTS "Public can view active testimonials" ON public.testimonials;
CREATE POLICY "Public can view active testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Admins have full access to testimonials" ON public.testimonials;
CREATE POLICY "Admins have full access to testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.7 FAQs Table
DROP POLICY IF EXISTS "Public can view active faqs" ON public.faqs;
CREATE POLICY "Public can view active faqs" ON public.faqs
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Admins have full access to faqs" ON public.faqs;
CREATE POLICY "Admins have full access to faqs" ON public.faqs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.8 Site Settings Table
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins have full access to site settings" ON public.site_settings;
CREATE POLICY "Admins have full access to site settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.9 Contacts Table
DROP POLICY IF EXISTS "Admins have full access to contacts" ON public.contacts;
CREATE POLICY "Admins have full access to contacts" ON public.contacts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.10 Conversations Table
DROP POLICY IF EXISTS "Admins have full access to conversations" ON public.conversations;
CREATE POLICY "Admins have full access to conversations" ON public.conversations
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.11 Messages Table
DROP POLICY IF EXISTS "Admins have full access to messages" ON public.messages;
CREATE POLICY "Admins have full access to messages" ON public.messages
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4.12 Menu Items Table
DROP POLICY IF EXISTS "Public can view active menu items" ON public.menu_items;
CREATE POLICY "Public can view active menu items" ON public.menu_items
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Admins have full access to menu items" ON public.menu_items;
CREATE POLICY "Admins have full access to menu items" ON public.menu_items
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ───────────────────────────────────────────────────────────────────────────
-- 5. SEED DATA
-- ───────────────────────────────────────────────────────────────────────────

-- 5.1 Services (3 core offerings)
INSERT INTO public.services (slug, title, tagline, description, features, pricing, delivery_days, sort_order)
VALUES
(
  'chatbots',
  'AI Chatbots & WhatsApp Automation',
  'Menu bots, AI replies, and human handoff — on the app your customers already use.',
  'Customer support and sales that never sleep. Custom WhatsApp and web assistants connected directly to your catalog, booking calendar, and CRM.',
  '[
    "Official Meta WhatsApp Cloud API verification",
    "Dual language support (English & Modern Standard Arabic)",
    "Natural language AI replies powered by OpenAI/Claude",
    "Seamless escalation & live human agent takeover",
    "Lead qualification & instant calendar booking",
    "Real-time CRM and Google Sheets data synchronization"
  ]'::jsonb,
  'From AED 1,500',
  '3–5 days',
  1
),
(
  'dashboards',
  'Web & Admin Dashboards',
  'Custom dashboards for the operations you''re running on spreadsheets.',
  'Clean, secure Next.js web applications and client portals designed for rapid operational management, replacing messy spreadsheet workflows.',
  '[
    "Tailored React/Next.js interface with dark mode default",
    "Role-based access control (Admin, Manager, Viewer)",
    "Instant full-text search, filtering & CSV/PDF exports",
    "Real-time Postgres database integration",
    "Custom metric calculations and KPI visualizations",
    "Fully mobile-responsive layout for field teams"
  ]'::jsonb,
  'From AED 2,500',
  '5–7 days',
  2
),
(
  'agents',
  'AI Agents for Business',
  'Lead gen, scraping, reporting. Agents that work while you sleep.',
  'Autonomous background workers engineered to handle multi-step business operations: lead scraping, document parsing, and daily executive briefings.',
  '[
    "Automated web scraping & competitor pricing bots",
    "Intelligent document parsing (PDF invoices, receipts, trade licenses)",
    "Multi-step lead enrichment & LinkedIn/CRM syncing",
    "Scheduled morning briefing reports sent via WhatsApp/Email",
    "Resilient queueing with automatic failure retries",
    "Custom webhooks connecting all your third-party SaaS apps"
  ]'::jsonb,
  'From AED 7,500',
  '7–10 days',
  3
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  pricing = EXCLUDED.pricing,
  delivery_days = EXCLUDED.delivery_days,
  sort_order = EXCLUDED.sort_order;

-- 5.2 Pricing Tiers (4 tiers)
INSERT INTO public.pricing_tiers (name, price, price_numeric, description, delivery_timeframe, features, is_featured, sort_order)
VALUES
(
  'Starter',
  '1,500',
  1500,
  'Essential automation for single workflows or support bots.',
  '3–5 working days',
  '[
    "Custom WhatsApp or Web chat assistant",
    "Menu-driven navigation & static FAQ responses",
    "Lead collection to Google Sheets & Email alerts",
    "Standard Meta Cloud API setup & verification",
    "1 revision round included",
    "14-day post-launch warranty"
  ]'::jsonb,
  false,
  1
),
(
  'Growth',
  '3,500',
  3500,
  'Full AI conversational assistant integrated into your CRM.',
  '5–7 working days',
  '[
    "Natural language AI replies (OpenAI / Claude)",
    "Arabic (Gulf & MSA) + English bilingual support",
    "HubSpot, Zoho, or Supabase CRM real-time sync",
    "Automated appointment booking & calendar sync",
    "Human agent takeover console",
    "30-day post-launch warranty & 2 revision rounds"
  ]'::jsonb,
  true,
  2
),
(
  'Business',
  '7,500',
  7500,
  'Complete end-to-end bespoke system with custom dashboard.',
  '7–10 working days',
  '[
    "Custom Next.js Web App & Admin Dashboard",
    "Role-based team authentication & permissioning",
    "Autonomous daily reporting & data scraping agents",
    "Full API integrations & webhook automation",
    "Dedicated developer Slack/WhatsApp channel",
    "30-day post-launch warranty with priority support"
  ]'::jsonb,
  false,
  3
),
(
  'Custom',
  '15,000',
  15000,
  'Enterprise-grade AI infrastructure for multi-department operations.',
  '10–15 working days',
  '[
    "Multi-agent autonomous workflow orchestration",
    "Custom fine-tuned models & internal knowledge base (RAG)",
    "ERP / SAP / Legacy database deep integration",
    "On-premise or UAE sovereign cloud data residency",
    "Dedicated engineering sprint team",
    "Ongoing SLA with guaranteed 1-hour response times"
  ]'::jsonb,
  false,
  4
)
ON CONFLICT (name) DO UPDATE SET
  price = EXCLUDED.price,
  price_numeric = EXCLUDED.price_numeric,
  description = EXCLUDED.description,
  delivery_timeframe = EXCLUDED.delivery_timeframe,
  features = EXCLUDED.features,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;

-- 5.3 Projects (4 rows: 2 real, 2 demo)
INSERT INTO public.projects (slug, title, client, sector, tag, result_metric, overview, problem, solution, tech_stack, is_demo, is_featured, is_published, sort_order)
VALUES
(
  'dubai-real-estate-whatsapp-bot',
  'Dubai Real Estate WhatsApp Lead Bot',
  'Elysian Luxury Properties',
  'Real Estate',
  'AI Chatbot',
  'Response time: 4 hours → 30 seconds',
  'Autonomous WhatsApp assistant qualifying ultra-luxury villa inquiries in Palm Jumeirah and Emirates Hills around the clock.',
  'Brokers were losing high-intent international and GCC buyers due to delayed replies outside Dubai business hours. Weekend leads went cold within hours.',
  'Engineered an official Meta Cloud API assistant that prompts prospective buyers for budget, preferred communities, and timeline, then serves matching brochures and books viewing appointments directly on the agent calendar.',
  '["Next.js", "Meta WhatsApp Cloud API", "OpenAI GPT-4o", "Supabase", "Cal.com"]'::jsonb,
  false,
  true,
  true,
  1
),
(
  'restaurant-ordering-dashboard',
  'Restaurant Fleet & Order Management Dashboard',
  'Bait Al Karam Hospitality Group',
  'F&B',
  'Admin Dashboard',
  '3 hrs/day saved on order management',
  'Centralized operational command portal dispatching live kitchen orders across 4 cloud kitchen hubs in Dubai and Sharjah.',
  'Franchise managers were juggling separate tablets for Talabat, Deliveroo, and phone orders on messy Excel sheets, resulting in delayed prep times and duplicate orders.',
  'Built a unified Next.js real-time admin portal syncing all incoming delivery streams into an intuitive kitchen display system (KDS) with live courier route tracking.',
  '["Next.js 14", "React", "PostgreSQL", "Tailwind CSS", "WebSockets"]'::jsonb,
  false,
  true,
  true,
  2
),
(
  'abu-dhabi-logistics-lead-agent',
  'Abu Dhabi Logistics Lead-Gen Agent',
  'Gulf Horizon Freight (Demo)',
  'Logistics',
  'AI Agent',
  '40 qualified leads/week',
  'Autonomous market scraping agent discovering industrial import/export cargo bids and qualifying logistics decision-makers in Khalifa Industrial Zone (KEZAD).',
  'Freight forwarders relied on manual cold calls and trade directory searches, spending 25+ hours weekly researching trade license databases with negligible conversion.',
  'Deployed an autonomous background agent that scrapes public commercial tenders, verifies company shipping volumes, enriches contact details via LinkedIn, and queues personalized introduction emails.',
  '["Python", "FastAPI", "Playwright", "Claude 3.5 Sonnet", "HubSpot API"]'::jsonb,
  true,
  false,
  true,
  3
),
(
  'dubai-clinic-appointment-bot',
  'Dubai Clinic Appointment & Follow-Up Bot',
  'Aura Wellness Clinics (Demo)',
  'Healthcare',
  'AI Chatbot',
  '60% fewer no-shows',
  'Bilingual WhatsApp concierge handling specialist doctor bookings, insurance inquiries, and automatic appointment reminders.',
  'High patient cancellation rates and receptionist phone congestion during peak morning clinic hours resulted in empty doctor consultation slots.',
  'Built an automated WhatsApp bot that confirms booking times, verifies Emirates ID/insurance card photos via OCR, and sends interactive confirmation buttons 24 hours prior.',
  '["Next.js", "WhatsApp Cloud API", "Vision OCR", "Supabase", "Twilio"]'::jsonb,
  true,
  false,
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  sector = EXCLUDED.sector,
  tag = EXCLUDED.tag,
  result_metric = EXCLUDED.result_metric,
  overview = EXCLUDED.overview,
  problem = EXCLUDED.problem,
  solution = EXCLUDED.solution,
  tech_stack = EXCLUDED.tech_stack,
  is_demo = EXCLUDED.is_demo,
  is_featured = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order;

-- 5.4 Testimonials (3 rows)
-- Idempotent: only seeds when the table is empty, so re-running schema.sql does
-- not append duplicate rows (the previous version had no unique key and no
-- ON CONFLICT clause).
INSERT INTO public.testimonials (client_name, client_role, company, content, rating, is_active, sort_order)
SELECT * FROM (VALUES
(
  'Tariq Mansour',
  'Managing Director',
  'Gulf Skyline Real Estate, Dubai',
  'NeuralWaves delivered our WhatsApp concierge in exactly 5 days. We captured 34 qualified property viewings in our first weekend without our brokers working overtime. Best agency investment we made this year.',
  5,
  true,
  1
),
(
  'Farah Al Hashimi',
  'Head of Operations',
  'Karak Express Hospitality, Abu Dhabi',
  'Replacing our branch reporting spreadsheets with NeuralWaves''s custom admin portal saved our ops managers 15 hours every single week. Fast, direct, zero corporate nonsense.',
  5,
  true,
  2
),
(
  'Vikram Mehta',
  'Founder & CEO',
  'Apex Courier & Freight, Dubai',
  'Traditional agencies in Dubai quoted us 3 months and AED 60,000 for what NeuralWaves built in 7 business days for a fixed fee. The system is rock solid and handles all our client inquiries.',
  5,
  true,
  3
)
) AS v(client_name, client_role, company, content, rating, is_active, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials);

-- 5.5 FAQs (8 rows: 6 general + 2 pricing-specific)
-- Idempotent: only seeds when the table is empty.
INSERT INTO public.faqs (question, answer, category, sort_order, is_active)
SELECT * FROM (VALUES
(
  'How fast can you deliver?',
  'Most projects are delivered in 5 working days. Complex builds with custom CRM or ERP integrations take 7 to 10 days. We lock the exact delivery date on our discovery call.',
  'general',
  1,
  true
),
(
  'What does 50% upfront mean?',
  'You pay 50% deposit to initiate the sprint and secure dedicated engineering time. The remaining 50% is only billed once the build is deployed, tested, and approved by your team.',
  'pricing',
  2,
  true
),
(
  'Do you support Arabic?',
  'Yes. All our AI models, chatbots, and dashboards natively support Modern Standard Arabic (MSA) as well as Gulf dialects and English with auto-detection.',
  'general',
  3,
  true
),
(
  'What if I need changes after launch?',
  'Every build includes a 14 to 30-day post-launch warranty with instant fixes and revisions. For ongoing changes or feature additions, we offer flexible month-to-month retainers.',
  'general',
  4,
  true
),
(
  'Do you work with WordPress sites?',
  'Yes. We embed custom AI chatbots, lead capture flows, and dashboards seamlessly into WordPress, Webflow, Shopify, or custom Next.js websites via clean script tags or APIs.',
  'general',
  5,
  true
),
(
  'Who pays WhatsApp/Meta charges?',
  'You pay Meta directly via your own Meta Business Manager at cost (typically a few fils per conversation). We configure and connect your WhatsApp Business Cloud API with zero markup.',
  'pricing',
  6,
  true
),
(
  'Who owns the code and data?',
  'You do, 100%. Upon final project handover, all Git repositories, API credentials, and cloud deployment accounts are transferred directly to your organization.',
  'general',
  7,
  true
),
(
  'Do you work with businesses outside Dubai?',
  'Yes. We build for teams across the entire UAE — Abu Dhabi, Sharjah, Ajman, RAK — as well as remotely for clients across Saudi Arabia and the GCC.',
  'general',
  8,
  true
)
) AS v(question, answer, category, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.faqs);

-- 5.6 Site Settings (6 global rows)
INSERT INTO public.site_settings (key, value, description)
VALUES
('whatsapp_number', '+918840936715', 'Primary WhatsApp contact number in E.164 format'),
('contact_email', 'zaminaskari.work@gmail.com', 'Official contact & inbound lead notification email'),
('contact_phone', '+91-8840936715', 'Official contact phone line'),
('calendar_url', 'https://cal.com/neuralwaves/15min', 'Cal.com or Calendly scope booking link'),
('social_linkedin', 'https://linkedin.com/company/neuralwaves', 'Company LinkedIn page'),
('social_instagram', 'https://instagram.com/neuralwaves.in', 'Company Instagram handle')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;

-- 5.7 Menu Items (8 rows: 4 main + 4 submenu)
-- Idempotent: only seeds when the table is empty. The previous version used
-- `ON CONFLICT (id) DO NOTHING` but never supplied `id`, so the conflict target
-- could never match and every re-run appended all 8 rows again.
INSERT INTO public.menu_items (key, parent, title, payload, response_text, sort_order, is_active)
SELECT * FROM (VALUES
-- Main root menu
('main_services', NULL, '1. Our Services', 'MENU_SERVICES', 'Here are our three core offerings:\n1. AI Chatbots & WhatsApp\n2. Web & Admin Dashboards\n3. AI Agents for Business\n\nReply with a number or 9 to go back.', 1, true),
('main_projects', NULL, '2. Recent Projects', 'MENU_PROJECTS', 'Recent NeuralWaves builds:\n• Dubai Real Estate WhatsApp Bot (30s response time)\n• F&B Kitchen Dispatch Dashboard (3 hrs/day saved)\n• Abu Dhabi Logistics Lead Agent (40 leads/wk)\n\nVisit neuralwaves.in/work to see all case studies.', 2, true),
('main_pricing', NULL, '3. Transparent Pricing', 'MENU_PRICING', 'Fixed pricing in AED:\n• Starter Bot: AED 1,500 (3-5 days)\n• Growth AI Assistant: AED 3,500 (5-7 days)\n• Business Platform: AED 7,500 (7-10 days)\n\nAll include 50% upfront and post-launch warranty.', 3, true),
('main_human', NULL, '4. Talk to a Human', 'TALK_HUMAN', 'An engineer will take over this chat shortly. You can also book a 15-min call at neuralwaves.in/contact.', 4, true),

-- Services submenu
('srv_chatbots', 'main_services', 'AI Chatbots & WhatsApp', 'INFO_CHATBOTS', 'Custom 24/7 WhatsApp assistants trained on your company data. Handles bookings, lead capture, and FAQs in Arabic & English. Delivered in 3-5 days from AED 1,500.', 1, true),
('srv_dashboards', 'main_services', 'Web & Admin Dashboards', 'INFO_DASHBOARDS', 'Custom Next.js admin portals replacing messy spreadsheets with real-time permissions, filters, and reports. Delivered in 5-7 days from AED 2,500.', 2, true),
('srv_agents', 'main_services', 'AI Agents for Business', 'INFO_AGENTS', 'Autonomous workers executing lead scraping, document parsing, and daily reporting while you sleep. Delivered in 7-10 days from AED 7,500.', 3, true),
('srv_back', 'main_services', '9. Back to Main Menu', 'NAV_BACK', 'Main Menu:\n1. Services\n2. Projects\n3. Pricing\n4. Talk to Human\n\nReply with a number.', 9, true)
) AS v("key", parent, title, payload, response_text, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.menu_items);

-- ═══════════════════════════════════════════════════════════════════════════
-- ADMIN PROMOTION INSTRUCTION
-- ═══════════════════════════════════════════════════════════════════════════
-- To promote an admin by email, replace the placeholder below with a real
-- address and run just this statement. Real administrator addresses must NOT be
-- committed to the repository — they belong in ADMIN_EMAILS and in this table.
--
--   INSERT INTO public.admins (email, role)
--   VALUES ('admin@example.com', 'superadmin')
--   ON CONFLICT (email) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 12: WEBSITE CHAT SYSTEM (chat_sessions + chat_messages)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'bot'
        CONSTRAINT chat_sessions_status_check
        CHECK (status IN ('bot', 'human', 'resolved')),
    visitor_name TEXT,
    visitor_email TEXT,
    visitor_phone TEXT,
    visitor_company TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    unread_admin_count INT DEFAULT 0,
    unread_visitor_count INT DEFAULT 0,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor_id ON public.chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON public.chat_sessions(last_message_at DESC);
-- Serves the admin inbox query (filter by status, sort by latest message).
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status_last_message_at
    ON public.chat_sessions(status, last_message_at DESC);

-- chat_sessions.updated_at previously had no trigger, so application code had to
-- poke the column by hand and it drifted.
DROP TRIGGER IF EXISTS trg_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER trg_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL
        CONSTRAINT chat_messages_sender_check
        CHECK (sender IN ('visitor', 'bot', 'admin')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id_created_at ON public.chat_messages(session_id, created_at ASC);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- SECURITY: visitor chat data must never be reachable with the public anon key.
-- These tables hold visitor_name / visitor_email / visitor_phone and full transcripts.
-- All visitor traffic is proxied server-side by app/api/chat/*, which uses the
-- service-role key (lib/chat-store.ts -> supabaseAdmin) and therefore bypasses RLS.
-- Do NOT reintroduce an anon policy for either table.
DROP POLICY IF EXISTS "Public can view chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can insert chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can update chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can view chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Public can insert chat messages" ON public.chat_messages;

DROP POLICY IF EXISTS "Admins have full access to chat_sessions" ON public.chat_sessions;
CREATE POLICY "Admins have full access to chat_sessions" ON public.chat_sessions
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to chat_messages" ON public.chat_messages;
CREATE POLICY "Admins have full access to chat_messages" ON public.chat_messages
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

