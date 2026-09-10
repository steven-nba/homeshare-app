import type { Home, Member } from "./types";

// Placeholder data so the UI is visible during Week 1 before the Supabase
// schema is populated. Replace each usage with a real query — see the
// "// TODO: replace with Supabase query" comments in app/ pages.

export const mockMembers: Member[] = [
  {
    id: "m1",
    name: "Elena Marsh",
    role: "owner",
    bio: "Class of '04. Splits time between the coast and the city.",
    photoUrl: null,
    email: "elena@example.com",
    inviteStatus: "used",
  },
  {
    id: "m2",
    name: "Devon Okafor",
    role: "owner",
    bio: "Class of '99. Loves hosting long dinners on the terrace.",
    photoUrl: null,
    email: "devon@example.com",
    inviteStatus: "used",
  },
];

export const mockHomes: Home[] = [
  {
    id: "h1",
    ownerId: "m1",
    title: "The Blue Door",
    description:
      "A quiet three-bedroom cottage five minutes from the harbor, full of morning light.",
    generalLocation: "Coastal Maine",
    amenities: ["Wifi", "Full kitchen", "Fireplace", "Garden"],
    houseRules: "No smoking indoors. Quiet after 10pm.",
    careCallout: "The tomatoes on the back porch could use water every few days.",
    photoUrls: [],
    status: "published",
  },
  {
    id: "h2",
    ownerId: "m2",
    title: "Casa Terraza",
    description:
      "Sun-filled apartment with a wraparound terrace, walkable to the old town square.",
    generalLocation: "Lisbon, Portugal",
    amenities: ["Wifi", "AC", "Rooftop terrace", "Washer"],
    houseRules: "Please remove shoes indoors.",
    careCallout: null,
    photoUrls: [],
    status: "published",
  },
];
