import React from "react";

export default function NeuralCanvas() {
  const nodes = [
    [8, 18],
    [20, 40],
    [16, 73],
    [38, 22],
    [43, 57],
    [36, 84],
    [63, 13],
    [68, 42],
    [61, 77],
    [84, 28],
    [90, 65],
  ];

  const links = [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 6],
    [3, 7],
    [4, 5],
    [4, 7],
    [4, 8],
    [5, 8],
    [6, 7],
    [6, 9],
    [7, 8],
    [7, 9],
    [7, 10],
    [8, 10],
    [9, 10],
  ];

  return (
    <svg
      className="neural-network"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className="neural-lines">
        {links.map(([a, b], index) => (
          <line
            key={index}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      <g className="neural-nodes">
        {nodes.map(([x, y], index) => (
          <g key={index}>
            <circle className="node-halo" cx={x} cy={y} r="1.8" />
            <circle cx={x} cy={y} r=".45" />
          </g>
        ))}
      </g>
    </svg>
  );
}
