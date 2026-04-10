import { ShaderAnimation } from "@/components/ui/shader-lines";

export function ShaderLinesDemo() {
  return (
    <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
      <ShaderAnimation />
      <span className="pointer-events-none z-10 text-center text-7xl font-semibold leading-none tracking-tighter text-white whitespace-pre-wrap">
        Shader Lines
      </span>
    </div>
  );
}
