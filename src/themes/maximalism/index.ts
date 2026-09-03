import type { ThemeDefinition } from "@/src/lib/types";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import NavItem from "./shell/NavItem";

import "./theme.css";

const maximalism: ThemeDefinition = {
  slug: "maximalism",
  sections: { hero: Hero, about: About, skills: Skills, experience: Experience, projects: Projects, contact: Contact },
  shell: { NavItem },
};

export default maximalism;
