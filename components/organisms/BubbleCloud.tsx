/**
 * Organism: BubbleCloud
 * Main dragon network visualization component using Atomic Design principles
 */

"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3-force";

// Atoms
import { renderDragonNode } from "../atoms/DragonNode";
import { getLinkColor, getLinkWidth, getLinkParticles } from "../atoms/DragonLink";

// Molecules
import { useImageCache, type Dragon } from "../molecules/ImageCache";
import { createGraphData } from "../molecules/GraphData";
import { FORCE_CONFIG } from "../molecules/ForceSimulation";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

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

  // Use atomic components
  const imageCache = useImageCache(dragons);
  const graphData = createGraphData(dragons);
  
  // Apply force configuration after graph updates
  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0) {
      const fg = graphRef.current;
      
      // Give the graph time to initialize
      setTimeout(() => {
        if (fg.d3Force) {
          // Apply very strong repulsion
          fg.d3Force('charge').strength(FORCE_CONFIG.chargeStrength);
          fg.d3Force('center').strength(FORCE_CONFIG.centerStrength);
          
          // Add strong collision
          fg.d3Force('collide', d3.forceCollide()
            .radius((node: any) => node.size + FORCE_CONFIG.collisionRadius)
            .strength(FORCE_CONFIG.collisionStrength)
          );
          
          // Reheat the simulation
          fg.d3ReheatSimulation();
        }
      }, 500);
    }
  }, [graphData]);

  // Set initial random positions to spread nodes out
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      graphData.nodes.forEach((node: any) => {
        if (!node.x || !node.y) {
          // Random position in a circle
          const angle = Math.random() * 2 * Math.PI;
          const radius = 200 + Math.random() * 300;
          node.x = Math.cos(angle) * radius;
          node.y = Math.sin(angle) * radius;
        }
      });
    }
  }, [graphData]);

  // Handle responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("bubble-container");
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNodeClick = (node: any) => {
    if (node.dragonId) {
      onDragonClick(node.dragonId);
    }
  };

  return (
    <div id="bubble-container" className="w-full h-full bg-dragon-bg">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0A0A0A"
        nodeRelSize={6}
        nodeVal={(node: any) => node.size}
        nodeLabel={(node: any) =>
          `${node.name}\n${node.tags?.join(", ") || ""}`
        }
        nodeColor={(node: any) => node.color}
        nodeCanvasObject={(
          node: any,
          ctx: CanvasRenderingContext2D,
          globalScale: number
        ) => {
          const cachedImage = imageCache.get(node.dragonId);
          renderDragonNode({
            node,
            ctx,
            globalScale,
            cachedImage,
          });
        }}
        linkColor={(link: any) => getLinkColor(link.strength || 0)}
        linkWidth={(link: any) => getLinkWidth(link.strength || 0.5)}
        linkDirectionalParticles={(link: any) =>
          getLinkParticles(link.strength || 0)
        }
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleSpeed={0.003}
        onNodeClick={handleNodeClick}
        onNodeDragEnd={(node: any) => {
          // Fix node position after drag - don't let simulation move it
          node.fx = node.x;
          node.fy = node.y;
        }}
        cooldownTicks={FORCE_CONFIG.cooldownTicks}
        d3VelocityDecay={FORCE_CONFIG.velocityDecay}
        d3AlphaDecay={FORCE_CONFIG.alphaDecay}
        warmupTicks={FORCE_CONFIG.warmupTicks}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        minZoom={0.3}
        maxZoom={3}
        nodeCanvasObjectMode={() => "replace"}
      />
    </div>
  );
}
