import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapHomeRow } from "@/lib/supabase/mappers";
import PhotoManager from "./photo-manager";

// TODO: full listing editor — text fields for description/amenities/rules/
// care callout. The photo uploader is real now (see PhotoManager); the
// rest of this form still doesn't save.

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
        <PhotoManager
          homeId={home.id}
          homeTitle={home.title}
          initialPhotoUrls={home.photoUrls}
        />
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
