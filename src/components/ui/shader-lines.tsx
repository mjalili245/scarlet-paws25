"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THREE: any;
  }
}

type ThreeSceneRef = {
  // Loaded from CDN at runtime; keep loose typing for Three.js r89 globals
  camera: unknown;
  scene: unknown;
  renderer: { dispose: () => void } | null;
  uniforms: { time: { value: number }; resolution: { value: { x: number; y: number } } } | null;
  animationId: number | null;
  onResize: (() => void) | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThreeGlobal = any;

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeSceneRef>({
    camera: null,
    scene: null,
    renderer: null,
    uniforms: null,
    animationId: null,
    onResize: null,
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js";

    const initThreeJS = () => {
      const container = containerRef.current;
      const THREE = window.THREE as ThreeGlobal | undefined;
      if (!container || !THREE) return;

      container.innerHTML = "";

      const camera = new THREE.Camera();
      camera.position.z = 1;

      const scene = new THREE.Scene();
      const geometry = new THREE.PlaneBufferGeometry(2, 2);

      const uniforms = {
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() },
      };

      const vertexShader = `
        void main() {
          gl_Position = vec4( position, 1.0 );
        }
      `;

      // Note: removed unused "varying vec2 vUv" from original — it was never set in the vertex shader and breaks WebGL compile.
      const fragmentShader = `
        #define TWO_PI 6.2831853072
        #define PI 3.14159265359

        precision highp float;
        uniform vec2 resolution;
        uniform float time;

        float random (in float x) {
            return fract(sin(x)*1e4);
        }
        float random (vec2 st) {
            return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))*
                  43758.5453123);
        }

        void main(void) {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

          vec2 fMosaicScal = vec2(4.0, 2.0);
          vec2 vScreenSize = vec2(256,256);
          uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
          uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

          float t = time*0.06+random(uv.x)*0.4;
          float lineWidth = 0.0008;

          vec3 color = vec3(0.0);
          for(int j = 0; j < 3; j++){
            for(int i=0; i < 5; i++){
              color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));
            }
          }

          gl_FragColor = vec4(color[2],color[1],color[0],1.0);
        }
      `;

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const onWindowResize = () => {
        const rect = container.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width));
        const h = Math.max(1, Math.floor(rect.height));
        renderer.setSize(w, h);
        uniforms.resolution.value.x = renderer.domElement.width;
        uniforms.resolution.value.y = renderer.domElement.height;
      };

      onWindowResize();
      window.addEventListener("resize", onWindowResize, false);

      sceneRef.current = {
        camera,
        scene,
        renderer,
        uniforms,
        animationId: null,
        onResize: onWindowResize,
      };

      const animate = () => {
        sceneRef.current.animationId = requestAnimationFrame(animate);
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
      };

      animate();
    };

    if (window.THREE) {
      initThreeJS();
    } else {
      script.onload = () => {
        initThreeJS();
      };
      document.head.appendChild(script);
    }

    return () => {
      const ref = sceneRef.current;
      if (ref.animationId != null) {
        cancelAnimationFrame(ref.animationId);
      }
      if (ref.onResize) {
        window.removeEventListener("resize", ref.onResize, false);
      }
      if (ref.renderer) {
        ref.renderer.dispose();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      sceneRef.current = {
        camera: null,
        scene: null,
        renderer: null,
        uniforms: null,
        animationId: null,
        onResize: null,
      };
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
