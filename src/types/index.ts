export type UserRole = "public" | "shelter";

export type MembershipPlan = "none" | "monthly" | "yearly";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  membership: MembershipPlan;
  shelterId?: string;
  shelterName?: string;
}

export interface Shelter {
  id: string;
  name: string;
  slug: string;
  description: string;
  capacity: number;
  currentCount: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
}

export interface CatSighting {
  id: string;
  photoUrl: string;
  description: string;
  /** Only visible to shelter members */
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  /** Area label shown to public (e.g. "Rutgers campus", "Downtown NB") */
  areaLabel: string;
  reportedAt: string;
  reportedBy: string;
  status: "pending" | "claimed" | "rescued";
  claimedBy?: string;
  shelterId?: string;
}
