alter table public.users
  add column if not exists password_reset_token_hash text,
  add column if not exists password_reset_expires_at timestamptz;

alter table public.boutiques
  add column if not exists password_reset_token_hash text,
  add column if not exists password_reset_expires_at timestamptz;

create index if not exists users_password_reset_token_hash_idx
  on public.users (password_reset_token_hash);

create index if not exists boutiques_password_reset_token_hash_idx
  on public.boutiques (password_reset_token_hash);
