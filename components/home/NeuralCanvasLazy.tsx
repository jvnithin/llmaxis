"use client";

import dynamic from "next/dynamic";

const NeuralCanvas = dynamic(() => import("./NeuralCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function NeuralCanvasLazy() {
  return <NeuralCanvas />;
}
