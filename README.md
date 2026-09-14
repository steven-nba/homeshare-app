# Homeshare App — Rev0 Scaffold

This is the starting structure for the private home-sharing directory, built
to hand off to Claude Code for the Week 2–3 build. It matches the Rev0 plan:
Next.js + Tailwind on the frontend, Supabase for auth/database/storage,
deployed to Vercel.

## What's here

- `app/` — every Rev0 route, each rendering with placeholder content so the
  navigation flow is walkable end-to-end:
  - `/` — home directory grid
  - `/home/[id]` — individual home page (photos, description, amenities,
    house rules, care callout, message + booking request)
  - `/messages` — in-app messaging
  - `/admin` — listing management (create/edit)
  - `/invite/[token]` — invite-based account setup
  - `/login` — sign in (no self-serve sign-up, by design)
- `lib/types.ts` — the data model (Member, Home, Message, BookingRequest,
  Invite), written to match `supabase/schema.sql` exactly.
- `lib/mock-data.ts` — sample homes/members so pages render before the
  database is wired up. Every place that uses it has a
  `// TODO: replace with Supabase query` comment.
- `supabase/schema.sql` — full table definitions plus row-level security
  policies enforcing the role model (owner / admin / superadmin) at the
  database level, not just in the UI.
- `tailwind.config.ts` — the warm/residential/light design tokens (olive +
  gold on warm stone, Fraunces + Work Sans). Swap for real brand colors once
  naming/branding lands — see "Open items" below.

## What's stubbed vs. real

Directory, admin listing, home detail, admin edit, and messages pages read
and write real Supabase data. `/login` and `/invite/[token]` work against
real Supabase auth, and `/admin` redirects anyone who isn't signed in as an
admin/superadmin. Still stubbed:
- Photo upload is a placeholder box, not a real uploader.
- The admin invite-creation flow (generating an invite link) doesn't exist —
  test accounts are created directly in the Supabase dashboard instead.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project keys
npm run dev
```

To get Supabase keys: create a free project at supabase.com, then in the SQL
editor run `supabase/schema.sql`. Project keys are under
Project Settings → API.

## Timeline note

**A working demo is needed by September 15.** This replaces the original
Week 2–3 plan below — scope for this milestone is deliberately narrowed to
what's needed for a real, walkable demo by that date. The admin
invite-creation UI and the real drag-and-drop photo uploader are
**intentionally deferred until after September 15** — they are not part of
this milestone.

## Plan (target: Sept 15 demo)

1. ~~Wire each `TODO: replace with Supabase query` to a real call.~~ **Done.**
   Directory, admin listing, home detail, admin edit, and messages pages
   read/write real Supabase data; booking-request and message-send actions
   insert into the database.
2. ~~Add auth/session handling and route guards (admin routes should
   redirect non-admins).~~ **Done.** `/login` and `/invite/[token]` are
   wired to real Supabase auth; `middleware.ts` redirects non-admins away
   from `/admin`.
3. Seed real test accounts and home listings directly through the Supabase
   dashboard, rather than building the admin invite-creation flow this week.
4. Add photos to those listings by uploading through Supabase Storage's own
   dashboard and pasting the resulting URLs into the listing records, rather
   than building the drag-and-drop uploader this week.
5. Do a full walkthrough as a real test account, fixing anything that
   breaks.

## Open items (not blocking)

- Real group/app name — currently placeholder "Homeshare" in `app/layout.tsx`
  and `components/Nav.tsx`.
- Logo and final color palette — current palette is a deliberate placeholder
  (warm stone background, deep olive primary, warm gold accent) chosen to
  match the "warm, residential, light, welcoming" direction, not final
  branding.
- Invite email template and registration/feedback URLs.
