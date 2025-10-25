"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface Dragon {
  _id: string;
  name: string;
  origin: string;
  tags: string[];
  description: string;
}

interface BubbleNode {
  id: string;
  name: string;
  type: string;
  color: string;
  size: number;
  dragonId?: string;
  tags?: string[];
}

interface BubbleLink {
  source: string;
  target: string;
  strength?: number;
}

interface BubbleCloudProps {
  dragons: Dragon[];
  onDragonClick: (dragonId: string) => void;
  searchQuery?: string;
}

export default function BubbleCloud({
  dragons,
  onDragonClick,
  searchQuery = "",
}: BubbleCloudProps) {
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("bubble-container");
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: Math.min(700, window.innerHeight * 0.7),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Tag colors for dragon attributes
  const tagColors: Record<string, string> = {
    fire: "#DC143C",
    ice: "#4169E1",
    wisdom: "#FFD700",
    power: "#8B0000",
    ancient: "#CD853F",
    legendary: "#DAA520",
    mystical: "#9370DB",
    epic: "#FF4500",
    volcanic: "#B22222",
    frost: "#00CED1",
    guardian: "#2E8B57",
    winter: "#87CEEB",
    rare: "#DDA0DD",
    knowledge: "#F0E68C",
  };

  // Create nodes from dragons
  const nodes: BubbleNode[] = dragons.map((dragon) => {
    // Determine primary tag for color
    const primaryTag = dragon.tags[0] || "ancient";
    const color = tagColors[primaryTag] || "#B8860B";
    
    // Calculate size based on tags and description length
    const baseSize = 15;
    const sizeModifier = Math.min(dragon.tags.length * 2, 10);
    
    return {
      id: dragon._id,
      name: dragon.name,
      type: "dragon",
      color: color,
      size: baseSize + sizeModifier,
      dragonId: dragon._id,
      tags: dragon.tags,
    };
  });

  // Create links based on tag similarity
  const links: BubbleLink[] = [];
  for (let i = 0; i < dragons.length; i++) {
    for (let j = i + 1; j < dragons.length; j++) {
      const dragon1 = dragons[i];
      const dragon2 = dragons[j];
      
      // Calculate tag overlap
      const commonTags = dragon1.tags.filter(tag => dragon2.tags.includes(tag));
      
      if (commonTags.length > 0) {
        links.push({
          source: dragon1._id,
          target: dragon2._id,
          strength: commonTags.length,
        });
      }
    }
  }

  const graphData = { nodes, links };

  const handleNodeClick = (node: any) => {
    if (node.dragonId) {
      onDragonClick(node.dragonId);
    }
  };

  return (
    <div
      id="bubble-container"
      className="w-full bg-dragon-bg rounded-lg overflow-hidden border-2 border-dragon-primary/30"
      style={{ height: dimensions.height }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0604"
        nodeRelSize={6}
        nodeVal={(node: any) => node.size}
        nodeLabel={(node: any) => `${node.name}\n${node.tags?.join(', ') || ''}`}
        nodeColor={(node: any) => node.color}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `bold ${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Draw glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = node.color;
          ctx.fillStyle = node.color;
          
          // Draw circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // Reset shadow
          ctx.shadowBlur = 0;
          
          // Draw label with background
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          const labelWidth = ctx.measureText(label).width;
          ctx.fillRect(
            node.x - labelWidth / 2 - 4,
            node.y + node.size + 8,
            labelWidth + 8,
            fontSize + 6
          );
          
          // Draw label text
          ctx.fillStyle = "#D4AF37";
          ctx.fillText(label, node.x, node.y + node.size + 15 / globalScale);
        }}
        linkColor={(link: any) => {
          const strength = link.strength || 1;
          const opacity = 0.2 + (strength * 0.2);
          return `rgba(218, 165, 32, ${opacity})`;
        }}
        linkWidth={(link: any) => (link.strength || 1) * 1.5}
        linkDirectionalParticles={(link: any) => link.strength || 0}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.002}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400, 100);
          }
        }}
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.02}
        nodeCanvasObjectMode={() => "replace"}
      />
    </div>
  );
}
