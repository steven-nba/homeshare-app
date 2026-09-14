import type { BookingRequest, Home, Member, Message } from "@/lib/types";

// Supabase rows are snake_case; app types are camelCase. Keep in sync with
// supabase/schema.sql and lib/types.ts.

export function mapHomeRow(row: any): Home {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    generalLocation: row.general_location,
    amenities: row.amenities ?? [],
    houseRules: row.house_rules,
    careCallout: row.care_callout,
    photoUrls: row.photo_urls ?? [],
    status: row.status,
  };
}

export function mapMemberRow(row: any): Member {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    photoUrl: row.photo_url,
    email: row.email,
    // The `members` table only has rows for people who've completed invite
    // setup, so anyone found here has, by definition, used their invite.
    inviteStatus: "used",
  };
}

export function mapMessageRow(row: any): Message {
  return {
    id: row.id,
    senderId: row.sender_id,
    recipientId: row.recipient_id,
    homeId: row.home_id,
    content: row.content,
    createdAt: row.created_at,
    readAt: row.read_at,
  };
}

export function mapBookingRequestRow(row: any): BookingRequest {
  return {
    id: row.id,
    homeId: row.home_id,
    requesterId: row.requester_id,
    requestedDates: row.requested_dates,
    note: row.note,
    status: row.status,
    createdAt: row.created_at,
  };
}
