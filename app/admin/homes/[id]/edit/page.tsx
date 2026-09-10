import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapHomeRow } from "@/lib/supabase/mappers";

// TODO: full listing editor — text fields for description/amenities/rules/
// care callout, plus a 10-photo uploader writing to Supabase Storage.
// This stub exists so the admin flow (create → edit → publish) is
// navigable end-to-end for the Sept 10 demo, even before the real
// upload UI is built.

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
      <form className="mt-6 space-y-4">
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Title
          </label>
          <input
            defaultValue={home.title}
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            defaultValue={home.description}
            rows={4}
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Photos (up to 10)
          </label>
          <div className="mt-1 rounded-xl border border-dashed border-border p-6 text-center font-body text-sm text-ink-muted">
            Photo uploader goes here (Supabase Storage)
          </div>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-olive-700 px-5 py-2 font-body text-sm text-stone-50 hover:bg-olive-600"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
