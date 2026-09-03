"use client";

import type { NavItemProps } from "@/src/lib/types";

/**
 * minimal's active emphasis: the accent blue plus a half-step of weight.
 * Deliberately not a size change — the sidebar is a fixed 268px and the
 * design's rhythm depends on the rows staying put.
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
      className="mn-nav-item"
    >
      <span className="mn-nav-index">{String(index + 1).padStart(2, "0")}</span>
      <span>{label}</span>
    </a>
  );
}
