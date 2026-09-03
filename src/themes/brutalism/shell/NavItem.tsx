"use client";

import type { NavItemProps } from "@/src/lib/types";

/**
 * brutalism's active emphasis: the item becomes a filled orange block with a
 * hard shadow. Border and shadow slots exist on every item — transparent when
 * idle — so the box never changes size.
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
      className="br-nav-item"
    >
      <span className="br-nav-num">§{String(index + 1).padStart(2, "0")}</span>
      <span>{label}</span>
    </a>
  );
}
