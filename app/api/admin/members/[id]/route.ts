import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/types";

const VALID_ROLES: UserRole[] = ["owner", "admin", "superadmin"];

// Confirms the caller is signed in and has role admin/superadmin. Uses the
// regular server client (cookie-based session, respects RLS) — reading a
// member's own or another's role is already allowed by the "members are
// readable by any signed-in member" policy, so this doesn't need the
// service-role client.
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  }

  const { data: caller } = await supabase
    .from("members")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = caller?.role === "admin" || caller?.role === "superadmin";
  if (!isAdmin) {
    return { error: NextResponse.json({ error: "Admins only." }, { status: 403 }) };
  }

  return { userId: user.id };
}

// Edits a member's name/role. Requires the service-role client because
// there's no RLS policy letting an admin update someone else's row — only
// "update your own profile" exists.
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { name, role } = await request.json();

  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("members")
    .update({ name: name.trim(), role })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

// Removes a member: blocked entirely if they own any homes (deleting the
// auth user cascades to delete those homes, and the messages/booking
// requests tied to them). Otherwise deletes the members row, then the
// underlying Supabase Auth account, so they can no longer sign in.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const admin = createAdminClient();

  const { data: ownedHomes, error: homesError } = await admin
    .from("homes")
    .select("title")
    .eq("owner_id", params.id);

  if (homesError) {
    return NextResponse.json({ error: homesError.message }, { status: 400 });
  }

  if (ownedHomes && ownedHomes.length > 0) {
    const titles = ownedHomes.map((h) => h.title).join(", ");
    return NextResponse.json(
      {
        error: `This member owns ${ownedHomes.length} listing${ownedHomes.length === 1 ? "" : "s"} (${titles}). Removing them would also delete those listings and their messages/booking requests. Reassign or remove those listings first.`,
      },
      { status: 400 }
    );
  }

  const { error: memberDeleteError } = await admin
    .from("members")
    .delete()
    .eq("id", params.id);

  if (memberDeleteError) {
    return NextResponse.json({ error: memberDeleteError.message }, { status: 400 });
  }

  const { error: authDeleteError } = await admin.auth.admin.deleteUser(params.id);

  if (authDeleteError) {
    return NextResponse.json(
      {
        error: `Member profile removed, but their sign-in account could not be deleted: ${authDeleteError.message}. It should be cleaned up manually in Supabase Auth.`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
