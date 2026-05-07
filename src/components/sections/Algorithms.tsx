"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

/* ── Constants ─────────────────────────────────────────────────────────── */
const BAR_COUNT = 20;

/* ── Types ─────────────────────────────────────────────────────────────── */
interface SortFrame {
  bars:      readonly number[];
  comparing: readonly number[];
  pivot:     number | null;
  sorted:    readonly number[];
  codeLine:  number; // -1 = fully done
}

type AlgoKey = "quick" | "bubble" | "merge";

interface AlgoSpec {
  key:        AlgoKey;
  label:      string;
  display:    string;
  codeLines:  readonly string[];
  status:     (codeLine: number) => string;
  precompute: (initial: number[]) => SortFrame[];
}

/* ── Array helpers ──────────────────────────────────────────────────────── */
function makeArray(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => Math.round(((i + 1) / n) * 100));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ── QuickSort ──────────────────────────────────────────────────────────── */
const QUICK_CODE = [
  "function quickSort(arr, lo, hi) {",
  "  if (lo ≥ hi) return",
  "  pivot ← arr[hi]",
  "  i ← lo − 1",
  "  for (j = lo; j < hi; j++)",
  "    if (arr[j] ≤ pivot)",
  "      swap(arr[++i], arr[j])",
  "  swap(arr[i+1], arr[hi])",
  "  p = i+1  // pivot in place ✓",
  "  quickSort(arr, lo, p−1)",
  "  quickSort(arr, p+1, hi)",
  "}",
];

function precomputeQuick(initial: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...initial];
  const doneSet = new Set<number>();

  function snap(comparing: number[], pivot: number | null, codeLine: number) {
    frames.push({ bars: [...arr], comparing, pivot, sorted: [...doneSet], codeLine });
  }

  function partition(lo: number, hi: number): number {
    snap([hi], hi, 2);
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      snap([j, hi], hi, 5);
      if (arr[j] <= arr[hi]) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        snap([i, j], hi, 6);
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    doneSet.add(i + 1);
    snap([i + 1], i + 1, 7);
    snap([], null, 8);
    return i + 1;
  }

  function qs(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) { doneSet.add(lo); snap([], null, 1); }
      return;
    }
    snap([], null, 0);
    const p = partition(lo, hi);
    snap([], null, 9);
    qs(lo, p - 1);
    snap([], null, 10);
    qs(p + 1, hi);
  }

  qs(0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) doneSet.add(i);
  snap([], null, -1);
  return frames;
}

function statusQuick(codeLine: number): string {
  switch (codeLine) {
    case -1: return "Sorted!";
    case  2: return "Pivot selected";
    case  5: return "Comparing";
    case  6: return "Swapping";
    case  7: return "Pivot placed";
    case  9: return "Recurse left";
    case 10: return "Recurse right";
    default: return "Running…";
  }
}

/* ── BubbleSort ─────────────────────────────────────────────────────────── */
const BUBBLE_CODE = [
  "function bubbleSort(arr) {",
  "  n ← arr.length",
  "  for (i = 0; i < n − 1; i++)",
  "    swapped ← false",
  "    for (j = 0; j < n − i − 1; j++)",
  "      if (arr[j] > arr[j+1])",
  "        swap(arr[j], arr[j+1])",
  "        swapped ← true",
  "    if (!swapped) break",
  "  // array sorted ✓",
  "}",
];

function precomputeBubble(initial: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...initial];
  const doneSet = new Set<number>();
  const n = arr.length;

  function snap(comparing: number[], codeLine: number) {
    frames.push({ bars: [...arr], comparing, pivot: null, sorted: [...doneSet], codeLine });
  }

  snap([], 0);
  for (let i = 0; i < n - 1; i++) {
    snap([], 2);
    let swapped = false;
    snap([], 3);
    for (let j = 0; j < n - i - 1; j++) {
      snap([j, j + 1], 5);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        snap([j, j + 1], 6);
      }
    }
    doneSet.add(n - i - 1);
    snap([], 8);
    if (!swapped) break;
  }
  for (let i = 0; i < n; i++) doneSet.add(i);
  snap([], -1);
  return frames;
}

function statusBubble(codeLine: number): string {
  switch (codeLine) {
    case -1: return "Sorted!";
    case  3: return "Pass start";
    case  5: return "Comparing";
    case  6: return "Swapping";
    case  8: return "Pass complete";
    default: return "Running…";
  }
}

