# Aura database operations

## Migration history

Aura's original conversation migration was run in the Supabase SQL Editor. The repository previously kept that file under `database/migrations`, outside the Supabase CLI migration directory, so the CLI could not compare it with remote migration history.

The matching file is now checked in at `supabase/migrations/20260805000034_aura_general_chat.sql`. Before changing remote migration history, verify that the conversation tables, `context`, idempotency columns/index, and RLS are present in the target project. Then link the intended project and inspect `supabase migration list`. If that migration's schema is present but its history row is missing, record it without executing SQL:

```powershell
supabase link --project-ref <project-ref>
supabase migration list
supabase migration repair 20260805000034 --status applied
supabase migration list
```

`migration repair` updates the CLI ledger only. It does not apply SQL. Do not run `supabase db push --linked` until every older migration shown by `migration list` has been reconciled with the actual project schema. The migration SQL under `database/migrations` remains the canonical historical copy; keep the Supabase copy synchronized.

## Shared Aura rate limit

`20261031000001_aura_shared_rate_limits.sql` adds a per-user PostgreSQL window and the `aura_consume_chat_rate_limit` RPC. Deploy this migration to the Supabase project before deploying the app version that calls the RPC. The RPC is service-role-only and uses one atomic upsert per user. It prunes inactive windows older than one day on requests, resets expired windows, and fails closed at the API if the database is unavailable.

The limit is 20 accepted chat requests per user per 60 seconds. The RPC returns `false` after the limit. Database errors produce a retryable 503 response; they do not silently fall back to an instance-local limiter.

## Isolated integration suite

`frontend/tests/aura-api.integration.test.cjs` only runs when all `AURA_TEST_*` variables are configured. Point it at a local/test Next.js server and a dedicated local/test Supabase project. It provisions two isolated custom Cloche `users` rows through the local service-role REST endpoint, signs customer JWTs with the test JWT secret, runs the API isolation/persistence tests, and removes only conversations and users whose generated email carries the suite's unique run ID.

Never point these variables at production. The suite refuses non-loopback hostnames and requires `AURA_TEST_ENVIRONMENT=isolated`. The local app must be configured with the same test Supabase URL/service-role key/JWT secret as the suite. Use two separate test users for the run; no real customer account is used.
