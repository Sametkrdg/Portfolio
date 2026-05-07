"use client";

import { create } from "zustand";
import { getAssetUrl } from "@/src/utils/getAssetUrl";

const MUSIC_URL = getAssetUrl("audio/MYSTERY.mp3");

/*
 * Global audio analyser store.
 *
 * Why a store instead of a per-component hook:
 *   The Hero "Play Experience" button starts the audio,
 *   but BOTH the Hero canvas AND the sticky bottom-right Robot canvas need
 *   to read the same AnalyserNode for audio-reactive useFrame updates.
 *   A shared singleton makes that trivial without prop-drilling through the layout tree.
 *
 * The ref-style fields (analyser, ctx, audio) are intentionally NOT React
 * useRefs — they're just plain references stashed on the store instance so
 * three.js useFrame loops can read them at 60 fps without subscribing to React.
 */
interface AudioStore {
  isActive:  boolean;
  analyser:  AnalyserNode | null;
  start:     () => Promise<void>;
  stop:      () => void;
  _ctx:      AudioContext | null;
  _audio:    HTMLAudioElement | null;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  isActive: false,
  analyser: null,
  _ctx:     null,
  _audio:   null,

  async start() {
    /* Toggle: second click stops */
    if (get().analyser) {
      get().stop();
      return;
    }

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize              = 256;
    analyser.smoothingTimeConstant = 0.82;

    /* crossOrigin must be set BEFORE src to avoid CORS errors on R2 */
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.loop        = true;
    audio.src         = MUSIC_URL;

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    await audio.play();
    set({ isActive: true, analyser, _ctx: ctx, _audio: audio });
  },

  stop() {
    const { _audio, _ctx } = get();
    _audio?.pause();
    _ctx?.close();
    set({ isActive: false, analyser: null, _ctx: null, _audio: null });
  },
}));
