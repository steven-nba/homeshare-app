import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { mapMemberRow } from "@/lib/supabase/mappers";
import AdminTabs from "@/components/AdminTabs";

export default async function AdminMembersPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load members:", error.message);
  }

  const members = (data ?? []).map(mapMemberRow);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Admin</h1>
        <p className="mt-1 font-body text-ink-muted">Everyone in the group.</p>
      </div>

      <AdminTabs active="members" />

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left font-body text-sm">
            <thead className="bg-stone-100 text-ink-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-border">
                  <td className="px-4 py-3 text-ink">{member.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{member.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-olive-100 px-2 py-1 text-xs text-olive-700">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/members/${member.id}/edit`}
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
    </div>
  );
}
