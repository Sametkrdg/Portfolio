"use client";

import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import {
  NAV_SECTION_IDS,
  type Locale,
  type NavItemProps,
  type PortfolioContent,
  type SectionId,
} from "@/src/lib/types";
import { useScrollSpy } from "@/src/lib/useScrollSpy";

/**
 * Sticky left sidebar. Same place in every theme, hidden below `md` where the
 * theme bar takes over the bottom of the screen.
 *
 * The shell decides *which* item is active; how that is shown belongs to the
 * theme, which is why `NavItem` arrives as a prop rather than being written
 * here.
 */
export default function SideNav({
  NavItem,
  content,
  locale,
}: {
  NavItem: ComponentType<NavItemProps>;
  content: PortfolioContent;
  locale: Locale;
}) {
  const t = useTranslations("nav");
  const active = useScrollSpy(NAV_SECTION_IDS, NAV_SECTION_IDS[0]);

  function select(id: SectionId) {
    const el = document.getElementById(id);
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

    /*
     * The hash is written on click only. Letting scroll-spy write it would
     * fill the back-button history with every section scrolled past.
     */
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="side-nav">
      <div className="side-identity">
        <p className="side-name">{content.meta.name}</p>
        <p className="side-role">{content.meta.role[locale]}</p>
        <p className="side-location">{content.meta.location[locale]}</p>
      </div>

      <nav aria-label={t("ariaLabel")}>
        <ul className="side-nav-list">
          {NAV_SECTION_IDS.map((id, index) => (
            <li key={id}>
              <NavItem
                id={id}
                label={t(id)}
                href={`#${id}`}
                index={index}
                isActive={active === id}
                onSelect={select}
              />
            </li>
          ))}
        </ul>
      </nav>

      <p className="side-availability">
        <span className="side-availability-dot" aria-hidden />
        {content.meta.availability[locale]}
      </p>
    </div>
  );
}
