"use client";

import type { NavItemProps, SectionId } from "@/src/lib/types";

/* Each section owns a colour; the sidebar borrows it for the active row. */
const ACCENTS: Partial<Record<SectionId, string>> = {
  about: "cyan",
  skills: "amber",
  experience: "violet",
  projects: "pink",
  contact: "lime",
};

/**
 * maximalism's active emphasis: the row becomes a filled prompt line in the
 * colour its section owns. Padding and the left border are on every item, so
 * filling one changes nothing about its size.
 */
export default function NavItem({
  id,
  label,
  href,
  isActive,
  onSelect,
}: NavItemProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onSelect(id);
      }}
      aria-current={isActive ? "true" : undefined}
      data-active={isActive ? "" : undefined}
      data-accent={ACCENTS[id]}
      className="mx-nav-item"
    >
      <span className="mx-nav-caret">&gt;</span>
      <span>{label}</span>
    </a>
  );
}
