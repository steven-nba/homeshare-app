"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";

export default function MessageThread({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId: string;
}) {
  const [draft, setDraft] = useState("");

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: insert into `messages` via Supabase.
    setDraft("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <div
              key={m.id}
              className={`max-w-[75%] rounded-2xl px-4 py-2 font-body text-sm ${
                mine
                  ? "ml-auto bg-olive-700 text-stone-50"
                  : "bg-stone-100 text-ink"
              }`}
            >
              {m.content}
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-border p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 rounded-xl border border-border px-3 py-2 font-body text-sm"
        />
        <button
          type="submit"
          className="rounded-xl bg-olive-700 px-4 py-2 font-body text-sm text-stone-50 hover:bg-olive-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
