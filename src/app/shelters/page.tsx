import Link from "next/link";
import { shelters } from "@/lib/store";

export default function SheltersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-bark">Shelters & Rescues</h1>
      <p className="mt-2 text-stone-600">
        Partner organizations in the Rutgers New Brunswick area. Shelter members can see cat
        locations and coordinate rescues.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {shelters.map((shelter) => (
          <div key={shelter.id} className="card">
            <h2 className="font-display text-xl font-semibold text-bark">{shelter.name}</h2>
            <p className="mt-2 text-sm text-stone-600">{shelter.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="rounded bg-stone-100 px-2 py-1">
                Capacity: {shelter.currentCount} / {shelter.capacity}
              </span>
              <span className="text-stone-500">
                {shelter.city}, {shelter.state}
              </span>
            </div>
            {shelter.phone && (
              <p className="mt-2 text-sm text-stone-500">📞 {shelter.phone}</p>
            )}
            <Link
              href={`/shelters/${shelter.slug}`}
              className="mt-4 inline-block text-sm font-medium text-scarlet-600 hover:underline"
            >
              View details →
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-xl border border-scarlet-200 bg-scarlet-50 p-6">
        <h3 className="font-display font-semibold text-bark">Want to join as a shelter?</h3>
        <p className="mt-2 text-sm text-stone-600">
          Verified shelters get access to exact cat locations, rescue coordination, and capacity
          tools. Membership is $5/month or $50/year.
        </p>
        <Link href="/membership" className="btn-primary mt-4">
          Membership for shelters
        </Link>
      </div>
    </div>
  );
}
