"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Member, UserRole } from "@/lib/types";

export default function MemberEditForm({
  member,
  ownedHomes,
}: {
  member: Member;
  ownedHomes: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState<UserRole>(member.role);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const canRemove = ownedHomes.length === 0;

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    const res = await fetch(`/api/admin/members/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });

    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSaveError(body.error ?? "Something went wrong. Try again.");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleConfirmRemove() {
    setRemoving(true);
    setRemoveError(null);

    const res = await fetch(`/api/admin/members/${member.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setRemoveError(body.error ?? "Something went wrong. Try again.");
      setRemoving(false);
      setConfirmingRemove(false);
      return;
    }

    router.push("/admin/members");
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleSave} className="mt-6 space-y-4">
        {saveError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            {saveError}
          </p>
        )}
        {saved && (
          <p className="rounded-lg bg-olive-50 px-3 py-2 font-body text-sm text-olive-900">
            Saved.
          </p>
        )}

        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>

        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          >
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-olive-700 px-5 py-2 font-body text-sm text-stone-50 hover:bg-olive-600 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="mt-10 rounded-2xl border border-red-200 bg-red-50/50 p-5">
        <h2 className="font-display text-lg text-ink">Remove member</h2>

        {removeError && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            {removeError}
          </p>
        )}

        {!canRemove ? (
          <p className="mt-2 font-body text-sm text-ink">
            This member owns {ownedHomes.length} listing
            {ownedHomes.length === 1 ? "" : "s"} (
            {ownedHomes.map((h) => h.title).join(", ")}). Removing them would
            also delete those listings and the messages/booking requests tied
            to them, so removal is blocked. Reassign or remove those listings
            first.
          </p>
        ) : confirmingRemove ? (
          <div className="mt-3">
            <p className="font-body text-sm text-ink">
              Are you sure you want to remove {member.name}? This deletes
              their profile and sign-in account — they won't be able to sign
              in again. This can't be undone.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleConfirmRemove}
                disabled={removing}
                className="rounded-xl bg-red-700 px-4 py-2 font-body text-sm text-stone-50 hover:bg-red-800 disabled:opacity-50"
              >
                {removing ? "Removing…" : "Yes, remove member"}
              </button>
              <button
                onClick={() => setConfirmingRemove(false)}
                disabled={removing}
                className="rounded-xl border border-border px-4 py-2 font-body text-sm text-ink hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <p className="font-body text-sm text-ink-muted">
              Permanently removes this member and their sign-in account.
            </p>
            <button
              onClick={() => setConfirmingRemove(true)}
              className="mt-3 rounded-xl border border-red-700 px-4 py-2 font-body text-sm text-red-700 hover:bg-red-50"
            >
              Remove member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
