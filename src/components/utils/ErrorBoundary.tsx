"use client";

import React from "react";

interface Props {
  children:  React.ReactNode;
  /** Optional override for the default fallback UI */
  fallback?: React.ReactNode;
  /** Optional callback fired once when an error is captured (telemetry hook) */
  onError?:  (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
}

/*
 * Class-based Error Boundary.
 *
 * Why a class: React 19 still requires class components for error boundaries
 * — there is no hook equivalent of componentDidCatch.
 *
 * Catches:
 *   - WebGL context-lost crashes from R3F (the most common cause of blank-
 *     screen reports on low-end Androids and battery-saver iPhones)
 *   - Asset fetch failures that bubble out of <Suspense> (e.g. R2 down /
 *     cross-origin denied / network timeout on the GLB or HDRI)
 *   - Unhandled component render errors inside any wrapped tree
 *
 * It does NOT catch:
 *   - Errors in event handlers (those must use try/catch)
 *   - Async errors outside React's render cycle
 *   - SSR-time errors (this is a client-only boundary)
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    /* Console log goes to the user's devtools; useful while debugging
     * blank-screen reports. Replace with Sentry / Vercel logging if added. */
    console.error("[ErrorBoundary] caught:", error, info.componentStack);
    this.props.onError?.(error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    /* Default fallback: a calm dark panel that explains the situation
     * without breaking the section's height — so the page scroll layout
     * stays intact and the visitor can keep moving. */
    return (
      <div
        role="alert"
        className="flex h-full w-full items-center justify-center p-6"
        style={{ background: "rgba(5, 8, 15, 0.85)" }}
      >
        <div className="max-w-sm text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-cyan-neon)]">
            Interactive experience disabled
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Your device couldn&apos;t initialise the 3D scene. Scroll down to
            keep exploring the portfolio — every section works without it.
          </p>
        </div>
      </div>
    );
  }
}
