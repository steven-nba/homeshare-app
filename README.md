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
  - `/my-homes` — for owners: see and approve/deny stay requests on their
    own homes
  - `/admin` — listing management (create/edit)
  - `/admin/invite` — generate an invite link for a new member
  - `/admin/members` — read-only list of everyone in the group
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

Directory, admin listing, home detail, admin edit (including a real photo
uploader), messages, my-homes, and admin invite-creation pages all
read/write real Supabase data. `/login` and `/invite/[token]` work against
real Supabase auth, and `/admin` redirects anyone who isn't signed in as
an admin/superadmin. The database has real seeded members, homes, and
photos (see "Plan" below).

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
invite-creation UI and the real photo uploader were **intentionally
deferred until after September 15** — both have since been built
post-milestone (see "Post-milestone additions" below).

## Plan (target: Sept 15 demo)

1. ~~Wire each `TODO: replace with Supabase query` to a real call.~~ **Done.**
   Directory, admin listing, home detail, admin edit, and messages pages
   read/write real Supabase data; booking-request and message-send actions
   insert into the database.
2. ~~Add auth/session handling and route guards (admin routes should
   redirect non-admins).~~ **Done.** `/login` and `/invite/[token]` are
   wired to real Supabase auth; `middleware.ts` redirects non-admins away
   from `/admin`.
3. ~~Seed real test accounts and home listings directly through the
   Supabase dashboard.~~ **Done.** 3 members (1 admin, 2 owner) and 3
   published homes.
4. ~~Add photos to those listings via Supabase Storage's dashboard.~~
   **Done.** Public `home-photos` bucket, URLs pasted into each listing.
5. ~~Do a full walkthrough as a real test account, fixing anything that
   breaks.~~ **Done.** Sign-in, browsing, booking requests, messaging, and
   admin gating all verified end-to-end. Fixed one real bug found along the
   way: the "Message \<owner\>" button on home detail pages wasn't wired to
   anything — it now links to `/messages?to=<ownerId>`.

**The Sept 15 demo milestone is complete.**

## Mobile verification

The app will be demoed on a mobile device. Verified end-to-end at a
375×812 (iPhone-class) viewport and fixed two real bugs found along the
way:
- The nav overflowed horizontally on narrow screens — it now collapses
  into a hamburger menu below the `sm` breakpoint.
- The admin table's "Edit" links were almost entirely clipped off-screen —
  the table now scrolls horizontally (`overflow-x-auto`) instead of hiding
  content.

Everything else — photo grids, booking requests, messaging, login, invite
redemption — already worked correctly on mobile.

**Re-verified after invite/members/uploader landed:** checked `/admin`,
`/admin/members`, `/admin/invite`, and the photo uploader at the same
viewport. Fixed one more bug — the admin header's buttons wrapped
mid-word on narrow screens instead of the header stacking — everything
else (tabs, scrollable tables, the invite link/copy display, multi-file
upload, thumbnails, remove) already worked correctly.

## Post-milestone additions

- **`/my-homes`** — owners can now see and approve/deny stay requests on
  homes they host, not just submit requests as a guest. Uses the RLS
  policy and `status` column already in `supabase/schema.sql`, so no
  schema changes were needed.
- **`/admin/invite`** — admins can now generate an invite link (email +
  role) from the UI instead of creating test accounts by hand in the
  Supabase dashboard. Uses the token generation and admin-only policy
  already in `supabase/schema.sql`; gated the same way as the rest of
  `/admin`.
- **`/admin/members`** — read-only table of every member (Name, Email,
  Role). `components/AdminTabs.tsx` adds a Listings/Members switcher to
  the top of both admin pages.
- **Real photo uploader** — the placeholder box on the admin edit page
  now actually uploads to the existing `home-photos` bucket (multi-file,
  image-only, 10-photo limit enforced with a clear block rather than a
  silent partial upload), shows thumbnails, and removes photos from
  storage (not just the listing) when deleted. Needed three new
  `storage.objects` RLS policies (insert/delete/select, admin-only) and a
  base grant on `storage.objects` to `authenticated` — applied directly
  via the SQL editor, not yet committed to `supabase/schema.sql`.

## Open items (not blocking)

- Real group/app name — currently placeholder "Homeshare" in `app/layout.tsx`
  and `components/Nav.tsx`.
- Logo and final color palette — current palette is a deliberate placeholder
  (warm stone background, deep olive primary, warm gold accent) chosen to
  match the "warm, residential, light, welcoming" direction, not final
  branding.
- Invite email template and registration/feedback URLs.
