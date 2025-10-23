"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface BubbleNode {
  id: string;
  name: string;
  type: string;
  color: string;
  size: number;
  categoryId?: string;
}

interface BubbleLink {
  source: string;
  target: string;
}

interface BubbleCloudProps {
  categories: Array<{
    _id: string;
    type: string;
    title: string;
    content: string;
  }>;
  dragonName: string;
  onCategoryClick: (categoryId: string) => void;
}

export default function BubbleCloud({
  categories,
  dragonName,
  onCategoryClick,
}: BubbleCloudProps) {
  const graphRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("bubble-container");
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: Math.min(600, window.innerHeight * 0.6),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Category colors - Dragon themed
  const categoryColors: Record<string, string> = {
    mythology: "#DC143C",
    powers: "#FFD700",
    history: "#8B0000",
    culture: "#CD853F",
    lore: "#B22222",
    wisdom: "#DAA520",
  };

  // Category icons
  const categoryIcons: Record<string, string> = {
    mythology: "📜",
    powers: "⚡",
    history: "🏛️",
    culture: "🌍",
    lore: "📖",
    wisdom: "🧙",
  };

  // Create nodes
  const nodes: BubbleNode[] = [
    // Center node (dragon)
    {
      id: "center",
      name: dragonName,
      type: "dragon",
      color: "#B8860B",
      size: 20,
    },
    // Category nodes
    ...categories.map((cat) => ({
      id: cat._id,
      name: `${categoryIcons[cat.type]} ${cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}`,
      type: cat.type,
      color: categoryColors[cat.type] || "#8B4513",
      size: 15,
      categoryId: cat._id,
    })),
  ];

  // Create links from center to all categories
  const links: BubbleLink[] = categories.map((cat) => ({
    source: "center",
    target: cat._id,
  }));

  const graphData = { nodes, links };

  const handleNodeClick = (node: any) => {
    if (node.categoryId) {
      onCategoryClick(node.categoryId);
    }
  };

  return (
    <div
      id="bubble-container"
      className="w-full bg-dragon-surface/30 rounded-lg overflow-hidden border border-dragon-primary/20"
      style={{ height: dimensions.height }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#1a0f0a"
        nodeRelSize={8}
        nodeVal={(node: any) => node.size}
        nodeLabel={(node: any) => node.name}
        nodeColor={(node: any) => node.color}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name;
          const fontSize = node.type === "dragon" ? 14 / globalScale : 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node.color;
          
          // Draw circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // Draw label
          ctx.fillStyle = "#D4AF37";
          ctx.fillText(label, node.x, node.y + node.size + 15 / globalScale);
        }}
        linkColor={() => "#8B0000"}
        linkWidth={2}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400, 50);
          }
        }}
      />
    </div>
  );
}
