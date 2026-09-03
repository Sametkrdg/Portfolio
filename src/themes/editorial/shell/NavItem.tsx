"use client";

import type { NavItemProps } from "@/src/lib/types";

/**
 * editorial's active emphasis: the label switches to the display serif at a
 * larger size and picks up a gold rule down its left edge. The sidebar is a
 * fixed 244px, so the type can grow without moving the page.
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
      className="ed-nav-item"
    >
      <span className="ed-nav-num">{String(index + 1).padStart(2, "0")}</span>
      <span className="ed-nav-label">{label}</span>
    </a>
  );
}
