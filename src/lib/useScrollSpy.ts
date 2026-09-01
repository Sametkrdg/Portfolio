"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionId } from "./types";

/**
 * Tracks which section is closest to the middle of the viewport.
 *
 * `rootMargin: -45% 0px -45% 0px` collapses the observation band to a thin
 * strip across the vertical centre of the screen, so exactly one section is
 * "the one you are reading" at any scroll position.
 *
 * State updates only when the active id actually changes — this never runs
 * per-frame.
 */
export function useScrollSpy(ids: readonly SectionId[], initial: SectionId) {
  const [active, setActive] = useState<SectionId>(initial);
  const activeRef = useRef<SectionId>(initial);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const id = visible.target.id as SectionId;
        if (id !== activeRef.current) {
          activeRef.current = id;
          setActive(id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));

    /*
     * The centre band never intersects the last section on a short page, and
     * it misses everything once you hit the very bottom of the document.
     * Pin the last section as active there so the sidebar is never blank.
     */
    function onScroll() {
      const doc = document.documentElement;
      const atBottom = doc.scrollHeight - doc.scrollTop - doc.clientHeight < 4;
      if (!atBottom) return;
      const last = ids[ids.length - 1];
      if (last !== activeRef.current) {
        activeRef.current = last;
        setActive(last);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
