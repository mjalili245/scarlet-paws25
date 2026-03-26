import type { CatSighting } from "@/types";

interface SightingCardProps {
  sighting: CatSighting | (Omit<CatSighting, "location"> & { areaLabel: string });
  showLocation?: boolean;
  onClaim?: (id: string) => void;
  isShelter?: boolean;
}

export function SightingCard({
  sighting,
  showLocation = false,
  onClaim,
  isShelter,
}: SightingCardProps) {
  const hasLocation = "location" in sighting && sighting.location;
  const location = hasLocation ? (sighting as CatSighting).location : null;

  return (
    <article className="card overflow-hidden">
      <div className="aspect-video bg-stone-200 flex items-center justify-center text-4xl">
        {sighting.photoUrl.startsWith("/") ? "🐱" : "🐱"}
      </div>
      <div className="mt-4">
        <p className="text-sm text-stone-600 line-clamp-2">{sighting.description}</p>
        <p className="mt-2 text-xs font-medium text-stone-500">
          Area: {sighting.areaLabel}
        </p>
        {showLocation && location && (
          <p className="mt-1 text-xs text-sage">
            📍 {location.address ?? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              sighting.status === "rescued"
                ? "bg-green-100 text-green-800"
                : sighting.status === "claimed"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-stone-100 text-stone-700"
            }`}
          >
            {sighting.status}
          </span>
          {isShelter && sighting.status === "pending" && onClaim && (
            <button
              type="button"
              onClick={() => onClaim(sighting.id)}
              className="text-xs font-medium text-scarlet-600 hover:underline"
            >
              Claim rescue
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
