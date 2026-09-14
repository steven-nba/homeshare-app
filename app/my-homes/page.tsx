import { createClient } from "@/lib/supabase/server";
import {
  mapBookingRequestRow,
  mapHomeRow,
  mapMemberRow,
} from "@/lib/supabase/mappers";
import MyHomesClient from "./my-homes-client";

export default async function MyHomesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center font-body text-sm text-ink-muted">
        Sign in to see requests for your homes.
      </div>
    );
  }

  const { data: homeRows, error: homesError } = await supabase
    .from("homes")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (homesError) {
    console.error("Failed to load homes:", homesError.message);
  }

  const homes = (homeRows ?? []).map(mapHomeRow);
  const homeIds = homes.map((h) => h.id);

  const { data: requestRows } = homeIds.length
    ? await supabase
        .from("booking_requests")
        .select("*")
        .in("home_id", homeIds)
        .order("created_at", { ascending: false })
    : { data: [] as any[] };

  const requests = (requestRows ?? []).map(mapBookingRequestRow);

  const requesterIds = Array.from(
    new Set(requests.map((r) => r.requesterId))
  );

  const { data: requesterRows } = requesterIds.length
    ? await supabase.from("members").select("*").in("id", requesterIds)
    : { data: [] as any[] };

  const requesters = (requesterRows ?? []).map(mapMemberRow);

  return (
    <MyHomesClient homes={homes} requests={requests} requesters={requesters} />
  );
}
