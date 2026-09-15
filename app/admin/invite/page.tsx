"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

export default function InviteMemberPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("owner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("invites")
      .insert({ email, role })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setInviteLink(`${window.location.origin}/invite/${data.token}`);
  }

  async function handleCopy() {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission can be denied (e.g. insecure context, browser
      // settings). Fall back to selecting the text so the admin can copy
      // it manually.
      linkInputRef.current?.select();
    }
  }

  function handleCreateAnother() {
    setEmail("");
    setRole("owner");
    setInviteLink(null);
    setCopied(false);
  }

  return (
    <div className="mx-auto max-w-md">
      <Link
        href="/admin"
        className="font-body text-sm text-olive-700 hover:underline"
      >
        ← Back to admin
      </Link>

      <h1 className="mt-4 font-display text-2xl text-ink">Invite a member</h1>
      <p className="mt-2 font-body text-sm text-ink-muted">
        Creates an invite link. Send it to them yourself — there's no email
        sending yet.
      </p>

      {inviteLink ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-olive-50 p-4 font-body text-sm text-olive-900">
            Invite created for {email}.
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-ink">
              Invite link
            </label>
            <div className="mt-1 flex gap-2">
              <input
                ref={linkInputRef}
                readOnly
                value={inviteLink}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-xl bg-olive-700 px-4 py-2 font-body text-sm text-stone-50 hover:bg-olive-600"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <button
            onClick={handleCreateAnother}
            className="font-body text-sm text-olive-700 hover:underline"
          >
            Create another invite
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
              {error}
            </p>
          )}
          <div>
            <label className="block font-body text-sm font-medium text-ink">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            disabled={loading}
            className="w-full rounded-xl bg-olive-700 px-4 py-2 font-body text-sm text-stone-50 hover:bg-olive-600 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create invite"}
          </button>
        </form>
      )}
    </div>
  );
}
