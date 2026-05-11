"use client";

import { MotionConfig } from "framer-motion";

/*
 * Wraps the entire app's framer-motion tree with a global reduced-motion
 * preference. `reducedMotion="user"` reads the OS / browser setting and
 * disables transforms/transitions on every <motion.*> component without
 * each component having to call useReducedMotion individually.
 *
 * Server Component compatibility: MotionConfig is client-only, so this
 * thin "use client" wrapper lets the Server-Component root layout mount
 * it without converting the whole tree.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
