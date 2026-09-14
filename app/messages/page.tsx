import { createClient } from "@/lib/supabase/server";
import { mapMemberRow, mapMessageRow } from "@/lib/supabase/mappers";
import MessagesClient from "./messages-client";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { to?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center font-body text-sm text-ink-muted">
        Sign in to see your messages.
      </div>
    );
  }

  const { data: messageRows, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load messages:", error.message);
  }

  const messages = (messageRows ?? []).map(mapMessageRow);

  const partnerIds = new Set(
    messages.map((m) => (m.senderId === user.id ? m.recipientId : m.senderId))
  );

  // A "Message <owner>" link can point here before any messages exist yet —
  // make sure that person shows up as a conversation even with no history.
  if (searchParams.to) {
    partnerIds.add(searchParams.to);
  }

  const { data: memberRows } = partnerIds.size
    ? await supabase.from("members").select("*").in("id", Array.from(partnerIds))
    : { data: [] as any[] };

  const conversations = (memberRows ?? []).map(mapMemberRow);

  return (
    <MessagesClient
      conversations={conversations}
      messages={messages}
      currentUserId={user.id}
      initialSelectedId={searchParams.to ?? null}
    />
  );
}
