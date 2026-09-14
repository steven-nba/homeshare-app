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
2. ~~Add authentication and route guards so admin pages aren't open to
   everyone.~~ **Done.** `/login` and `/invite/[token]` work against real
   Supabase auth; `middleware.ts` redirects non-admins away from `/admin`.
3. ~~Seed real test accounts and home listings directly through the Supabase
   dashboard.~~ **Done.** 3 members (1 admin, 2 owner) and 3 published
   homes, created by hand in the dashboard.
4. ~~Add photos to those listings via Supabase Storage's own dashboard.~~
   **Done.** Public `home-photos` bucket; URLs pasted into `photo_urls`.
5. ~~Full walkthrough as a real test account, fixing anything that
   breaks.~~ **Done.** Verified sign-in, browsing, booking requests,
   messaging, and admin access/gating end-to-end with throwaway test
   accounts (created and fully deleted afterward — never touched the real
   seeded accounts' credentials). Found and fixed one real bug: the
   "Message <owner>" button on home detail pages was decorative (no TODO
   ever flagged it, so it slipped through step 1) — now wired to
   `/messages?to=<ownerId>`.

**Sept 15 milestone is complete.** All 5 items done.

**Post-milestone: this will be demoed on a mobile device.** Verified the
full app at a 375×812 (iPhone-class) viewport and fixed two real mobile
bugs found in the process:
- `Nav.tsx` overflowed horizontally on narrow screens (whole page scrolled
  sideways, "Sign in" cut off) — now collapses into a hamburger menu below
  the `sm` breakpoint.
- The admin table's "Edit" links were clipped ~90% off-screen (no scroll
  container) — wrapped in `overflow-x-auto` with a `min-width` so it
  scrolls instead of hiding content.

Everything else (photo grids at various counts, booking requests,
messaging, login, invite redemption) already worked correctly on mobile
with no changes needed.

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
- This Supabase project needed explicit `grant ... to anon, authenticated`
  and `grant ... to service_role` statements before those roles could touch
  any table at all — RLS policies only apply *after* that base grant check
  passes. If a query fails with "permission denied for table X" (not an RLS
  empty-result), the grant is probably missing, not the policy.
- Invite redemption (`/invite/[token]` → `app/api/invite/[token]/route.ts`)
  uses `lib/supabase/admin.ts`, a service-role client that bypasses RLS —
  necessary because the person redeeming an invite has no account (and
  therefore no RLS identity) until the route creates one. Server-only,
  never import it into a Client Component.
- When verifying a flow end-to-end needs a real signed-in session, create a
  throwaway test account with the admin client, test through it, then
  delete it (member row + auth user) — never touch the real seeded
  accounts' credentials, and never leave test data behind.
- Don't drop ad-hoc `.mjs`/test scripts inside the project directory while
  `npm run dev` is running — Next's file watcher picks them up and can
  hot-reload/reset page state mid-test, producing misleading failures. Run
  them from outside the project (e.g. the scratchpad) with a symlinked
  `node_modules`, or delete them immediately after use.
- The Browser pane's raw `type` action doesn't reliably update
  React-controlled inputs (`value` + `onChange`, as in the message
  composer) — use `form_input` for those. Plain uncontrolled inputs (read
  via `FormData` on submit, as in the login/invite forms) work fine with
  `type`.
