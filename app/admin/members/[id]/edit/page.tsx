import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapMemberRow } from "@/lib/supabase/mappers";
import MemberEditForm from "./member-edit-form";

export default async function EditMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: memberRow } = await supabase
    .from("members")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!memberRow) notFound();
  const member = mapMemberRow(memberRow);

  const { data: ownedHomeRows } = await supabase
    .from("homes")
    .select("id, title")
    .eq("owner_id", member.id);

  const ownedHomes = (ownedHomeRows ?? []) as { id: string; title: string }[];

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl text-ink">Edit: {member.name}</h1>
      <p className="mt-1 font-body text-sm text-ink-muted">{member.email}</p>
      <MemberEditForm member={member} ownedHomes={ownedHomes} />
    </div>
  );
}
