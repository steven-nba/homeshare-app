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

Everything **renders and is navigable**, but data doesn't persist yet:
- Forms (booking request, messages, invite setup, login, admin edit) submit
  without hitting a database — each has a `TODO` marking where the Supabase
  call goes.
- Photo upload is a placeholder box, not a real uploader.
- No auth/session check yet — every route is open regardless of role.

This is intentional: the structure, types, and schema are the scaffold;
wiring each TODO to Supabase is the Week 2 build work.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project keys
npm run dev
```

To get Supabase keys: create a free project at supabase.com, then in the SQL
editor run `supabase/schema.sql`. Project keys are under
Project Settings → API.

## Next steps (Week 2)

1. Wire each `TODO: replace with Supabase query` to a real call.
2. Add auth/session handling and route guards (admin routes should redirect
   non-admins).
3. Build the real photo uploader against Supabase Storage.
4. Build the invite-creation flow for admins (generate a link, not just
   consume one).
5. Seed `homes` and `members` with the test data for the Sept 10 demo.

## Open items (not blocking)

- Real group/app name — currently placeholder "Homeshare" in `app/layout.tsx`
  and `components/Nav.tsx`.
- Logo and final color palette — current palette is a deliberate placeholder
  (warm stone background, deep olive primary, warm gold accent) chosen to
  match the "warm, residential, light, welcoming" direction, not final
  branding.
- Invite email template and registration/feedback URLs.
