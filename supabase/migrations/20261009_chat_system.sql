-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 12: WEBSITE CHAT SYSTEM (chat_sessions + chat_messages)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'bot', -- 'bot', 'human', 'resolved'
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

-- Indexes for fast lookup & sorting
CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor_id ON public.chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON public.chat_sessions(last_message_at DESC);

-- 2. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'visitor', 'bot', 'admin'
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for ordering messages chronologically within a session
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id_created_at ON public.chat_messages(session_id, created_at ASC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- chat_sessions RLS policies
-- SECURITY: no anon policy. Visitor chat data (name/email/phone + transcripts)
-- must never be readable or writable with the browser-exposed publishable key.
-- Visitor traffic is proxied server-side via app/api/chat/* using the service role.
DROP POLICY IF EXISTS "Public can view chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can insert chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can update chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can view chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Public can insert chat messages" ON public.chat_messages;

-- Admin full access policies
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

-- 4. Enable Supabase Realtime on both chat tables
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
        EXCEPTION WHEN duplicate_object THEN
            -- Table already in publication
        END;
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
        EXCEPTION WHEN duplicate_object THEN
            -- Table already in publication
        END;
    END IF;
END $$;
