import HomeCard from "@/components/HomeCard";
import { mockHomes } from "@/lib/mock-data";

// TODO: replace mockHomes with a Supabase query, e.g.
//   const supabase = createClient();
//   const { data: homes } = await supabase.from("homes").select("*").eq("status", "published");

export default function DirectoryPage() {
  const homes = mockHomes;

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
