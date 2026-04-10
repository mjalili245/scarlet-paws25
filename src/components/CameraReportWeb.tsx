"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DESCRIPTION_PLACEHOLDER =
  "Friendly orange tabby near parking lot. Looks hungry.";
const AREA_PLACEHOLDER = "e.g. College Ave / Easton Ave, Rutgers campus";

export function CameraReportWeb() {
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Healthy");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLive, setCameraLive] = useState(false);
  const [cameraRequesting, setCameraRequesting] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current = null;
    const v = videoRef.current;
    if (v) v.srcObject = null;
    setCameraLive(false);
    setCameraRequesting(false);
  }, []);

  const requestCameraAccess = useCallback(async () => {
    setCameraError(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not available in this browser.");
      return;
    }
    setCameraRequesting(true);
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current = null;
    const v = videoRef.current;
    if (v) v.srcObject = null;
    setCameraLive(false);

    const attach = async (stream: MediaStream) => {
      cameraStreamRef.current = stream;
      const el = videoRef.current;
      if (el) {
        el.srcObject = stream;
        await el.play().catch(() => {});
      }
      setCameraLive(true);
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      await attach(stream);
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        await attach(stream);
      } catch (err2) {
        setCameraError(
          err2 instanceof Error
            ? err2.message
            : "Could not access the camera. Allow permission when prompted, and use HTTPS."
        );
      }
    } finally {
      setCameraRequesting(false);
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <section
      id="report-camera"
      aria-labelledby="report-camera-heading"
      className="rounded-2xl border border-stone-700/80 bg-stone-950/90 p-6 shadow-xl backdrop-blur-sm md:p-8"
    >
      <h2 id="report-camera-heading" className="font-display text-2xl font-bold text-white md:text-3xl">
        Report a sighting
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-stone-400">
        Use your real device camera on this page (not inside the app preview below). Tap{" "}
        <span className="text-stone-200">Access camera</span>, allow the browser prompt, then fill in the details.
      </p>

      <div
        className={`relative mt-6 w-full overflow-hidden rounded-xl border border-stone-600 bg-black ${
          cameraLive ? "aspect-video max-h-[min(70vh,560px)] min-h-[240px]" : "aspect-video min-h-[280px] max-h-[480px]"
        }`}
      >
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover ${cameraLive ? "opacity-100" : "opacity-0"}`}
          playsInline
          muted
          autoPlay
        />

        {!cameraLive && !cameraError && !cameraRequesting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-stone-900 to-black p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-stone-600 bg-stone-900/80">
              <svg
                className="h-10 w-10 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.25}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-.873H9.739a2.192 2.192 0 00-1.736.873l-.822 1.316z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => void requestCameraAccess()}
              className="rounded-xl bg-scarlet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-scarlet-700 focus:outline-none focus:ring-2 focus:ring-scarlet-500 focus:ring-offset-2 focus:ring-offset-stone-950"
            >
              Access camera
            </button>
            <p className="max-w-md text-center text-xs text-stone-500">
              Your browser will ask for permission. On iPhone, use Safari and tap Allow.
            </p>
          </div>
        )}

        {cameraRequesting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 backdrop-blur-sm">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-scarlet-500 border-t-transparent" />
            <p className="text-sm text-stone-200">Opening camera…</p>
          </div>
        )}

        {cameraError && !cameraRequesting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-6 text-center">
            <p className="text-sm text-stone-300">{cameraError}</p>
            <button
              type="button"
              onClick={() => void requestCameraAccess()}
              className="rounded-xl bg-scarlet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-scarlet-700"
            >
              Try again
            </button>
          </div>
        )}

        {cameraLive && (
          <>
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live
            </div>
            <button
              type="button"
              onClick={() => stopCamera()}
              className="absolute bottom-4 right-4 rounded-full bg-black/65 px-4 py-2 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/80"
            >
              Stop camera
            </button>
          </>
        )}
      </div>

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          // Demo only — wire to API later
          alert(
            `Demo submit:\nArea: ${area || "(empty)"}\nDescription: ${description || "(empty)"}\nCondition: ${condition}`
          );
        }}
      >
        <div>
          <label htmlFor="sighting-area" className="mb-1.5 block text-sm font-medium text-stone-300">
            Area
          </label>
          <input
            id="sighting-area"
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder={AREA_PLACEHOLDER}
            autoComplete="street-address"
            className="w-full rounded-lg border border-stone-600 bg-stone-900/80 px-3 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-scarlet-500 focus:outline-none focus:ring-1 focus:ring-scarlet-500"
          />
        </div>

        <div>
          <label htmlFor="sighting-description" className="mb-1.5 block text-sm font-medium text-stone-300">
            What did you see?
          </label>
          <textarea
            id="sighting-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={DESCRIPTION_PLACEHOLDER}
            rows={4}
            className="w-full resize-y rounded-lg border border-stone-600 bg-stone-900/80 px-3 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-scarlet-500 focus:outline-none focus:ring-1 focus:ring-scarlet-500"
          />
          <p className="mt-1 text-xs text-stone-500">The gray example text disappears when you start typing.</p>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-stone-300">Condition</span>
          <div className="flex flex-wrap gap-2">
            {["Healthy", "Sickly", "Injured", "Needs Urgent Help"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(c)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  condition === c
                    ? "border-scarlet-500 bg-scarlet-600/30 text-white"
                    : "border-stone-600 bg-stone-900/60 text-stone-300 hover:border-stone-500"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-3 text-base md:w-auto md:px-10">
          Submit sighting
        </button>
      </form>
    </section>
  );
}
