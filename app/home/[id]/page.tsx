import { notFound } from "next/navigation";
import { mockHomes, mockMembers } from "@/lib/mock-data";
import BookingRequestForm from "@/components/BookingRequestForm";

// TODO: replace with a Supabase query by id, joined with the owner's member record.

export default function HomeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const home = mockHomes.find((h) => h.id === params.id);
  if (!home) notFound();

  const owner = mockMembers.find((m) => m.id === home.ownerId);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl sm:grid-cols-4">
          {Array.from({ length: Math.max(home.photoUrls.length, 4) }).map(
            (_, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center bg-stone-100 text-xs text-ink-muted"
              >
                {home.photoUrls[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={home.photoUrls[i]}
                    alt={`${home.title} photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "Photo"
                )}
              </div>
            )
          )}
        </div>

        <h1 className="mt-8 font-display text-3xl text-ink">{home.title}</h1>
        <p className="mt-1 font-body text-ink-muted">{home.generalLocation}</p>

        <p className="mt-6 font-body text-ink">{home.description}</p>

        <div className="mt-8">
          <h2 className="font-display text-xl text-ink">Amenities</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 font-body text-sm text-ink">
            {home.amenities.map((a) => (
              <li key={a} className="rounded-lg bg-stone-100 px-3 py-2">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-xl text-ink">House rules</h2>
          <p className="mt-3 font-body text-sm text-ink">{home.houseRules}</p>
        </div>

        {home.careCallout && (
          <div className="mt-8 rounded-xl bg-gold-100 p-4">
            <h2 className="font-display text-lg text-ink">
              While you're there
            </h2>
            <p className="mt-2 font-body text-sm text-ink">
              {home.careCallout}
            </p>
          </div>
        )}
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="font-display text-lg text-ink">Hosted by</h2>
          <p className="mt-2 font-body text-sm text-ink">
            {owner?.name ?? "A group member"}
          </p>
          {owner?.bio && (
            <p className="mt-1 font-body text-sm text-ink-muted">
              {owner.bio}
            </p>
          )}
          <button className="mt-4 w-full rounded-xl border border-olive-700 px-4 py-2 font-body text-sm text-olive-700 hover:bg-olive-50">
            Message {owner?.name?.split(" ")[0] ?? "owner"}
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="font-display text-lg text-ink">Request to stay</h2>
          <p className="mt-1 font-body text-sm text-ink-muted">
            The owner reviews and approves every request.
          </p>
          <div className="mt-4">
            <BookingRequestForm homeId={home.id} />
          </div>
        </div>
      </aside>
    </div>
  );
}
