import Hero               from "@/src/components/sections/Hero";
import About              from "@/src/components/sections/About";
import Skills             from "@/src/components/sections/Skills";
import Projects           from "@/src/components/sections/Projects";
import Contact            from "@/src/components/sections/Contact";
import AlgorithmsWrapper  from "@/src/components/sections/AlgorithmsWrapper";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <AlgorithmsWrapper />
      <Contact />
    </main>
  );
}
