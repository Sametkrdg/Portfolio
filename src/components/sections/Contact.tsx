"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EMAIL    = "sametkrdg80@gmail.com";
const LINKEDIN = "https://linkedin.com/in/sametkrdg";
const GITHUB   = "https://github.com/Sametkrdg";

const CV_PATH = "/001-Samet-Karadag.pdf";

/* ── Icon: download arrow ── */
function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ── Icon: envelope ── */
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/* ── Icon: LinkedIn ── */
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

/* ── Icon: GitHub ── */
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".contact-label",   { y: 20, opacity: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-label",  start: "top 88%" } });
      gsap.from(".contact-heading", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-heading", start: "top 88%" } });
      gsap.from(".contact-sub",     { y: 24, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.1,
        scrollTrigger: { trigger: ".contact-sub",    start: "top 88%" } });
      gsap.from(".contact-cv-btn",   { y: 28, opacity: 0, duration: 0.75, ease: "power3.out", delay: 0.1,
        scrollTrigger: { trigger: ".contact-cv-btn", start: "top 90%" } });
      gsap.from(".contact-cards",   { y: 32, opacity: 0, duration: 0.8, ease: "back.out(1.5)", delay: 0.15,
        scrollTrigger: { trigger: ".contact-cards",  start: "top 90%" } });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-t border-[var(--color-bg-muted)] px-6 py-32 text-center"
    >
      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,217,255,0.04) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-8">

        {/* Section label */}
        <p className="contact-label text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--color-cyan-neon)]"
           style={{ textShadow: "0 0 14px rgba(0,217,255,0.4)" }}>
          Let&apos;s Connect
        </p>

        {/* Heading */}
        <h2 className="contact-heading text-5xl font-black leading-[1.05] tracking-tight text-[var(--color-text-primary)] sm:text-6xl">
          Open to{" "}
          <span className="text-[var(--color-cyan-neon)]"
                style={{ textShadow: "0 0 40px rgba(0,217,255,0.35)" }}>
            Opportunities
          </span>
        </h2>

        {/* Sub-copy */}
        <p className="contact-sub max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
          Whether it&apos;s a full-time role, a freelance contract, or an open-source
          collaboration — I read every message and reply within 24 hours.
        </p>

        {/* Horizontal rule */}
        <motion.div
          className="h-px w-16 rounded-full bg-gradient-to-r from-transparent via-[var(--color-cyan-neon)] to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        {/* ── Download CV — primary conversion CTA ── */}
        <motion.a
          href={CV_PATH}
          download
          className="contact-cv-btn group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl px-8 py-5 text-base font-bold tracking-wide text-[var(--color-bg-base)] sm:w-auto sm:px-14"
          style={{
            background: "linear-gradient(135deg, var(--color-cyan-neon) 0%, var(--color-purple-neon) 100%)",
            boxShadow: "0 0 32px rgba(0,217,255,0.25), 0 0 64px rgba(180,77,255,0.15)",
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 0 48px rgba(0,217,255,0.45), 0 0 96px rgba(180,77,255,0.28)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          aria-label="Download Samet Karadağ's CV as PDF"
        >
          {/* Shimmer sweep on hover */}
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-[120%]"
            aria-hidden
          />
          <DownloadIcon />
          Download CV
          <span className="text-[11px] font-normal opacity-70">PDF · 001-Samet-Karadag.pdf</span>
        </motion.a>

        {/* ── Contact cards ── */}
        <div className="contact-cards flex w-full flex-col gap-4 sm:flex-row sm:justify-center">

          {/* Email */}
          <motion.a
            href={`mailto:${EMAIL}`}
            className="group flex flex-1 items-center gap-4 rounded-2xl border px-6 py-5 text-left transition-colors sm:max-w-[260px]"
            style={{
              borderColor: "rgba(0,217,255,0.14)",
              background: "rgba(0,217,255,0.03)",
            }}
            whileHover={{
              borderColor: "rgba(0,217,255,0.45)",
              background: "rgba(0,217,255,0.07)",
              y: -3,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--color-cyan-neon)]"
              style={{ background: "rgba(0,217,255,0.1)" }}
            >
              <MailIcon />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                Email
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-cyan-neon)] transition-colors">
                {EMAIL}
              </p>
            </div>
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-1 items-center gap-4 rounded-2xl border px-6 py-5 text-left transition-colors sm:max-w-[200px]"
            style={{
              borderColor: "rgba(180,77,255,0.14)",
              background: "rgba(180,77,255,0.03)",
            }}
            whileHover={{
              borderColor: "rgba(180,77,255,0.45)",
              background: "rgba(180,77,255,0.07)",
              y: -3,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--color-purple-neon)]"
              style={{ background: "rgba(180,77,255,0.1)" }}
            >
              <LinkedInIcon />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                LinkedIn
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-purple-neon)] transition-colors">
                sametkrdg
              </p>
            </div>
          </motion.a>

          {/* GitHub */}
          <motion.a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-1 items-center gap-4 rounded-2xl border px-6 py-5 text-left transition-colors sm:max-w-[200px]"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
            }}
            whileHover={{
              borderColor: "rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
              y: -3,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--color-text-secondary)]"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <GitHubIcon />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                GitHub
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                Sametkrdg
              </p>
            </div>
          </motion.a>
        </div>

        {/* Footer line */}
        <p className="text-[11px] text-[var(--color-text-muted)]">
          Based in Istanbul, Turkey · Available globally · Replies within 24 h
        </p>
      </div>
    </section>
  );
}
