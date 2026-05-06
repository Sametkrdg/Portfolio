"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { getAssetUrl } from "@/src/utils/getAssetUrl";

const MUSIC_URL = getAssetUrl("audio/MYSTERY.mp3");

export interface AudioAnalyserHandle {
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  isActive: boolean;
  start: () => void;
  stop: () => void;
}

/*
 * Loads MYSTERY.mp3 from R2 (or /public in dev) through a MediaElementAudioSourceNode.
 * AudioContext is created only inside a user-gesture handler to satisfy browser
 * autoplay policy. Toggling start() twice stops playback cleanly.
 */
export function useAudioAnalyser(): AudioAnalyserHandle {
  const analyserRef  = useRef<AnalyserNode | null>(null);
  const ctxRef       = useRef<AudioContext | null>(null);
  const audioElRef   = useRef<HTMLAudioElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  const stop = useCallback(() => {
    audioElRef.current?.pause();
    audioElRef.current = null;
    ctxRef.current?.close();
    ctxRef.current    = null;
    analyserRef.current = null;
    setIsActive(false);
  }, []);

  const start = useCallback(async () => {
    if (analyserRef.current) { stop(); return; }

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize               = 256;
    analyser.smoothingTimeConstant  = 0.82;
    analyserRef.current = analyser;

    /* crossOrigin must be set before src is assigned to avoid CORS errors on R2 */
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.loop        = true;
    audio.src         = MUSIC_URL;
    audioElRef.current = audio;

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    await audio.play();
    setIsActive(true);
  }, [stop]);

  /* Cleanup on unmount */
  useEffect(() => () => {
    audioElRef.current?.pause();
    ctxRef.current?.close();
  }, []);

  return { analyserRef, isActive, start, stop };
}
