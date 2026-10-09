-- ═══════════════════════════════════════════════════════════════════════════
-- Schema hardening
--
-- Addresses the data-layer findings from the audit. Everything here is written
-- to be safe to run against a database that already holds data:
--   * CHECK constraints are added NOT VALID so pre-existing bad rows do not
--     abort the migration. Validate them separately once you have cleaned up:
--       ALTER TABLE public.leads VALIDATE CONSTRAINT leads_status_check;
--   * indexes use IF NOT EXISTS;
--   * triggers are dropped and recreated.
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- 1. leads.email must be nullable
--    WhatsApp enquiries arrive with a phone number and no email address. The
--    webhook previously fabricated `<wa_id>@wa.neuralwaves.in`, an undeliverable
--    address that polluted the CRM.
-- ───────────────────────────────────────────────────────────────────────────
ALTER TABLE public.leads ALTER COLUMN email DROP NOT NULL;

-- ───────────────────────────────────────────────────────────────────────────
-- 2. Enum drift: the SQL comments documented new/contacted/qualified/closed/
--    archived while the TypeScript union used new/contacted/won/lost/archived,
--    with no constraint in either direction. Canonicalise on the union.
-- ───────────────────────────────────────────────────────────────────────────
ALTER TABLE public.leads
    DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads
    ADD CONSTRAINT leads_status_check
    CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost', 'archived'))
    NOT VALID;

ALTER TABLE public.chat_sessions
    DROP CONSTRAINT IF EXISTS chat_sessions_status_check;
ALTER TABLE public.chat_sessions
    ADD CONSTRAINT chat_sessions_status_check
    CHECK (status IN ('bot', 'human', 'resolved'))
    NOT VALID;

ALTER TABLE public.chat_messages
    DROP CONSTRAINT IF EXISTS chat_messages_sender_check;
ALTER TABLE public.chat_messages
    ADD CONSTRAINT chat_messages_sender_check
    CHECK (sender IN ('visitor', 'bot', 'admin'))
    NOT VALID;

ALTER TABLE public.messages
    DROP CONSTRAINT IF EXISTS messages_sender_type_check;
ALTER TABLE public.messages
    ADD CONSTRAINT messages_sender_type_check
    CHECK (sender_type IN ('user', 'bot', 'agent'))
    NOT VALID;

-- ───────────────────────────────────────────────────────────────────────────
-- 3. Missing updated_at triggers.
--    set_updated_at() exists but was only wired to leads and contacts, so
--    chat_sessions.updated_at drifted (application code poked it by hand).
-- ───────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER trg_chat_sessions_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────────────
-- 4. Indexes for hot query paths.
-- ───────────────────────────────────────────────────────────────────────────

-- Admin inbox sorts by last_message_at, usually filtered by status.
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status_last_message_at
    ON public.chat_sessions(status, last_message_at DESC);

-- Weekly digest filters leads by created_at. The existing
-- idx_leads_status_created leads with `status`, so it cannot serve that filter.
CREATE INDEX IF NOT EXISTS idx_leads_created_at
    ON public.leads(created_at DESC);

-- is_admin() filters the admins table on both columns.
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(lower(email));
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);

-- ───────────────────────────────────────────────────────────────────────────
-- 5. Correct already-seeded customer-facing copy.
--    The menu_items seed data (shown to real website and WhatsApp visitors)
--    referred to the internal project name "Nurix" and to "nurix.ae" — a
--    different domain from the canonical neuralwaves.in used everywhere else.
--    schema.sql is now idempotent (it only seeds an empty table), so existing
--    rows must be corrected explicitly.
-- ───────────────────────────────────────────────────────────────────────────
UPDATE public.menu_items
SET response_text = replace(replace(response_text, 'Nurix', 'NeuralWaves'), 'nurix.ae', 'neuralwaves.in')
WHERE response_text LIKE '%Nurix%' OR response_text LIKE '%nurix.ae%';

-- ───────────────────────────────────────────────────────────────────────────
-- 6. SECURITY DEFINER hardening.
--    is_admin() is SECURITY DEFINER and referenced unqualified names, which is
--    the classic search_path hijack vector. Pin it.
-- ───────────────────────────────────────────────────────────────────────────
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

-- Only authenticated callers need this helper; it is used inside RLS policies.
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
