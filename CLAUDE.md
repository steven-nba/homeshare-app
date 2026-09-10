# Homeshare App

Private home-sharing directory for an alumni group. Members browse homes
shared by other members, message each other, and request stays. Invite-only
— there is deliberately no self-serve sign-up.

Stack: Next.js (App Router) + Tailwind + Supabase (auth/database/storage),
deployed to Vercel.

- Repo: [github.com/steven-nba/homeshare-app](https://github.com/steven-nba/homeshare-app)
- Supabase project: `ripajwdwnpalfyevjtau`
- Schema: `supabase/schema.sql` — table definitions plus row-level security
  policies enforcing the role model (owner / admin / superadmin) at the
  database level. Keep `lib/types.ts` in sync with it.

## Current milestone: working demo by September 15

Scope for this milestone was deliberately narrowed to hit that date. Work
through this list **one item at a time, pausing for review after each**:

1. ~~Wire mock-data TODOs to real Supabase queries.~~ **Done.** Directory,
   admin listing, home detail, admin edit, and messages pages read/write
   real Supabase data via `lib/supabase/client.ts` (browser) and
   `lib/supabase/server.ts` (server components), mapped through
   `lib/supabase/mappers.ts`.
2. Add authentication and route guards so admin pages aren't open to
   everyone. **In progress / next up.**
3. Seed real test accounts and home listings directly through the Supabase
   dashboard — not by building the admin invite-creation flow.
4. Add photos to those listings by uploading through Supabase Storage's own
   dashboard and pasting the resulting URLs into listing records — not by
   building a drag-and-drop uploader.
5. Full walkthrough as a real test account, fixing anything that breaks.

**Intentionally deferred until after Sept 15** (do not build unless asked):
the admin invite-creation UI (generating invite links) and the real
drag-and-drop photo uploader against Supabase Storage.

See `README.md` for the fuller breakdown of what's wired vs. stubbed.

## Working style

- Ask before structural changes rather than assuming.
- After each step, explain what changed and why, in plain language.
- If a task needs the Supabase service role key, ask the user to add it to
  `.env.local` themselves — never ask them to paste it into chat.
- RLS requires a signed-in user (`auth.uid() is not null`) to read most
  tables, so pages will correctly show empty/blocked states until item 2
  (auth) lands — that's expected, not a bug.
