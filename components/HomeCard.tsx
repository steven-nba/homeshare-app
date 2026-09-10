import Link from "next/link";
import type { Home } from "@/lib/types";

export default function HomeCard({ home }: { home: Home }) {
  return (
    <Link
      href={`/home/${home.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-white transition hover:shadow-lg"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-stone-100 text-ink-muted">
        {home.photoUrls[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={home.photoUrls[0]}
            alt={home.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-body text-sm">Photo coming soon</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-ink group-hover:text-olive-700">
          {home.title}
        </h3>
        <p className="mt-1 font-body text-sm text-ink-muted">
          {home.generalLocation}
        </p>
      </div>
    </Link>
  );
}
