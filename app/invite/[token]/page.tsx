import { createAdminClient } from "@/lib/supabase/admin";
import InviteForm from "./invite-form";

// Looked up with the admin client (service role) because the person
// opening this link doesn't have an account yet — there's no RLS-visible
// identity for them until they finish this form.
export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = createAdminClient();
  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("token", params.token)
    .maybeSingle();

  if (!invite || invite.status !== "sent") {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-display text-2xl text-ink">
          This link is no longer valid
        </h1>
        <p className="mt-2 font-body text-sm text-ink-muted">
          {invite?.status === "used"
            ? "This invite has already been used. If that wasn't you, contact an admin."
            : "This invite link doesn't exist or has expired. Ask an admin for a new one."}
        </p>
      </div>
    );
  }

  return <InviteForm token={params.token} email={invite.email} />;
}
