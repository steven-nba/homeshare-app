import { mockMembers } from "@/lib/mock-data";
import MessageThread from "@/components/MessageThread";

// TODO: replace with the signed-in member's conversations, grouped by
// counterpart, fetched from Supabase and filtered by RLS automatically.

export default function MessagesPage() {
  const conversations = mockMembers;

  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-white md:grid-cols-3">
      <div className="border-border md:col-span-1 md:border-r">
        <h1 className="p-4 font-display text-xl text-ink">Messages</h1>
        <ul>
          {conversations.map((m) => (
            <li
              key={m.id}
              className="cursor-pointer border-t border-border px-4 py-3 font-body text-sm text-ink hover:bg-stone-50"
            >
              {m.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="h-[500px] md:col-span-2">
        <MessageThread messages={[]} currentUserId="me" />
      </div>
    </div>
  );
}