/* ── MergeSort ──────────────────────────────────────────────────────────── */
const MERGE_CODE = [
  "function mergeSort(arr, lo, hi) {",
  "  if (lo ≥ hi) return",
  "  mid ← (lo + hi) >> 1",
  "  mergeSort(arr, lo, mid)",
  "  mergeSort(arr, mid+1, hi)",
  "  merge(arr, lo, mid, hi)",
  "}",
  "function merge(arr, lo, mid, hi) {",
  "  L ← arr[lo..mid]; R ← arr[mid+1..hi]",
  "  while (L && R) pick smaller →",
  "  copy remainder back",
  "}",
];

function precomputeMerge(initial: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const arr = [...initial];
  const doneSet = new Set<number>();

  function snap(comparing: number[], codeLine: number) {
    frames.push({ bars: [...arr], comparing, pivot: null, sorted: [...doneSet], codeLine });
  }

  function merge(lo: number, mid: number, hi: number) {
    snap([], 7);
    const L = arr.slice(lo, mid + 1);
    const R = arr.slice(mid + 1, hi + 1);
    snap([], 8);
    let i = 0, j = 0, k = lo;
    while (i < L.length && j < R.length) {
      snap([lo + i, mid + 1 + j], 9);
      if (L[i] <= R[j]) {
        arr[k++] = L[i++];
      } else {
        arr[k++] = R[j++];
      }
      snap([k - 1], 9);
    }
    while (i < L.length) {
      arr[k++] = L[i++];
      snap([k - 1], 10);
    }
    while (j < R.length) {
      arr[k++] = R[j++];
      snap([k - 1], 10);
    }
    /* The merged segment [lo..hi] is now locally sorted relative to itself */
    if (lo === 0 && hi === arr.length - 1) {
      for (let x = lo; x <= hi; x++) doneSet.add(x);
    }
  }

  function ms(lo: number, hi: number) {
    if (lo >= hi) {
      snap([], 1);
      return;
    }
    snap([], 0);
    const mid = (lo + hi) >> 1;
    snap([], 2);
    ms(lo, mid);
    snap([], 3);
    ms(mid + 1, hi);
    snap([], 4);
    merge(lo, mid, hi);
    snap([], 5);
  }

  ms(0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) doneSet.add(i);
  snap([], -1);
  return frames;
}

function statusMerge(codeLine: number): string {
  switch (codeLine) {
    case -1: return "Sorted!";
    case  2: return "Split left";
    case  3: return "Split right";
    case  4: return "Merging";
    case  9: return "Comparing";
    case 10: return "Copying remainder";
    default: return "Running…";
  }
}

/* ── Registry ───────────────────────────────────────────────────────────── */
const ALGOS: Record<AlgoKey, AlgoSpec> = {
  quick:  { key: "quick",  label: "Quick Sort",  display: "QuickSort",  codeLines: QUICK_CODE,  status: statusQuick,  precompute: precomputeQuick  },
  bubble: { key: "bubble", label: "Bubble Sort", display: "BubbleSort", codeLines: BUBBLE_CODE, status: statusBubble, precompute: precomputeBubble },
  merge:  { key: "merge",  label: "Merge Sort",  display: "MergeSort",  codeLines: MERGE_CODE,  status: statusMerge,  precompute: precomputeMerge  },
};

/* ── Bar visual style ───────────────────────────────────────────────────── */
function barStyle(idx: number, frame: SortFrame): React.CSSProperties {
  let bg    = "rgba(180,77,255,0.38)";
  let glow  = "none";

  if (frame.sorted.includes(idx)) {
    bg   = "rgba(34,197,94,0.82)";
    glow = "0 0 10px rgba(34,197,94,0.42)";
  } else if (frame.pivot === idx) {
    bg   = "rgba(0,217,255,0.95)";
    glow = "0 0 18px rgba(0,217,255,0.65)";
  } else if (frame.comparing.includes(idx)) {
    bg   = "rgba(251,191,36,0.9)";
    glow = "0 0 12px rgba(251,191,36,0.52)";
  }

  return {
    height:     `${frame.bars[idx]}%`,
    background: bg,
    boxShadow:  glow,
    borderRadius: "3px 3px 0 0",
    transition: "height 70ms ease, background 90ms ease, box-shadow 90ms ease",
  };
}

/* ── Icons ──────────────────────────────────────────────────────────────── */
function IconPlay()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>; }
function IconPause()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>; }
function IconStepFwd()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 15 12 5 21 5 3" /><rect x="17" y="4" width="3" height="16" rx="1" /></svg>; }
function IconStepBack()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 3 9 12 19 21 19 3" /><rect x="4" y="4" width="3" height="16" rx="1" /></svg>; }
function IconReset()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>; }

