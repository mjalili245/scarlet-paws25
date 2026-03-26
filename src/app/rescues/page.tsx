"use client";

import { useAuth } from "@/components/AuthProvider";
import { SightingCard } from "@/components/SightingCard";
import { getSightingsForShelter } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RescuesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sightings, setSightings] = useState(getSightingsForShelter());

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
    if (user.role !== "shelter" || user.membership === "none") {
      router.replace("/membership");
    }
  }, [user, router]);

  const handleClaim = (id: string) => {
    setSightings((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "claimed" as const,
              claimedBy: user?.id,
              shelterId: user?.shelterId,
            }
          : s
      )
    );
  };

  if (!user || user.role !== "shelter") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-stone-600">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-bark">Rescue board</h1>
      <p className="mt-2 text-stone-600">
        Cats reported in the area. Exact locations are visible to your shelter. Claim a rescue
        to coordinate.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sightings.map((s) => (
          <SightingCard
            key={s.id}
            sighting={s}
            showLocation={true}
            onClaim={handleClaim}
            isShelter={true}
          />
        ))}
      </div>
      <div className="mt-8 card border-sage/30 bg-sage/5">
        <h3 className="font-semibold text-bark">Shelter capacity</h3>
        <p className="mt-2 text-sm text-stone-600">
          <Link href="/shelters" className="text-scarlet-600 hover:underline">
            View all shelters
          </Link>{" "}
          to see capacity and coordinate with other organizations.
        </p>
      </div>
    </div>
  );
}
