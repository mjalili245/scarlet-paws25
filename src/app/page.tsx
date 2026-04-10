import { CameraReportWeb } from "@/components/CameraReportWeb";
import { MobileAppShell } from "@/components/MobileAppShell";
import { ShaderAnimation } from "@/components/ui/shader-lines";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      <div className="pointer-events-none fixed inset-0 opacity-40" aria-hidden>
        <ShaderAnimation />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 md:max-w-5xl md:py-12">
        <CameraReportWeb />

        <section aria-label="App preview" className="mt-14 md:mt-20">
          <p className="mb-4 text-center text-sm text-stone-500">
            App preview — map, feed, organizations (mobile-style UI)
          </p>
          <div className="flex justify-center pb-10">
            <MobileAppShell />
          </div>
        </section>
      </main>
    </div>
  );
}
