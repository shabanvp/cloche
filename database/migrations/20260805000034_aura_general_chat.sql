BEGIN;

CREATE TABLE IF NOT EXISTS aura_conversations (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New chat',
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE aura_conversations
  ADD COLUMN IF NOT EXISTS context JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS aura_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL REFERENCES aura_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aura_conversations_user_updated
  ON aura_conversations(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_aura_messages_conversation_created
  ON aura_messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_aura_messages_user
  ON aura_messages(user_id);

ALTER TABLE aura_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE aura_messages ENABLE ROW LEVEL SECURITY;

COMMIT;
