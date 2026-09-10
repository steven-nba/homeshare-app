import Link from "next/link";
import { mockHomes } from "@/lib/mock-data";

// TODO: gate this route to role "admin" or "superadmin" only (Supabase RLS
// plus a server-side role check in a layout or middleware).

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Admin</h1>
          <p className="mt-1 font-body text-ink-muted">
            Manage listings and send invites.
          </p>
        </div>
        <button className="rounded-xl bg-olive-700 px-4 py-2 font-body text-sm text-stone-50 hover:bg-olive-600">
          + New listing
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-stone-100 text-ink-muted">
            <tr>
              <th className="px-4 py-3">Home</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {mockHomes.map((home) => (
              <tr key={home.id} className="border-t border-border">
                <td className="px-4 py-3 text-ink">{home.title}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {home.generalLocation}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-olive-100 px-2 py-1 text-xs text-olive-700">
                    {home.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/homes/${home.id}/edit`}
                    className="text-olive-700 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
