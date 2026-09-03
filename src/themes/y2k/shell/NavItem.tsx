"use client";

import type { NavItemProps } from "@/src/lib/types";

/**
 * y2k's active emphasis: the row lights up — magenta left edge, a wash of
 * magenta behind it, and a glow. Border and glow slots are on every item so
 * the row never changes size.
 */
export default function NavItem({
  id,
  label,
  href,
  index,
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
      className="y2-nav-item"
    >
      <span className="y2-nav-num">0{index + 1}</span>
      <span>{label}</span>
    </a>
  );
}
