import Link from "next/link";

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-bark">Shelter membership</h1>
      <p className="mt-2 text-stone-600">
        For cat rescue organizations and shelters in the Rutgers New Brunswick area. Membership
        lets you see exact cat locations and coordinate rescues.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="card border-2 border-scarlet-200">
          <h2 className="font-display text-xl font-semibold text-bark">Monthly</h2>
          <p className="mt-2 text-3xl font-bold text-scarlet-600">$5 <span className="text-lg font-normal text-stone-500">/ month</span></p>
          <ul className="mt-6 space-y-2 text-sm text-stone-600">
            <li>✓ View exact cat locations</li>
            <li>✓ Claim and coordinate rescues</li>
            <li>✓ See shelter capacity (yours & partners)</li>
            <li>✓ Reduce spam and duplicate reports</li>
          </ul>
          <button type="button" className="btn-primary mt-6 w-full">
            Subscribe $5/month
          </button>
        </div>
        <div className="card border-2 border-scarlet-500 bg-scarlet-50/50">
          <span className="rounded bg-scarlet-600 px-2 py-0.5 text-xs font-medium text-white">
            Save $10
          </span>
          <h2 className="mt-3 font-display text-xl font-semibold text-bark">Yearly</h2>
          <p className="mt-2 text-3xl font-bold text-scarlet-600">$50 <span className="text-lg font-normal text-stone-500">/ year</span></p>
          <ul className="mt-6 space-y-2 text-sm text-stone-600">
            <li>✓ Everything in Monthly</li>
            <li>✓ Prepay and save</li>
          </ul>
          <button type="button" className="btn-primary mt-6 w-full">
            Prepay $50/year
          </button>
        </div>
      </div>

      <div className="mt-12 card">
        <h3 className="font-display font-semibold text-bark">Who is this for?</h3>
        <p className="mt-2 text-sm text-stone-600">
          Cat rescue organizations, TNR groups, and animal shelters that want to respond to
          community reports efficiently. We verify shelter affiliation before granting access
          to locations. This keeps reports reliable and reduces spam.
        </p>
        <p className="mt-4 text-sm text-stone-600">
          <strong>Reporting cats is free.</strong> Anyone can upload a photo and report a cat
          in need—only members see where to find them.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-stone-500">
        Payment integration (Stripe) can be added. This demo shows the membership structure.
      </p>
    </div>
  );
}
