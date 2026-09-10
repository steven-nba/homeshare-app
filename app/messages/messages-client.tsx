"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MessageThread from "@/components/MessageThread";
import type { Member, Message } from "@/lib/types";

export default function MessagesClient({
  conversations,
  messages,
  currentUserId,
}: {
  conversations: Member[];
  messages: Message[];
  currentUserId: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    conversations[0]?.id ?? null
  );
  const [thread, setThread] = useState<Message[]>(messages);

  const threadMessages = selectedId
    ? thread.filter(
        (m) => m.senderId === selectedId || m.recipientId === selectedId
      )
    : [];

  async function handleSend(content: string) {
    if (!selectedId) return;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUserId,
        recipient_id: selectedId,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to send message:", error.message);
      return;
    }

    setThread((prev) => [
      ...prev,
      {
        id: data.id,
        senderId: data.sender_id,
        recipientId: data.recipient_id,
        homeId: data.home_id,
        content: data.content,
        createdAt: data.created_at,
        readAt: data.read_at,
      },
    ]);
  }

  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-white md:grid-cols-3">
      <div className="border-border md:col-span-1 md:border-r">
        <h1 className="p-4 font-display text-xl text-ink">Messages</h1>
        {conversations.length === 0 ? (
          <p className="px-4 pb-4 font-body text-sm text-ink-muted">
            No conversations yet.
          </p>
        ) : (
          <ul>
            {conversations.map((m) => (
              <li
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`cursor-pointer border-t border-border px-4 py-3 font-body text-sm hover:bg-stone-50 ${
                  m.id === selectedId ? "bg-stone-50 text-ink" : "text-ink"
                }`}
              >
                {m.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="h-[500px] md:col-span-2">
        <MessageThread
          messages={threadMessages}
          currentUserId={currentUserId}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
