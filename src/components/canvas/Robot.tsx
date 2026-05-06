"use client";

import { useRef, useMemo, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getAssetUrl } from "@/src/utils/getAssetUrl";

const MODEL_URL = getAssetUrl("models/space_maintenance_robot.glb");

interface Props {
  analyserRef?: React.MutableRefObject<AnalyserNode | null>;
}

export default function Robot({ analyserRef }: Props) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef  = useRef<THREE.Group>(null);
  const dataArray = useMemo(() => new Uint8Array(128), []);

  /* Clone so the same GLB cache entry can be re-used across HMR reloads */
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  /* Collect MeshStandardMaterials once; prime their emissive colour */
  const stdMaterials = useMemo(() => {
    const mats: THREE.MeshStandardMaterial[] = [];
    clonedScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mat = obj.material;
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.emissive.set("#00d9ff");
          mat.emissiveIntensity = 0;
          mats.push(mat);
        }
      }
    });
    return mats;
  }, [clonedScene]);

  /* Dispose cloned geometries & materials on unmount to prevent GPU leaks */
  useEffect(() => () => {
    clonedScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m: THREE.Material) => m.dispose());
      }
    });
  }, [clonedScene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    /* Idle float — always active, no state */
    groupRef.current.position.y = Math.sin(t * 0.55) * 0.08;

    /* Default slow rotation */
    groupRef.current.rotation.y += 0.003;

    if (!analyserRef?.current) {
      /* No audio: zero out emissive */
      for (const mat of stdMaterials) mat.emissiveIntensity = 0;
      return;
    }

    analyserRef.current.getByteFrequencyData(dataArray);

    /* Bass: bins 0-3  (~0–520 Hz @ fftSize 256 / 44100 Hz) */
    let bassSum = 0;
    for (let i = 0; i < 4; i++) bassSum += dataArray[i];
    const bass = bassSum / (4 * 255);

    /* Mid: bins 4-15 */
    let midSum = 0;
    for (let i = 4; i < 16; i++) midSum += dataArray[i];
    const mid = midSum / (12 * 255);

    /* Treble: bins 16-47 */
    let trebleSum = 0;
    for (let i = 16; i < 48; i++) trebleSum += dataArray[i];
    const treble = trebleSum / (32 * 255);

    /* Bass  → scale pulse (no setState — direct ref mutation) */
    groupRef.current.scale.setScalar(1 + bass * 0.22);

    /* Mid   → extra rotation boost on the beat */
    groupRef.current.rotation.y += mid * 0.045;

    /* Treble → cyan emissive glow across all standard materials */
    for (const mat of stdMaterials) {
      mat.emissiveIntensity = treble * 2.2;
    }
  });

  return (
    <group ref={groupRef} position={[0.6, -0.8, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

/* Kick off the network fetch before the component mounts */
useGLTF.preload(MODEL_URL);
