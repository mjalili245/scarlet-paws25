import type { User, Shelter, CatSighting } from "@/types";

// In-memory store for MVP. Replace with a real DB (e.g. Prisma + SQLite/Postgres) later.
export const users: Record<string, User> = {
  demo: {
    id: "demo",
    email: "demo@example.com",
    name: "Demo User",
    role: "public",
    membership: "none",
  },
  shelter1: {
    id: "shelter1",
    email: "shelter@nbrescue.org",
    name: "NB Rescue",
    role: "shelter",
    membership: "yearly",
    shelterId: "nb-rescue",
    shelterName: "New Brunswick Cat Rescue",
  },
};

export const shelters: Shelter[] = [
  {
    id: "nb-rescue",
    name: "New Brunswick Cat Rescue",
    slug: "nb-rescue",
    description: "TNR and adoption for community cats in the Rutgers area.",
    capacity: 30,
    currentCount: 18,
    address: "123 George St",
    city: "New Brunswick",
    state: "NJ",
    zip: "08901",
    phone: "(732) 555-0123",
  },
  {
    id: "scarlet-shelter",
    name: "Scarlet Paws Shelter",
    slug: "scarlet-paws-shelter",
    description: "Partner shelter for Scarlet Paws rescue coordination.",
    capacity: 25,
    currentCount: 22,
    address: "456 Easton Ave",
    city: "New Brunswick",
    state: "NJ",
    zip: "08901",
    phone: "(732) 555-0456",
  },
];

export const catSightings: CatSighting[] = [
  {
    id: "1",
    photoUrl: "/placeholder-cat.jpg",
    description: "Orange tabby near dumpster, appears friendly.",
    location: { lat: 40.5008, lng: -74.4474, address: "Near Brower Commons" },
    areaLabel: "Rutgers College Ave",
    reportedAt: new Date().toISOString(),
    reportedBy: "demo",
    status: "pending",
  },
  {
    id: "2",
    photoUrl: "/placeholder-cat.jpg",
    description: "Small black cat, skittish. Seen multiple days.",
    location: { lat: 40.4968, lng: -74.4482, address: "Behind student center" },
    areaLabel: "Downtown New Brunswick",
    reportedAt: new Date(Date.now() - 86400000).toISOString(),
    reportedBy: "demo",
    status: "claimed",
    claimedBy: "shelter1",
    shelterId: "nb-rescue",
  },
];

export function getShelterById(id: string) {
  return shelters.find((s) => s.id === id);
}

export function getShelterBySlug(slug: string) {
  return shelters.find((s) => s.slug === slug) ?? null;
}

export function getSightingsForPublic(): Omit<CatSighting, "location">[] {
  return catSightings.map(({ location: _, ...rest }) => ({
    ...rest,
    areaLabel: rest.areaLabel,
  }));
}

export function getSightingsForShelter(): CatSighting[] {
  return [...catSightings];
}
