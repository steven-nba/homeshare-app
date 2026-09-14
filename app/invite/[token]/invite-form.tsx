"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InviteForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const res = await fetch(`/api/invite/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        bio: form.get("bio"),
        password: form.get("password"),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: form.get("password") as string,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl text-ink">Set up your account</h1>
      <p className="mt-2 font-body text-sm text-ink-muted">
        You've been invited to join the group. This link is just for you —
        create your account below.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            {error}
          </p>
        )}
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Your name
          </label>
          <input
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Short bio
          </label>
          <textarea
            name="bio"
            rows={2}
            placeholder="A line or two other members will see"
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-ink">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-olive-700 px-4 py-2 font-body text-sm text-stone-50 hover:bg-olive-600 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create my account"}
        </button>
      </form>

      <p className="mt-4 font-body text-xs text-ink-muted">
        Setting up the account for {email}
      </p>
    </div>
  );
}
