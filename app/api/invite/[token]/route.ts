import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Redeems an invite: creates the auth user, creates their member profile,
// and marks the invite used. Runs with the service-role client because the
// person calling this doesn't have an account (and therefore no RLS
// identity) until it succeeds.
export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  const { name, bio, password } = await request.json();

  if (!name || !password) {
    return NextResponse.json(
      { error: "Name and password are required." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select("*")
    .eq("token", params.token)
    .maybeSingle();

  if (inviteError || !invite || invite.status !== "sent") {
    return NextResponse.json(
      { error: "This invite link is no longer valid." },
      { status: 400 }
    );
  }

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email: invite.email,
      password,
      email_confirm: true,
    });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Could not create account." },
      { status: 400 }
    );
  }

  const { error: memberError } = await supabase.from("members").insert({
    id: created.user.id,
    name,
    role: invite.role,
    bio: bio || null,
    email: invite.email,
  });

  if (memberError) {
    // Roll back the auth user so the invite can be retried cleanly.
    await supabase.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: memberError.message }, { status: 400 });
  }

  await supabase
    .from("invites")
    .update({ status: "used" })
    .eq("token", params.token);

  return NextResponse.json({ ok: true });
}
