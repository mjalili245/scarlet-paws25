"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [areaLabel, setAreaLabel] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-4xl">✅</div>
        <h2 className="mt-4 font-display text-2xl font-bold text-bark">Report received</h2>
        <p className="mt-2 text-stone-600">
          Thank you. Shelters with membership will see the location and can coordinate a rescue.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-bark">Report a cat in need</h1>
      <p className="mt-2 text-stone-600">
        Anyone can report. You can upload a photo and describe where you saw the cat. Exact
        location is only shared with verified shelters.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 card space-y-4">
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-bark">
            Photo (optional)
          </label>
          <div className="mt-2 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 text-stone-500">
            Click or drag to upload — placeholder for file upload
          </div>
        </div>
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-bark">
            General area *
          </label>
          <input
            id="area"
            type="text"
            required
            value={areaLabel}
            onChange={(e) => setAreaLabel(e.target.value)}
            placeholder="e.g. Rutgers College Ave, Downtown NB"
            className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-scarlet-500 focus:outline-none focus:ring-1 focus:ring-scarlet-500"
          />
        </div>
        <div>
          <label htmlFor="desc" className="block text-sm font-medium text-bark">
            Description *
          </label>
          <textarea
            id="desc"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="e.g. Orange tabby near dumpster, appears friendly."
            className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:border-scarlet-500 focus:outline-none focus:ring-1 focus:ring-scarlet-500"
          />
        </div>
        <p className="text-xs text-stone-500">
          Your report will be visible to the public by area only. Exact location is captured
          for shelters (e.g. via browser geolocation with your permission) and only shown to
          shelter members.
        </p>
        <button type="submit" className="btn-primary w-full">
          Submit report
        </button>
      </form>
    </div>
  );
}
