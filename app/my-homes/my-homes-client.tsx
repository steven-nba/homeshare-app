"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BookingRequest, Home, Member } from "@/lib/types";

const statusStyles: Record<BookingRequest["status"], string> = {
  pending: "bg-gold-100 text-ink",
  approved: "bg-olive-100 text-olive-700",
  denied: "bg-stone-200 text-ink-muted",
};

export default function MyHomesClient({
  homes,
  requests: initialRequests,
  requesters,
}: {
  homes: Home[];
  requests: BookingRequest[];
  requesters: Member[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requesterById = new Map(requesters.map((r) => [r.id, r]));

  async function handleUpdate(
    requestId: string,
    status: "approved" | "denied"
  ) {
    setError(null);
    setPendingId(requestId);
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("booking_requests")
      .update({ status })
      .eq("id", requestId);

    setPendingId(null);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  }

  if (homes.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center font-body text-sm text-ink-muted">
        You don't have any listings yet. Once you host a home, requests to
        stay will show up here.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">My homes</h1>
        <p className="mt-2 font-body text-ink-muted">
          Requests to stay at homes you host.
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-8">
        {homes.map((home) => {
          const homeRequests = requests.filter((r) => r.homeId === home.id);

          return (
            <div
              key={home.id}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <h2 className="font-display text-xl text-ink">{home.title}</h2>
              <p className="mt-1 font-body text-sm text-ink-muted">
                {home.generalLocation}
              </p>

              {homeRequests.length === 0 ? (
                <p className="mt-4 font-body text-sm text-ink-muted">
                  No requests yet.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {homeRequests.map((req) => {
                    const requester = requesterById.get(req.requesterId);

                    return (
                      <li
                        key={req.id}
                        className="rounded-xl border border-border p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-body text-sm text-ink">
                            <span className="font-medium">
                              {requester?.name ?? "A member"}
                            </span>{" "}
                            — {req.requestedDates}
                          </p>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${statusStyles[req.status]}`}
                          >
                            {req.status}
                          </span>
                        </div>

                        {req.note && (
                          <p className="mt-2 font-body text-sm text-ink-muted">
                            "{req.note}"
                          </p>
                        )}

                        {req.status === "pending" && (
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => handleUpdate(req.id, "approved")}
                              disabled={pendingId === req.id}
                              className="rounded-xl bg-olive-700 px-4 py-2 font-body text-sm text-stone-50 hover:bg-olive-600 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdate(req.id, "denied")}
                              disabled={pendingId === req.id}
                              className="rounded-xl border border-border px-4 py-2 font-body text-sm text-ink hover:bg-stone-50 disabled:opacity-50"
                            >
                              Deny
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
