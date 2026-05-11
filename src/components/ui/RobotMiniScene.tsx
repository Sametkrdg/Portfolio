"use client";

import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Suspense } from "react";
import Robot from "@/src/components/canvas/Robot";
import ErrorBoundary from "@/src/components/utils/ErrorBoundary";

/*
 * Tiny dedicated R3F scene for the sticky bottom-right robot.
 *
 * Resilience layers:
 *   - <ErrorBoundary>  catches WebGL context-lost + Robot render crashes
 *                      → renders the fallback panel instead of an invisible
 *                        broken button
 *   - <Suspense Html>  while the GLB streams from R2, render a small DOM
 *                      label inside the canvas so the user sees feedback
 *                      (Robot's useGLTF would otherwise suspend silently)
 *
 * Performance notes:
 *  - dpr={[1,1.5]}     consistent with the hero scene
 *  - alpha+transparent the canvas layers over the page; no clear colour
 *  - frameloop="always" implicit; audio-reactive useFrame keeps ticking
 */
export default function RobotMiniScene() {
  return (
    <ErrorBoundary
      fallback={
        /* Compact fallback sized to the sticky robot's container: keeps the
         * button visible so the user can still open the chat — minus the 3D. */
        <div
          role="alert"
          className="flex h-full w-full items-center justify-center rounded-full text-[10px] font-semibold tracking-wider text-cyan-300"
          style={{
            background: "rgba(5, 8, 15, 0.7)",
            border:     "1px solid rgba(0,217,255,0.2)",
          }}
        >
          AI
        </div>
      }
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.2, 5.5], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        {/* Three-light rig — see commits for tuning rationale */}
        <ambientLight intensity={1.2} />
        <pointLight       position={[1, 2, 2]}   intensity={4.5} color="#e0ffff" />
        <directionalLight position={[1, 3, 3]}   intensity={3.0} color="#ffffff" />
        <pointLight       position={[-2, -1, 1]} intensity={0.9} color="#b44dff" />

        <Suspense
          fallback={
            <Html center>
              <span className="text-[10px] font-semibold tracking-widest text-cyan-400">
                Loading 3D…
              </span>
            </Html>
          }
        >
          {/* scale 0.77 = previous 1.1 × 0.7 (30 % reduction).
            * y -0.6 keeps the feet inside the viewport.
            * rotation [.15,-.55,0]: looks up & turns toward page centre. */}
          <Robot
            scale={0.77}
            position={[0, -0.6, 0]}
            rotation={[0.15, -0.55, 0]}
          />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
