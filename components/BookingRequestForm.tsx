"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Rev0 booking request: rough dates + a note, sent to the owner for
// approval. No live calendar yet — that's Stage 2 (see project plan).
export default function BookingRequestForm({ homeId }: { homeId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sign in to request a stay.");
      return;
    }

    const { error: insertError } = await supabase
      .from("booking_requests")
      .insert({
        home_id: homeId,
        requester_id: user.id,
        requested_dates: form.get("dates") as string,
        note: (form.get("note") as string) || null,
        status: "pending",
      });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-olive-50 p-4 font-body text-sm text-olive-900">
        Request sent. The owner will follow up here once they respond.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      )}
      <div>
        <label
          htmlFor="dates"
          className="block font-body text-sm font-medium text-ink"
        >
          Dates you're hoping for
        </label>
        <input
          id="dates"
          name="dates"
          type="text"
          required
          placeholder="e.g. Oct 10–17"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
        />
      </div>
      <div>
        <label
          htmlFor="note"
          className="block font-body text-sm font-medium text-ink"
        >
          Note to the owner (optional)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 font-body text-sm text-ink"
        />
      </div>
      <input type="hidden" name="homeId" value={homeId} />
      <button
        type="submit"
        className="rounded-xl bg-olive-700 px-5 py-2 font-body text-sm text-stone-50 hover:bg-olive-600"
      >
        Request to stay
      </button>
    </form>
  );
}
