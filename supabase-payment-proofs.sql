create table if not exists payment_proofs (
  id bigserial primary key,
  boutique_id bigint not null,
  plan text not null check (plan in ('professional', 'premium')),
  amount numeric not null,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'annual')),
  screenshot_url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists payment_proofs_boutique_id_idx on payment_proofs (boutique_id);
create index if not exists payment_proofs_status_idx on payment_proofs (status);
