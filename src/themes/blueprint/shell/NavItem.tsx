"use client";

import type { NavItemProps } from "@/src/lib/types";

/**
 * blueprint's active emphasis: the item gets boxed, the way a callout is
 * circled on a drawing. The dashed border is always present but transparent
 * when idle, so nothing reflows when it lights up.
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
      className="bp-nav-item"
    >
      <span className="bp-nav-ref">
        A/{String(index + 1).padStart(2, "0")}
      </span>
      <span>{label}</span>
    </a>
  );
}