function ToolBtn({
  onClick, disabled = false, title, children,
}: {
  onClick: () => void; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
      style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-text-secondary)" }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,217,255,0.12)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
    >
      {children}
    </button>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function Algorithms() {
  const [algoKey,  setAlgoKey]  = useState<AlgoKey>("quick");
  const [seed,     setSeed]     = useState(0);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [speed,    setSpeed]    = useState(6);

  const algo = ALGOS[algoKey];

  const initialArr = useMemo(() => makeArray(BAR_COUNT), [seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const frames     = useMemo(() => algo.precompute(initialArr), [algo, initialArr]);
  const delay      = (11 - speed) * 48;
  const frame      = frames[frameIdx] ?? frames[0];
  const isDone     = frameIdx >= frames.length - 1;
  const progress   = frames.length > 1 ? frameIdx / (frames.length - 1) : 0;

  /* Reset playback whenever the algorithm changes */
  useEffect(() => {
    setFrameIdx(0);
    setPlaying(false);
  }, [algoKey]);

  const codeRef = useRef<HTMLDivElement>(null);
  /*
   * Auto-scroll the pseudocode panel — but ONLY scroll the inner container,
   * never the page viewport. `el.scrollIntoView()` walks up the ancestor chain
   * and can scroll <html> too, which on initial mount yanks the whole page
   * down to the Algorithms section. We compute scrollTop on the codeRef
   * container directly so the document never moves.
   */
  useEffect(() => {
    const container = codeRef.current;
    if (!container) return;
    const el = container.querySelector("[data-active='true']") as HTMLElement | null;
    if (!el) return;
    const target = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [frame.codeLine]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setFrameIdx((f) => {
        if (f >= frames.length - 1) { setPlaying(false); return f; }
        return f + 1;
      });
    }, delay);
    return () => clearInterval(id);
  }, [playing, delay, frames.length]);

  const reset = useCallback(() => {
    setPlaying(false);
    setFrameIdx(0);
    setSeed((s) => s + 1);
  }, []);

  const stepBack = useCallback(() => {
    setPlaying(false);
    setFrameIdx((f) => Math.max(f - 1, 0));
  }, []);

  const stepFwd = useCallback(() => {
    if (isDone) return;
    setFrameIdx((f) => Math.min(f + 1, frames.length - 1));
  }, [isDone, frames.length]);

  const togglePlay = useCallback(() => {
    if (isDone) { setFrameIdx(0); setPlaying(true); return; }
    setPlaying((p) => !p);
  }, [isDone]);

  return (
    <section
      id="algorithms"
      className="relative flex flex-col items-center border-t border-[var(--color-bg-muted)] px-4 py-24 sm:px-6"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(180,77,255,0.05) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-5xl">

        {/* ── Header ── */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <p
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--color-purple-neon)]"
            style={{ textShadow: "0 0 14px rgba(180,77,255,0.4)" }}
          >
            Algorithm Visualization
          </p>
          <h2 className="text-4xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            {algo.display}{" "}
            <span
              className="text-[var(--color-cyan-neon)]"
              style={{ textShadow: "0 0 36px rgba(0,217,255,0.35)" }}
            >
              Live
            </span>
          </h2>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            Every step pre-computed — replay, pause, and single-step through the algorithm.
          </p>
        </motion.div>

        {/* ── Algorithm selector tabs ── */}
        <div className="mb-6 flex justify-center">
          <div
            role="tablist"
            aria-label="Sorting algorithm"
            className="inline-flex items-center gap-1 rounded-full border p-1"
            style={{
              borderColor: "rgba(180,77,255,0.18)",
              background:  "rgba(5,8,15,0.8)",
              backdropFilter: "blur(12px)",
            }}
          >
            {(Object.keys(ALGOS) as AlgoKey[]).map((k) => {
              const isActive = k === algoKey;
              return (
                <button
                  key={k}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setAlgoKey(k)}
                  className="rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, var(--color-cyan-neon), var(--color-purple-neon))"
                      : "transparent",
                    color: isActive
                      ? "var(--color-bg-base)"
                      : "var(--color-text-secondary)",
                    boxShadow: isActive ? "0 0 20px rgba(0,217,255,0.3)" : "none",
                  }}
                >
                  {ALGOS[k].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main card ── */}
        <motion.div
          className="overflow-hidden rounded-2xl border"
          style={{
            borderColor: "rgba(180,77,255,0.18)",
            background:  "rgba(5,8,15,0.92)",
            boxShadow:   "0 0 60px rgba(180,77,255,0.06), 0 24px 60px rgba(0,0,0,0.55)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <div className="flex">

            {/* Bars */}
            <div className="flex flex-1 flex-col p-5 pb-0">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  {algo.display} · {frames.length} steps
                </span>
                <span
                  className="rounded-full px-3 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: frame.codeLine === -1
                      ? "rgba(34,197,94,0.12)"
                      : frame.comparing.length
                        ? "rgba(251,191,36,0.1)"
                        : "rgba(0,217,255,0.08)",
                    color: frame.codeLine === -1
                      ? "rgba(34,197,94,0.9)"
                      : frame.comparing.length
                        ? "rgba(251,191,36,0.9)"
                        : "var(--color-cyan-neon)",
                    border: `1px solid ${
                      frame.codeLine === -1
                        ? "rgba(34,197,94,0.25)"
                        : frame.comparing.length
                          ? "rgba(251,191,36,0.25)"
                          : "rgba(0,217,255,0.2)"
                    }`,
                  }}
                >
                  {algo.status(frame.codeLine)}
                </span>
              </div>

              <div className="flex h-48 items-end gap-[3px]" aria-hidden>
                {Array.from({ length: BAR_COUNT }, (_, i) => (
                  <div key={i} className="flex-1" style={barStyle(i, frame)} />
                ))}
              </div>

              <div className="mt-3 h-px w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg, var(--color-cyan-neon), var(--color-purple-neon))",
                    transition: "width 80ms linear",
                  }}
                />
              </div>
              <p className="mb-4 mt-1 text-right text-[10px] text-[var(--color-text-muted)]">
                {frameIdx + 1} / {frames.length}
              </p>
            </div>

            {/* Code panel */}
            <div
              ref={codeRef}
              className="hidden w-64 shrink-0 overflow-y-auto border-l lg:block"
              style={{
                borderColor: "rgba(180,77,255,0.12)",
                background:  "rgba(0,0,0,0.3)",
                maxHeight:   "280px",
              }}
            >
              <p className="sticky top-0 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.5)] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                pseudocode
              </p>
              {algo.codeLines.map((line, i) => {
                const isActive = i === frame.codeLine;
                return (
                  <div
                    key={i}
                    data-active={isActive ? "true" : undefined}
                    className="flex items-start gap-3 px-3 py-[5px] transition-colors"
                    style={{
                      background: isActive ? "rgba(0,217,255,0.09)" : "transparent",
                      borderLeft: isActive ? "2px solid var(--color-cyan-neon)" : "2px solid transparent",
                    }}
                  >
                    <span className="w-4 shrink-0 text-right text-[10px] text-[var(--color-text-muted)] opacity-50">
                      {i}
                    </span>
                    <code
                      className="whitespace-pre text-[11px] leading-relaxed"
                      style={{
                        color: isActive ? "var(--color-cyan-neon)" : "rgba(255,255,255,0.55)",
                        fontFamily: "var(--font-geist-mono)",
                      }}
                    >
                      {line}
                    </code>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toolbar */}
          <div
            className="flex flex-wrap items-center gap-3 border-t px-5 py-3"
            style={{
              borderColor:    "rgba(180,77,255,0.12)",
              background:     "rgba(0,0,0,0.45)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <ToolBtn onClick={reset} title="New array"><IconReset /></ToolBtn>
              <ToolBtn onClick={stepBack} disabled={frameIdx === 0} title="Step back"><IconStepBack /></ToolBtn>
              <button
                onClick={togglePlay}
                title={playing ? "Pause" : "Play"}
                className="flex h-8 w-16 items-center justify-center gap-1.5 rounded-lg text-[12px] font-semibold text-[var(--color-bg-base)] transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-cyan-neon), var(--color-purple-neon))" }}
              >
                {playing ? <IconPause /> : <IconPlay />}
                {playing ? "Pause" : isDone ? "Replay" : "Play"}
              </button>
              <ToolBtn onClick={stepFwd} disabled={isDone} title="Step forward"><IconStepFwd /></ToolBtn>
            </div>

            <div className="h-6 w-px bg-[rgba(255,255,255,0.08)]" />

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Speed</span>
              <span className="text-[9px] text-[var(--color-text-muted)]">Slow</span>
              <input
                type="range" min={1} max={10} step={1} value={speed}
                onChange={(e) => setSpeed(+e.target.value)}
                className="h-1 w-24 cursor-pointer appearance-none rounded-full"
                style={{ accentColor: "var(--color-cyan-neon)" }}
                aria-label="Playback speed"
              />
              <span className="text-[9px] text-[var(--color-text-muted)]">Fast</span>
            </div>

            <div className="ml-auto hidden items-center gap-3 sm:flex">
              {[
                { color: "rgba(180,77,255,0.6)",  label: "Default" },
                { color: "rgba(0,217,255,0.9)",   label: "Pivot"   },
                { color: "rgba(251,191,36,0.9)",  label: "Compare" },
                { color: "rgba(34,197,94,0.82)",  label: "Sorted"  },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-sm" style={{ background: color }} />
                  <span className="text-[10px] text-[var(--color-text-muted)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
