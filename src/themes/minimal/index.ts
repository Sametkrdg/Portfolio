import type { ThemeDefinition } from "@/src/lib/types";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import NavItem from "./shell/NavItem";

/* Ships with this theme's chunk, so no other theme pays for these rules. */
import "./theme.css";

const minimal: ThemeDefinition = {
  slug: "minimal",
  sections: { hero: Hero, about: About, skills: Skills, experience: Experience, projects: Projects, contact: Contact },
  shell: { NavItem },
};

export default minimal;
