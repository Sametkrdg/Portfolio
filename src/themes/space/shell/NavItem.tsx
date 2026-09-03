"use client";

import type { NavItemProps } from "@/src/lib/types";

/**
 * space's active emphasis: the neon underline the old navbar only showed on
 * hover, made permanent for the section you are in. The rule is on every item
 * at zero opacity, so lighting it up moves nothing.
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
      className="sp-nav-item"
    >
      <span className="sp-nav-num">0{index + 1}</span>
      <span>{label}</span>
    </a>
  );
}
