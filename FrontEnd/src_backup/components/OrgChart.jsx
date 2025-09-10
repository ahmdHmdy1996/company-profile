/* eslint-disable no-unused-vars */
import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";

/**
 * Reusable, data‑driven Org Chart (JS version)
 * - Drop into any React app.
 * - <OrgChart data={...} /> where data is a tree { id, name, title?, children? }
 */

/** Utility hook: observe container size for responsive layout */
function useSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const cr = e.contentRect;
        setSize({ width: cr.width, height: cr.height });
      }
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

/**
 * Node styling to match the exact design from the attachment
 * - depth 0: Navy blue background (CEO/Executive level)
 * - depth 1: Brown/amber background (Department heads)
 * - deeper: White background with border (Staff level)
 */
function nodeColors(depth) {
  if (depth === 0)
    return {
      bg: "bg-[#4A5D7A]", // Navy blue matching the design
      text: "text-white",
      shadow: "shadow-lg",
      border: "",
    };
  if (depth === 1)
    return {
      bg: "bg-[#B8860B]", // Brown/amber matching the design
      text: "text-white",
      shadow: "shadow-md",
      border: "",
    };
  return {
    bg: "bg-white",
    text: "text-gray-700",
    shadow: "shadow-sm",
    border: "border-2 border-gray-300",
  };
}

function Card({ depth, name, title }) {
  const c = nodeColors(depth);
  return (
    <div
      className={[
        "rounded-xl px-6 py-4 w-[180px] h-[80px] flex flex-col justify-center items-center text-center select-none transition-all duration-200 hover:scale-105",
        c.bg,
        c.text,
        c.shadow,
        c.border,
      ].join(" ")}
    >
      <div className="font-semibold text-sm leading-tight">{name}</div>
      {title && (
        <div
          className={`text-xs mt-1 ${
            depth === 0 || depth === 1 ? "opacity-90" : "opacity-70"
          }`}
        >
          {title}
        </div>
      )}
    </div>
  );
}

// Layout settings to match the design spacing
const NODE_SIZE = { x: 200, y: 140 }; // horizontal/vertical gaps
const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

export default function OrgChart({ data }) {
  const { ref, size } = useSize();

  const { nodes, links, width, height } = useMemo(() => {
    const root = d3.hierarchy(data);
    const tree = d3
      .tree()
      .nodeSize([NODE_SIZE.x, NODE_SIZE.y])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.25));

    const laidOut = tree(root);
    const xVals = laidOut.descendants().map((d) => d.x);
    const yVals = laidOut.descendants().map((d) => d.y);
    const x0 = Math.min(...xVals, 0);
    const x1 = Math.max(...xVals, 0);
    const y0 = Math.min(...yVals, 0);
    const y1 = Math.max(...yVals, 0);

    // Normalize to positive space and add margins
    const nodes = laidOut
      .descendants()
      .map((n) => ({
        ...n,
        x: n.x - x0 + MARGIN.left,
        y: n.y - y0 + MARGIN.top,
      }));

    const links = laidOut.links().map((l) => ({
      source: {
        x: l.source.x - x0 + MARGIN.left,
        y: l.source.y - y0 + MARGIN.top,
      },
      target: {
        x: l.target.x - x0 + MARGIN.left,
        y: l.target.y - y0 + MARGIN.top,
      },
      depth: l.target.depth, // child depth
    }));

    const width = x1 - x0 + MARGIN.left + MARGIN.right;
    const height = y1 - y0 + MARGIN.top + MARGIN.bottom;

    return { nodes, links, width, height };
  }, [data]);

  const viewWidth = Math.max(width, size.width || width);
  const viewHeight = Math.max(height, 400);

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="mx-auto block"
        width={viewWidth}
        height={viewHeight}
      >
        {/* connectors - simple lines matching the design */}
        <g fill="none" strokeWidth="2" stroke="#999">
          {links.map((l, i) => (
            <path
              key={i}
              d={
                // Simple L-shaped connectors like in the design
                `M${l.source.x},${l.source.y + 40}
                 V${l.target.y - 40}
                 H${l.target.x}`
              }
              className="stroke-gray-400"
            />
          ))}
        </g>

        {/* nodes */}
        <g>
          {nodes.map((n, i) => (
            <motion.g
              key={`${n.data.id || i}-${i}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              transform={`translate(${n.x - 90}, ${n.y - 40})`}
            >
              <foreignObject width={180} height={80} pointerEvents="auto">
                <Card depth={n.depth} name={n.data.name} title={n.data.title} />
              </foreignObject>
            </motion.g>
          ))}
        </g>
      </svg>
    </div>
  );
}

// staffToTree moved to utils/staffToTree.js to satisfy react-refresh lint rule
