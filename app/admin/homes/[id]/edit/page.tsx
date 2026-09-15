import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapHomeRow } from "@/lib/supabase/mappers";
import EditForm from "./edit-form";

export default async function EditHomePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: homeRow } = await supabase
    .from("homes")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!homeRow) notFound();
  const home = mapHomeRow(homeRow);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Edit: {home.title}</h1>
      <EditForm home={home} />
    </div>
  );
}
