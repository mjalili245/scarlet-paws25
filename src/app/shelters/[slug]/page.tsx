import Link from "next/link";
import { notFound } from "next/navigation";
import { getShelterBySlug } from "@/lib/store";

export default async function ShelterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getShelterBySlug(slug);
  if (!s) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/shelters" className="text-sm text-scarlet-600 hover:underline">
        ← Shelters & rescues
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-bark">{s.name}</h1>
      <p className="mt-2 text-stone-600">{s.description}</p>
      <div className="mt-6 card">
        <h3 className="font-semibold text-bark">Details</h3>
        <ul className="mt-3 space-y-2 text-sm text-stone-600">
          <li>Capacity: {s.currentCount} / {s.capacity}</li>
          <li>Address: {s.address}, {s.city}, {s.state} {s.zip}</li>
          {s.phone && <li>Phone: {s.phone}</li>}
        </ul>
      </div>
    </div>
  );
}
