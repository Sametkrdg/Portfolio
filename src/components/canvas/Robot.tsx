"use client";

import { useRef, useMemo, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getAssetUrl } from "@/src/utils/getAssetUrl";
import { useAudioStore } from "@/src/store/audioStore";

const MODEL_URL = getAssetUrl("models/space_maintenance_robot.glb");

interface Props {
  /** Override scale; useful when embedding in a small sticky canvas */
  scale?:    number;
  /** Override base group position */
  position?: [number, number, number];
  /**
   * Base Euler rotation (radians).
   * Audio-reactive yaw spins around this baseline so the model never drifts
   * away from its intended facing direction.
   */
  rotation?: [number, number, number];
}

/*
 * Audio-reactive robot. Reads the AnalyserNode straight from the global
 * audio store (no React subscription, no prop drilling) so the same model
 * works in any canvas — Hero, sticky bottom-right widget, etc.
 *
 * All animation is ref-mutation inside useFrame — never setState at 60 fps.
 */
export default function Robot({
  scale    = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: Props) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef  = useRef<THREE.Group>(null);
  const dataArray = useMemo(() => new Uint8Array(128), []);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

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
    const g = groupRef.current;
    if (!g) return;
    const t = clock.getElapsedTime();

    /* Idle pose: anchor to the supplied baseline rotation so the model keeps
     * facing the user; add a gentle yaw wobble + bob on top. */
    g.position.y = position[1] + Math.sin(t * 0.55) * 0.08;
    g.rotation.x = rotation[0];
    g.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.08;
    g.rotation.z = rotation[2];

    const analyser = useAudioStore.getState().analyser;
    if (!analyser) {
      g.scale.setScalar(scale);
      g.position.x = position[0];
      for (const mat of stdMaterials) mat.emissiveIntensity = 0;
      return;
    }

    analyser.getByteFrequencyData(dataArray);

    /* Bass: bins 0-3 */
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

    /* Dance — ref-only mutations, anchored to baseline rotation/position so
     * the robot always returns to facing the visitor. */
    g.position.y = position[1] + Math.sin(t * 0.55) * 0.08 + bass * 0.35;
    g.position.x = position[0] + Math.sin(t * 2.2) * mid * 0.25;
    g.scale.setScalar(scale * (1 + bass * 0.25));
    g.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.08 + Math.sin(t * 3.1) * mid * 0.18;

    for (const mat of stdMaterials) {
      mat.emissiveIntensity = treble * 2.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* dispose={null}: the GLB lives in useGLTF's shared cache. We
       * dispose our cloned geometries/materials manually in useEffect, so
       * letting R3F auto-dispose here would double-free the cache entry
       * on the next route mount. */}
      <primitive object={clonedScene} dispose={null} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
