"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import type { Group } from "three";
import { getAssetUrl } from "@/src/utils/getAssetUrl";
import Robot from "./Robot";

const HDR_URL   = getAssetUrl("hero-env.hdr");

interface Props {
  analyserRef?: React.MutableRefObject<AnalyserNode | null>;
}

/*
 * Procedural star field — audio-reactive scale when music is playing.
 * Purely ref-based: no setState in useFrame.
 */
function StarField({ analyserRef }: Props) {
  const groupRef  = useRef<Group>(null);
  const dataArray = useMemo(() => new Uint8Array(128), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    let bassNorm = 0;
    if (analyserRef?.current) {
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < 4; i++) sum += dataArray[i];
      bassNorm = sum / (4 * 255);
    }

    groupRef.current.scale.setScalar(1 + bassNorm * 0.1);
    groupRef.current.rotation.y  = t * 0.018;
    groupRef.current.rotation.x  = Math.sin(t * 0.008) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Stars radius={120} depth={60} count={3500} factor={4} saturation={0.15} fade speed={0.5} />
    </group>
  );
}

/*
 * Exported as the lazy-load target — imported via next/dynamic with ssr:false.
 *
 * Architecture notes:
 *  - dpr={[1,2]}          caps DPR at retina; prevents 4× fill on high-density displays
 *  - antialias: false     saves ~30% GPU fill on particle-heavy scenes
 *  - Environment          sets the HDRI as a real scene background (skybox)
 *  - Robot in <Suspense>  GLB fetch never blocks the initial paint
 */
export default function HeroCanvas({ analyserRef }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 4.5], fov: 52 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      {/* Night-sky HDRI: background=true replaces the default clear colour */}
      <Environment files={HDR_URL} background={true} />

      <ambientLight intensity={0.35} />
      <pointLight position={[2, 3, 2]}  intensity={2.2} color="#00d9ff" />
      <pointLight position={[-3, -1, 1]} intensity={0.9} color="#b44dff" />

      <StarField analyserRef={analyserRef} />

      {/* Suspense keeps the canvas rendering while the GLB streams in */}
      <Suspense fallback={null}>
        <Robot analyserRef={analyserRef} />
      </Suspense>
    </Canvas>
  );
}
