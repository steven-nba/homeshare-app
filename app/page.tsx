import HomeCard from "@/components/HomeCard";
import { createClient } from "@/lib/supabase/server";
import { mapHomeRow } from "@/lib/supabase/mappers";

export default async function DirectoryPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("homes")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load homes:", error.message);
  }

  const homes = (data ?? []).map(mapHomeRow);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">The homes</h1>
        <p className="mt-2 font-body text-ink-muted">
          {homes.length} homes shared by members of the group.
        </p>
      </div>

      {homes.length === 0 ? (
        <p className="font-body text-ink-muted">
          No homes published yet. Once your admin adds the first listing,
          it will show up here.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homes.map((home) => (
            <HomeCard key={home.id} home={home} />
          ))}
        </div>
      )}
    </div>
  );
}
