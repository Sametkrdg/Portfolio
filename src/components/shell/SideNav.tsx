"use client";

import { useTranslations } from "next-intl";
import { NAV_SECTION_IDS, type SectionId } from "@/src/lib/types";
import { useScrollSpy } from "@/src/lib/useScrollSpy";

/**
 * Sticky left sidebar. Present in every theme at the same place; only its
 * styling changes, and the active-item emphasis is the theme's job (it comes
 * from tokens under `[data-theme]`).
 *
 * Hidden entirely below `md` — on mobile the theme bar takes over at the
 * bottom of the screen.
 */
export default function SideNav() {
  const t = useTranslations("nav");
  const active = useScrollSpy(NAV_SECTION_IDS, NAV_SECTION_IDS[0]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

    /*
     * The hash is written on click only. Letting scroll-spy write it would
     * fill the back-button history with every section the visitor passes.
     */
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="side-nav hidden md:flex md:flex-col"
    >
      <ul className="flex flex-col gap-[var(--nav-gap)]">
        {NAV_SECTION_IDS.map((id, i) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                aria-current={isActive ? "true" : undefined}
                data-active={isActive ? "" : undefined}
                className="nav-item"
              >
                <span className="nav-item-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="nav-item-label">{t(id)}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
