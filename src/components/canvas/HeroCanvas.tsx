"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getAssetUrl } from "@/src/utils/getAssetUrl";
import { useAudioStore } from "@/src/store/audioStore";
import ErrorBoundary from "@/src/components/utils/ErrorBoundary";

const HDR_URL = getAssetUrl("hero-env.hdr");

/* ── Warp star field ────────────────────────────────────────────────────────
 * Custom Points cloud where each particle continuously moves toward the
 * camera along +Z. When a particle passes the camera plane it respawns deep
 * in the scene to create a perpetual "flying through space" illusion.
 * Audio-reactive: bass scales the warp speed.
 * Pure ref-based mutation — no setState in useFrame.
 */
function WarpStars({ count = 1200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  /*
   * Allocate the buffers during render, but seed them with random positions
   * on the first frame: `Math.random()` during render is impure and would
   * produce a different field on every re-render.
   */
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    );
    return geo;
  }, [count]);

  /* Refs, not memos: these are mutated per-frame, and a memoised value must
   * stay immutable. */
  const speedsRef = useRef<Float32Array | null>(null);
  const seeded = useRef(false);

  /* Free the GPU buffers when the hero unmounts. */
  useEffect(() => () => geometry.dispose(), [geometry]);

  const dataArray = useMemo(() => new Uint8Array(128), []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const posAttr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    /* First frame: scatter the field. Each star gets a random (x, y) in a
     * wide tube, a random z between FAR and NEAR so the field starts full,
     * and a speed multiplier for parallax variety. */
    if (!seeded.current) {
      speedsRef.current = new Float32Array(count);
      const speeds = speedsRef.current;
      const FAR = -160;
      const NEAR = 6;
      for (let i = 0; i < count; i++) {
        const r = 30 + Math.random() * 90;
        const theta = Math.random() * Math.PI * 2;
        arr[i * 3 + 0] = Math.cos(theta) * r;
        arr[i * 3 + 1] = Math.sin(theta) * r;
        arr[i * 3 + 2] = FAR + Math.random() * (NEAR - FAR);
        speeds[i] = 0.4 + Math.random() * 1.6;
      }
      seeded.current = true;
    }

    /* Pull bass amplitude from the global analyser (no React subscription) */
    const analyser = useAudioStore.getState().analyser;
    let bass = 0;
    if (analyser) {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < 4; i++) sum += dataArray[i];
      bass = sum / (4 * 255);
    }

    /* Base 18 units/sec idle drift, up to ~3.5× faster on heavy bass */
    const baseSpeed = 18 + bass * 45;
    const speeds = speedsRef.current;
    if (!speeds) return;

    for (let i = 0; i < count; i++) {
      const zIdx = i * 3 + 2;
      arr[zIdx] += baseSpeed * speeds[i] * delta;
      /* Recycle: when the star passes the camera, send it deep again */
      if (arr[zIdx] > 6) {
        arr[zIdx] = -160;
        const r     = 30 + Math.random() * 90;
        const theta = Math.random() * Math.PI * 2;
        arr[i * 3 + 0] = Math.cos(theta) * r;
        arr[i * 3 + 1] = Math.sin(theta) * r;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.18}
        sizeAttenuation
        color="#cfe9ff"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Meteors ────────────────────────────────────────────────────────────────
 * A small cohort of fast-moving, larger particles that streak across the
 * scene at random intervals. Each meteor has its own respawn timer so
 * sightings stay sparse — the goal is "occasional" not "constant rain".
 */
const METEOR_COUNT = 5;

function Meteors() {
  const groupRef = useRef<THREE.Group>(null);
  const meteorsRef = useRef<{
    pos:      THREE.Vector3;
    velocity: THREE.Vector3;
    alive:    boolean;
    nextSpawn: number;
    elapsed:  number;
  }[]>([]);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    /* Pool is seeded on the first frame — staggering the spawn timers needs
     * randomness, which must stay out of render. */
    if (meteorsRef.current.length === 0) {
      for (let i = 0; i < METEOR_COUNT; i++) {
        meteorsRef.current.push({
          pos:       new THREE.Vector3(0, 0, -200),
          velocity:  new THREE.Vector3(),
          alive:     false,
          nextSpawn: Math.random() * 6 + 2,
          elapsed:   0,
        });
      }
    }

    meteorsRef.current.forEach((m, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      if (!m.alive) {
        m.elapsed += delta;
        if (m.elapsed >= m.nextSpawn) {
          /* Spawn from a random off-screen point, fly across with steep Z component */
          const ang = Math.random() * Math.PI * 2;
          m.pos.set(Math.cos(ang) * 60, Math.sin(ang) * 35, -120);
          /* Fast forward + lateral drift for a "shooting" feel */
          m.velocity.set(
            -Math.cos(ang) * 8,
            -Math.sin(ang) * 6,
            120 + Math.random() * 60,
          );
          m.alive   = true;
          m.elapsed = 0;
          mesh.visible = true;
        } else {
          mesh.visible = false;
          return;
        }
      }

      m.pos.addScaledVector(m.velocity, delta);
      mesh.position.copy(m.pos);

      /* Scale grows as it gets closer for parallax punch */
      const closeness = Math.max(0, (m.pos.z + 120) / 130);
      const s = 0.4 + closeness * 1.8;
      mesh.scale.setScalar(s);

      if (m.pos.z > 8) {
        m.alive     = false;
        m.elapsed   = 0;
        m.nextSpawn = 4 + Math.random() * 8;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: METEOR_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          visible={false}
        >
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Rotating HDR background ────────────────────────────────────────────────
 * drei's <Environment> with `background` accepts a `backgroundRotation`
 * Euler that we mutate per-frame. Audio-reactive: mid frequencies push the
 * rotation faster, syncing visual motion to the music's energy.
 *
 * We can't ref the underlying skybox directly, so we keep an Euler in a
 * ref and read it (and its mutations) into the JSX each frame via a state-
 * less re-render workaround: use a `key`-stable ref + a small useFrame loop
 * that mutates the Euler in place. Three.js reads it on the next render.
 */
/*
 * Module scope, deliberately: drei needs the same object in the JSX every
 * frame while `useFrame` mutates it in place. A ref would have to be read
 * during render, and a memoised value may not be mutated — this is neither.
 * Only one <RotatingEnvironment> is ever mounted.
 */
const ENV_EULER = new THREE.Euler(0, 0, 0);

function RotatingEnvironment() {
  const dataArray = useMemo(() => new Uint8Array(128), []);

  useFrame((_, delta) => {
    const analyser = useAudioStore.getState().analyser;
    let mid = 0;
    if (analyser) {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 4; i < 16; i++) sum += dataArray[i];
      mid = sum / (12 * 255);
    }
    /* Idle drift 0.01 rad/s, up to ~10× when music's mid band is hot */
    ENV_EULER.y += (0.01 + mid * 0.09) * delta;
  });

  return (
    <Environment
      files={HDR_URL}
      background
      backgroundRotation={ENV_EULER}
      environmentRotation={ENV_EULER}
    />
  );
}

/*
 * Exported as the lazy-load target — imported via next/dynamic with ssr:false
 * from a Client Component wrapper so it never runs on the server.
 */
export default function HeroCanvas() {
  /*
   * ErrorBoundary wraps the whole Canvas: WebGL context-lost or R2 asset
   * failures fall back silently (fallback={null}) — the Hero section is
   * fully readable without the 3D background, the radial vignette + Deep
   * Slate body bg do the visual work on their own. Showing an "Interactive
   * experience disabled" panel here would overlap the headline.
   *
   * The Robot's mini-canvas uses a *visible* fallback because there the
   * canvas IS the UI (the chat trigger); see RobotMiniScene.tsx.
   */
  return (
    <ErrorBoundary fallback={null}>
      <Canvas
        /* dpr capped at 1.5: at 2.0 mobile retina fills 4× pixels — particle
         * fields tank to ~25 fps on mid-range Androids. 1.5 keeps clarity
         * with ~55% the fragment cost. */
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 4.5], fov: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        {/* Inner Suspense with a drei <Html> fallback. RotatingEnvironment
         * fetches the HDRI from R2; on slow connections this can take a few
         * seconds, and React 19 will crash if useTexture / useLoader suspend
         * without a boundary. <Html center> renders DOM inside the WebGL
         * canvas so the user sees feedback instead of a frozen black box. */}
        <Suspense
          fallback={
            <Html center>
              <span className="text-xs font-semibold tracking-widest text-cyan-400">
                Loading 3D…
              </span>
            </Html>
          }
        >
          <RotatingEnvironment />
        </Suspense>

        <ambientLight intensity={0.35} />
        <pointLight position={[2, 3, 2]}   intensity={2.2} color="#00d9ff" />
        <pointLight position={[-3, -1, 1]} intensity={0.9} color="#b44dff" />

        <WarpStars />
        <Meteors />
      </Canvas>
    </ErrorBoundary>
  );
}
