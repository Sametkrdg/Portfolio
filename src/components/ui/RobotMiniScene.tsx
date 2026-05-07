"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Robot from "@/src/components/canvas/Robot";

/*
 * Tiny dedicated R3F scene for the sticky bottom-right robot.
 *
 * Performance notes:
 *  - dpr={[1,1.6]}     — slightly lower cap than the hero scene; this
 *                        canvas is only ~112px square so retina is overkill
 *  - alpha+transparent — the canvas layers over the page; no clear colour
 *  - frameloop="always" so audio-reactive useFrame keeps ticking even when
 *                        the canvas is "still" between renders
 */
export default function RobotMiniScene() {
  return (
    <Canvas
      /*
       * Camera pulled back to z=5.5 with a tighter fov=35 — the longer focal
       * length flattens perspective distortion (no more "fisheye" head)
       * and gives enough framing room that the whole rig fits cleanly.
       */
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.2, 5.5], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {/*
       * Three-light rig:
       *   - ambient (1.2)        flat fill so no surface goes pure black
       *   - point (4.5, cyan-w)  rim/sci-fi glow from upper right
       *   - directional (3.0)    key light from front-above so the face and
       *                          chest plate read clearly to the visitor
       *   - point (0.9, purple)  small accent to keep the magenta neon vibe
       */}
      <ambientLight intensity={1.2} />
      <pointLight       position={[1, 2, 2]}  intensity={4.5} color="#e0ffff" />
      <directionalLight position={[1, 3, 3]}  intensity={3.0} color="#ffffff" />
      <pointLight       position={[-2, -1, 1]} intensity={0.9} color="#b44dff" />

      <Suspense fallback={null}>
        {/*
         * scale 0.77 = previous 1.1 × 0.7 (30% reduction).
         * y position raised from -1.05 → -0.6 so the feet sit inside the
         * viewport instead of being clipped by the bottom edge.
         * rotation: yawed ~-0.55 rad toward page centre, pitched +0.15 rad
         * so the robot looks slightly upward at the visitor.
         */}
        <Robot
          scale={0.77}
          position={[0, -0.6, 0]}
          rotation={[0.15, -0.55, 0]}
        />
      </Suspense>
    </Canvas>
  );
}
