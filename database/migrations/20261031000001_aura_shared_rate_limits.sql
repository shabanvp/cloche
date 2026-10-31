BEGIN;

CREATE TABLE IF NOT EXISTS public.aura_rate_limit_windows (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_aura_rate_limit_windows_expiry
  ON public.aura_rate_limit_windows(window_started_at);

CREATE TABLE IF NOT EXISTS public.aura_conversation_locks (
  conversation_id TEXT PRIMARY KEY REFERENCES public.aura_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lock_token UUID NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_aura_conversation_locks_expiry
  ON public.aura_conversation_locks(expires_at);

ALTER TABLE public.aura_rate_limit_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_conversation_locks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.aura_rate_limit_windows FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.aura_conversation_locks FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.aura_rate_limit_windows TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.aura_conversation_locks TO service_role;

CREATE OR REPLACE FUNCTION public.aura_consume_chat_rate_limit(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_window_seconds INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_count INTEGER;
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  IF p_user_id IS NULL OR p_limit IS NULL OR p_limit < 1 OR p_limit > 1000 OR p_window_seconds IS NULL OR p_window_seconds < 1 OR p_window_seconds > 3600 THEN
    RAISE EXCEPTION 'Invalid rate limit parameters' USING ERRCODE = '22023';
  END IF;

  -- Bound storage growth. Inactive users' windows expire after one day.
  DELETE FROM public.aura_rate_limit_windows
    WHERE window_started_at < v_now - INTERVAL '1 day';

  INSERT INTO public.aura_rate_limit_windows(user_id, window_started_at, request_count, updated_at)
    VALUES (p_user_id, v_now, 1, v_now)
  ON CONFLICT (user_id) DO UPDATE SET
    window_started_at = CASE
      WHEN public.aura_rate_limit_windows.window_started_at <= v_now - make_interval(secs => p_window_seconds)
        THEN v_now
      ELSE public.aura_rate_limit_windows.window_started_at
    END,
    request_count = CASE
      WHEN public.aura_rate_limit_windows.window_started_at <= v_now - make_interval(secs => p_window_seconds)
        THEN 1
      ELSE LEAST(public.aura_rate_limit_windows.request_count + 1, p_limit + 1)
    END,
    updated_at = v_now
  RETURNING request_count INTO v_count;

  RETURN v_count <= p_limit;
END;
$function$;

CREATE OR REPLACE FUNCTION public.aura_acquire_conversation_lock(
  p_conversation_id TEXT,
  p_user_id UUID,
  p_lock_token UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_acquired BOOLEAN := FALSE;
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  IF p_conversation_id IS NULL OR p_user_id IS NULL OR p_lock_token IS NULL THEN
    RAISE EXCEPTION 'Invalid conversation lock parameters' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.aura_conversations
    WHERE id = p_conversation_id AND user_id = p_user_id
  ) THEN
    RETURN FALSE;
  END IF;

  DELETE FROM public.aura_conversation_locks WHERE expires_at <= v_now;
  INSERT INTO public.aura_conversation_locks(conversation_id, user_id, lock_token, expires_at, updated_at)
    VALUES (p_conversation_id, p_user_id, p_lock_token, v_now + INTERVAL '60 seconds', v_now)
  ON CONFLICT (conversation_id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    lock_token = EXCLUDED.lock_token,
    expires_at = EXCLUDED.expires_at,
    updated_at = EXCLUDED.updated_at
  WHERE public.aura_conversation_locks.expires_at <= v_now
  RETURNING TRUE INTO v_acquired;
  RETURN COALESCE(v_acquired, FALSE);
END;
$function$;

CREATE OR REPLACE FUNCTION public.aura_release_conversation_lock(
  p_conversation_id TEXT,
  p_user_id UUID,
  p_lock_token UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.aura_conversation_locks
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id AND lock_token = p_lock_token;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted = 1;
END;
$function$;

REVOKE ALL ON FUNCTION public.aura_consume_chat_rate_limit(UUID, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.aura_acquire_conversation_lock(TEXT, UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.aura_release_conversation_lock(TEXT, UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.aura_consume_chat_rate_limit(UUID, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.aura_acquire_conversation_lock(TEXT, UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.aura_release_conversation_lock(TEXT, UUID, UUID) TO service_role;

COMMIT;
