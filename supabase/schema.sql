-- Rev0 schema. Run this in the Supabase SQL editor (or via CLI migration)
-- against a fresh project. Matches lib/types.ts — keep both in sync.

-- ── Members ──────────────────────────────────────────────────────────────
-- Extends Supabase's built-in auth.users with app-specific profile fields.
create table members (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('owner', 'admin', 'superadmin')) default 'owner',
  bio text,
  photo_url text,
  email text not null,
  created_at timestamptz not null default now()
);

-- ── Invites ──────────────────────────────────────────────────────────────
create table invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  role text not null check (role in ('owner', 'admin', 'superadmin')) default 'owner',
  status text not null check (status in ('sent', 'used', 'expired')) default 'sent',
  created_at timestamptz not null default now()
);

-- ── Homes ────────────────────────────────────────────────────────────────
create table homes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references members(id) on delete cascade,
  title text not null,
  description text not null default '',
  general_location text not null default '',
  amenities text[] not null default '{}',
  house_rules text not null default '',
  care_callout text,
  photo_urls text[] not null default '{}' check (array_length(photo_urls, 1) is null or array_length(photo_urls, 1) <= 10),
  status text not null check (status in ('draft', 'published')) default 'draft',
  created_at timestamptz not null default now()
);

-- ── Messages ─────────────────────────────────────────────────────────────
create table messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references members(id) on delete cascade,
  recipient_id uuid not null references members(id) on delete cascade,
  home_id uuid references homes(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- ── Booking requests (Rev0: free-text dates, no calendar yet) ──────────────
create table booking_requests (
  id uuid primary key default gen_random_uuid(),
  home_id uuid not null references homes(id) on delete cascade,
  requester_id uuid not null references members(id) on delete cascade,
  requested_dates text not null,
  note text,
  status text not null check (status in ('pending', 'approved', 'denied')) default 'pending',
  created_at timestamptz not null default now()
);

-- ── Row-level security ──────────────────────────────────────────────────
alter table members enable row level security;
alter table homes enable row level security;
alter table messages enable row level security;
alter table booking_requests enable row level security;
alter table invites enable row level security;

-- Members: any signed-in member can see the directory; only admins edit roles.
create policy "members are readable by any signed-in member"
  on members for select using (auth.uid() is not null);

create policy "members can update their own profile"
  on members for update using (auth.uid() = id);

-- Homes: published homes are visible to all members; owners manage their own;
-- admins/superadmins manage any.
create policy "published homes are readable by any signed-in member"
  on homes for select using (
    auth.uid() is not null and (
      status = 'published'
      or owner_id = auth.uid()
      or exists (select 1 from members where id = auth.uid() and role in ('admin', 'superadmin'))
    )
  );

create policy "owners and admins can write homes"
  on homes for all using (
    owner_id = auth.uid()
    or exists (select 1 from members where id = auth.uid() and role in ('admin', 'superadmin'))
  );

-- Messages: only sender or recipient can read a message.
create policy "messages are readable by sender or recipient"
  on messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "members can send messages as themselves"
  on messages for insert with check (auth.uid() = sender_id);

-- Booking requests: readable by the requester or the home's owner.
create policy "booking requests readable by requester or home owner"
  on booking_requests for select using (
    auth.uid() = requester_id
    or auth.uid() in (select owner_id from homes where id = home_id)
  );

create policy "members can create their own booking requests"
  on booking_requests for insert with check (auth.uid() = requester_id);

create policy "home owner can update request status"
  on booking_requests for update using (
    auth.uid() in (select owner_id from homes where id = home_id)
  );

-- Invites: admin/superadmin only.
create policy "only admins manage invites"
  on invites for all using (
    exists (select 1 from members where id = auth.uid() and role in ('admin', 'superadmin'))
  );
