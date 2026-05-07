"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * Force the page to start at the top on every load and refresh.
 *
 * Why so much machinery for what looks like a one-line job:
 *   1. Browsers cache the previous scroll position by default
 *      (`history.scrollRestoration === "auto"`) and re-apply it after
 *      hydration — that's what was dragging us down to "Algorithms".
 *   2. Dynamic imports (HeroCanvas, AlgorithmsWrapper) and lazy 3D models
 *      complete after the first paint, growing the document height *after*
 *      we've already scrolled to 0. The browser then re-snaps to its
 *      remembered offset relative to the new height.
 *   3. GSAP ScrollTrigger has its own scroll memory; without
 *      `ScrollTrigger.clearScrollMemory("manual")` it restores the trigger's
 *      last known scroll Y on the next refresh.
 *
 * useLayoutEffect (not useEffect): runs synchronously after DOM mutation
 * but before the browser paints, so the user never sees a "flash of mid-page".
 */
export default function ScrollToTop() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    /* 1. Stop the browser from re-applying its remembered scroll position */
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    /* 2. Stop GSAP ScrollTrigger from restoring its own cached position.
     *    Safe to call before any trigger is created. */
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.clearScrollMemory("manual");

    /* 3. Snap immediately — before the browser paints */
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    /* 4. Snap again after the dynamic imports / 3D canvas mount.
     *    The lazy bundles for HeroCanvas + AlgorithmsWrapper finish hydrating
     *    on the next macrotask; 50 ms is enough for the post-hydration reflow
     *    without being visible. */
    const t = window.setTimeout(() => {
      window.scrollTo(0, 0);
      /* Recompute trigger positions against the post-hydration height
       * so future scroll triggers fire from the correct offsets. */
      ScrollTrigger.refresh();
    }, 50);

    return () => window.clearTimeout(t);
  }, []);

  return null;
}
