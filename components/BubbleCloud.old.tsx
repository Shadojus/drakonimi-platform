"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { forceCollide } from "d3-force";

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
  imageUrl?: string;
}

interface BubbleNode {
  id: string;
  name: string;
  type: string;
  color: string;
  size: number;
  dragonId?: string;
  tags?: string[];
  imageUrl?: string;
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
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map());

  // Preload dragon images
  useEffect(() => {
    const cache = new Map<string, HTMLImageElement>();
    
    dragons.forEach((dragon) => {
      if (dragon.imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = dragon.imageUrl;
        img.onload = () => {
          cache.set(dragon._id, img);
          setImageCache(new Map(cache));
        };
      }
    });
  }, [dragons]);

  // Configure force simulation for better spacing
  useEffect(() => {
    if (graphRef.current) {
      const fg = graphRef.current;
      
      // Stronger repulsion between nodes
      fg.d3Force('charge').strength(-400);
      
      // Gentle centering force
      fg.d3Force('center').strength(0.1);
      
      // Add collision detection to prevent overlap
      fg.d3Force('collide', forceCollide()
        .radius((node: any) => node.size + 10)
        .strength(0.9)
      );
      
      // Reheat simulation to apply new forces
      fg.d3ReheatSimulation();
    }
  }, []);

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

  // Enhanced tag colors for dragon attributes (expanded palette)
  const tagColors: Record<string, string> = {
    // Fire/Power Dragons (red-orange spectrum)
    fire: "#FF4500",        // Orange Red
    power: "#DC143C",       // Crimson
    volcanic: "#B22222",    // Firebrick
    destruction: "#8B0000", // Dark Red
    
    // Ice/Water Dragons (blue-cyan spectrum)
    ice: "#00CED1",         // Dark Turquoise
    water: "#4169E1",       // Royal Blue
    frost: "#87CEEB",       // Sky Blue
    ocean: "#006994",       // Deep Ocean
    winter: "#B0E0E6",      // Powder Blue
    
    // Wisdom/Ancient Dragons (gold-yellow spectrum)
    wisdom: "#FFD700",      // Gold
    knowledge: "#F0E68C",   // Khaki
    ancient: "#DAA520",     // Goldenrod
    legendary: "#B8860B",   // Dark Goldenrod
    
    // Nature/Earth Dragons (green spectrum)
    earth: "#228B22",       // Forest Green
    nature: "#32CD32",      // Lime Green
    guardian: "#2E8B57",    // Sea Green
    forest: "#0B6623",      // Forest Green Dark
    
    // Mystic/Cosmic Dragons (purple-magenta spectrum)
    mystical: "#9370DB",    // Medium Purple
    cosmic: "#8B008B",      // Dark Magenta
    divine: "#DA70D6",      // Orchid
    celestial: "#9932CC",   // Dark Orchid
    holy: "#E6E6FA",        // Lavender
    
    // Dark/Death Dragons (dark spectrum)
    shadow: "#2F4F4F",      // Dark Slate Gray
    death: "#1C1C1C",       // Almost Black
    void: "#191970",        // Midnight Blue
    darkness: "#0C0C0C",    // Very Dark Gray
    underworld: "#301934",  // Dark Purple
    
    // Lightning/Storm (electric blue-yellow)
    lightning: "#FFFF00",   // Yellow
    storm: "#4B0082",       // Indigo
    thunder: "#FFD700",     // Gold
    
    // Light/Rainbow (bright spectrum)
    light: "#FFFACD",       // Lemon Chiffon
    rainbow: "#FF1493",     // Deep Pink
    hope: "#87CEEB",        // Sky Blue
    
    // Special/Unique
    cursed: "#8B4513",      // Saddle Brown
    venomous: "#9ACD32",    // Yellow Green
    treasure: "#FFD700",    // Gold
    greed: "#B8860B",       // Dark Goldenrod
    chaos: "#DC143C",       // Crimson
    
    // Cultural
    european: "#4169E1",    // Royal Blue
    asian: "#DC143C",       // Crimson
    chinese: "#FF0000",     // Red
    japanese: "#FF4500",    // Orange Red
    nordic: "#87CEEB",      // Sky Blue
    greek: "#FFD700",       // Gold
    egyptian: "#DAA520",    // Goldenrod
    aztec: "#32CD32",       // Lime Green
    indian: "#FF6347",      // Tomato
    welsh: "#DC143C",       // Crimson Red
    
    // Types
    serpent: "#9370DB",     // Medium Purple
    wyvern: "#4B0082",      // Indigo
    feathered: "#00CED1",   // Dark Turquoise
    
    // Default
    benevolent: "#32CD32",  // Lime Green
    primordial: "#8B008B",  // Dark Magenta
    eternity: "#9370DB",    // Medium Purple
    time: "#6A5ACD",        // Slate Blue
    space: "#191970",       // Midnight Blue
  };

  // Create nodes from dragons with LARGER sizes
  const nodes: BubbleNode[] = dragons.map((dragon) => {
    // Determine primary tag for color
    const primaryTag = dragon.tags[0] || "ancient";
    const color = tagColors[primaryTag] || "#B8860B";
    
    // Calculate size based on tags and description length (LARGER than before)
    const baseSize = 22; // increased from 15
    const sizeModifier = Math.min(dragon.tags.length * 3, 18); // increased from * 2, 10
    
    return {
      id: dragon._id,
      name: dragon.name,
      type: "dragon",
      color: color,
      size: baseSize + sizeModifier,
      dragonId: dragon._id,
      tags: dragon.tags,
      imageUrl: dragon.imageUrl, // Add image URL
    };
  });

  // Create links based on tag similarity with STRONGER connections
  const links: BubbleLink[] = [];
  for (let i = 0; i < dragons.length; i++) {
    for (let j = i + 1; j < dragons.length; j++) {
      const dragon1 = dragons[i];
      const dragon2 = dragons[j];
      
      // Calculate tag overlap
      const commonTags = dragon1.tags.filter(tag => dragon2.tags.includes(tag));
      
      // Create connection if there are common tags
      if (commonTags.length > 0) {
        links.push({
          source: dragon1._id,
          target: dragon2._id,
          strength: commonTags.length,
        });
      }
      
      // Also connect dragons with similar cultural origins
      const culturalTags = ["european", "asian", "chinese", "japanese", "nordic", "greek", "egyptian", "aztec", "indian", "welsh"];
      const dragon1Cultural = dragon1.tags.filter(t => culturalTags.includes(t));
      const dragon2Cultural = dragon2.tags.filter(t => culturalTags.includes(t));
      const sharedCulture = dragon1Cultural.some(t => dragon2Cultural.includes(t));
      
      if (sharedCulture && commonTags.length === 0) {
        links.push({
          source: dragon1._id,
          target: dragon2._id,
          strength: 0.5, // weaker cultural connection
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
      className="w-full h-full bg-dragon-bg"
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0604"
        nodeRelSize={8} // increased from 6
        nodeVal={(node: any) => node.size}
        nodeLabel={(node: any) => `${node.name}\n${node.tags?.join(', ') || ''}`}
        nodeColor={(node: any) => node.color}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name;
          const fontSize = 14 / globalScale;
          ctx.font = `bold ${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Draw glow effect
          ctx.shadowBlur = 25;
          ctx.shadowColor = node.color;
          
          // Check if we have a cached image for this dragon
          const cachedImage = imageCache.get(node.dragonId);
          
          if (cachedImage && cachedImage.complete) {
            // Draw circular clipping path for image
            ctx.save();
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.clip();
            
            // Draw image
            ctx.drawImage(
              cachedImage,
              node.x - node.size,
              node.y - node.size,
              node.size * 2,
              node.size * 2
            );
            
            ctx.restore();
            
            // Draw colored border around image
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
            ctx.stroke();
          } else {
            // Fallback: draw colored circle if no image
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
            ctx.fill();
          }
          
          // Reset shadow
          ctx.shadowBlur = 0;
          
          // Draw label with background
          ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
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
          const strength = link.strength || 0.5;
          const opacity = 0.2 + (strength * 0.25); // increased visibility
          return `rgba(218, 165, 32, ${opacity})`;
        }}
        linkWidth={(link: any) => (link.strength || 0.5) * 2.5} // increased from 1.5
        linkDirectionalParticles={(link: any) => Math.ceil((link.strength || 0) * 2)}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleSpeed={0.003}
        onNodeClick={handleNodeClick}
        cooldownTicks={200}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400, 80);
          }
        }}
        // Better force simulation for readability
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.01}
        warmupTicks={100}
        // Enable interactions
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
