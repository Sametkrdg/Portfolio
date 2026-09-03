"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useAudioStore } from "./audioStore";

/*
 * three.js must never reach the server, and it must never reach the other six
 * themes either — this is the only module that pulls it in, behind ssr:false.
 */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

function WaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="2" y1="12" x2="2" y2="12" />
      <line x1="6" y1="8" x2="6" y2="16" />
      <line x1="10" y1="4" x2="10" y2="20" />
      <line x1="14" y1="8" x2="14" y2="16" />
      <line x1="18" y1="10" x2="18" y2="14" />
      <line x1="22" y1="12" x2="22" y2="12" />
    </svg>
  );
}

export function HeroBackdrop() {
  return (
    <div className="sp-hero-canvas" aria-hidden>
      <Suspense fallback={null}>
        <HeroCanvas />
      </Suspense>
    </div>
  );
}

/**
 * The audio toggle. The star field reads the same analyser, so starting the
 * music makes the scene react to it — the one piece of motion this theme keeps
 * beyond the canvas itself, and it only runs when the visitor asks for it.
 */
export function AudioToggle({ play, stop }: { play: string; stop: string }) {
  const isActive = useAudioStore((s) => s.isActive);
  const start = useAudioStore((s) => s.start);

  return (
    <button
      type="button"
      onClick={start}
      className="sp-audio"
      data-playing={isActive ? "" : undefined}
      aria-pressed={isActive}
    >
      <WaveIcon />
      {isActive ? stop : play}
    </button>
  );
}
