// Shared types matching the Rev0 data model.
// Keep these in sync with supabase/schema.sql.

export type UserRole = "owner" | "admin" | "superadmin";

export interface Member {
  id: string;
  name: string;
  role: UserRole;
  bio: string | null;
  photoUrl: string | null;
  email: string;
  inviteStatus: "sent" | "used" | "expired";
}

export interface Home {
  id: string;
  ownerId: string;
  title: string; // e.g. "The Blue Door, Ubud"
  description: string;
  generalLocation: string; // town/region — never a street address
  amenities: string[];
  houseRules: string;
  careCallout: string | null; // e.g. "Please water the herb garden twice a week"
  photoUrls: string[]; // up to 10
  status: "draft" | "published";
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  homeId: string | null; // optional context, e.g. inquiry about a specific home
  content: string;
  createdAt: string;
  readAt: string | null;
}

export type BookingRequestStatus = "pending" | "approved" | "denied";

export interface BookingRequest {
  id: string;
  homeId: string;
  requesterId: string;
  requestedDates: string; // free text for Rev0 (e.g. "Oct 10-17"); becomes a real range in Stage 2
  note: string | null;
  status: BookingRequestStatus;
  createdAt: string;
}

export interface Invite {
  id: string;
  email: string;
  token: string;
  role: UserRole;
  status: "sent" | "used" | "expired";
}
