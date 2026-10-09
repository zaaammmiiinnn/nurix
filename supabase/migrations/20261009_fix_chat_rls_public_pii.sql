-- ═══════════════════════════════════════════════════════════════════════════
-- SECURITY FIX: remove world-readable / world-writable policies on the
-- website chat tables.
--
-- WHY: chat_sessions stores visitor_name, visitor_email, visitor_phone and
-- visitor_company; chat_messages stores every message. The previous policies
-- used `USING (true)` / `WITH CHECK (true)` with no `TO` clause, so they
-- applied to PUBLIC — including the `anon` role. Because the anon/publishable
-- key is shipped to the browser (NEXT_PUBLIC_SUPABASE_ANON_KEY), anyone could:
--
--   curl "$URL/rest/v1/chat_sessions?select=visitor_name,visitor_email,visitor_phone" \
--     -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
--
-- and could rewrite every session:
--
--   curl -X PATCH "$URL/rest/v1/chat_sessions?id=eq.<uuid>" \
--     -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
--     -H "Content-Type: application/json" -d '{"status":"resolved"}'
--
-- The UPDATE policy also had no WITH CHECK, so Postgres reused `USING (true)`
-- for the post-update row, permitting arbitrary column rewrites.
--
-- AFTER APPLYING: re-run the GET above. It must return [].
--
-- NOTE: visitor chat traffic does not need an anon policy. All visitor reads and
-- writes are proxied server-side by app/api/chat/session and app/api/chat/message,
-- which use the service-role key (lib/chat-store.ts -> supabaseAdmin) and bypass
-- RLS entirely. Realtime postgres_changes is likewise no longer used by the
-- widget (components/ChatWidget.tsx polls the session endpoint instead).
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop the permissive policies (idempotent).
DROP POLICY IF EXISTS "Public can view chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can insert chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can update chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can view chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Public can insert chat messages" ON public.chat_messages;

-- Replace the admin policies with the shared is_admin() helper, add the explicit
-- TO authenticated role and an explicit WITH CHECK (the old ones keyed off
-- auth.jwt(), which never exists now that Clerk is the identity provider).
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

-- The chat tables no longer need to be in the realtime publication: no anon
-- subscriber may receive postgres_changes now that the policies are removed,
-- and the widget polls instead. Removing them also prevents any future
-- misconfiguration from broadcasting visitor PII to other visitors.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime DROP TABLE public.chat_sessions;
        EXCEPTION WHEN undefined_object THEN NULL;
        END;
        BEGIN
            ALTER PUBLICATION supabase_realtime DROP TABLE public.chat_messages;
        EXCEPTION WHEN undefined_object THEN NULL;
        END;
    END IF;
END $$;
