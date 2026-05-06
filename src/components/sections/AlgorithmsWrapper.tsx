"use client";

import dynamic from "next/dynamic";

const Algorithms = dynamic(() => import("./Algorithms"), { ssr: false });

export default function AlgorithmsWrapper() {
  return <Algorithms />;
}
