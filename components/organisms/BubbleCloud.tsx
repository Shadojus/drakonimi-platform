/**
 * Organism: BubbleCloud
 * Main dragon network visualization component using Atomic Design principles
 */

"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState, useMemo, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3-force";

// Atoms
import { renderDragonNode } from "../atoms/DragonNode";
import { getLinkColor, getLinkWidth, getLinkParticles } from "../atoms/DragonLink";

// Molecules
import { useImageCache, type Dragon } from "../molecules/ImageCache";
import { createGraphData, type GraphNode as DragonGraphNode, type GraphData as DragonGraphData } from "../molecules/GraphData";
import { FORCE_CONFIG } from "../molecules/ForceSimulation";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface BubbleCloudProps {
  dragons: Dragon[];
  onDragonClick: (dragonId: string) => void;
  searchQuery?: string;
  highlightedTags?: Set<string>; // NEW: for tag highlighting
  selectedNodeIds?: string[]; // Changed to array for multi-selection
}

function BubbleCloud({
  dragons,
  onDragonClick,
  // rename to avoid unused-var lint while keeping prop API stable
  searchQuery: _searchQuery = "",
  highlightedTags = new Set(),
  selectedNodeIds = [],
}: BubbleCloudProps) {
  type FGNode = d3.SimulationNodeDatum & {
    id?: string | number;
    size?: number;
    name?: string;
    tags?: string[];
    color?: string;
    dragonId?: string;
    imageUrl?: string;
  };
  type FGLink = { source?: any; target?: any; strength?: number };
  const graphRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  // Touch to avoid unused-var lint
  void _searchQuery;
  
  // PERFORMANCE FIX: Use refs for highlight/selection state to avoid re-renders
  const highlightedTagsRef = useRef(highlightedTags);
  const selectedNodeIdsRef = useRef(selectedNodeIds);
  
  // Update refs when props change (doesn't trigger re-render)
  highlightedTagsRef.current = highlightedTags;
  selectedNodeIdsRef.current = selectedNodeIds;

  // Use atomic components
  const imageCache = useImageCache(dragons);
  // IMPORTANT: Build graph data ONLY from raw dragons so positions persist across UI state changes
  const graphData = useMemo<DragonGraphData>(() => createGraphData(dragons, new Set(), null), [dragons]);
  
  // Set initial random positions ONCE per dataset (stable across UI state changes)
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      graphData.nodes.forEach((node: DragonGraphNode & { fx?: number; fy?: number; x?: number; y?: number }) => {
        if (node.x === undefined || node.y === undefined) {
          const angle = Math.random() * 2 * Math.PI;
          const radius = 50 + Math.random() * 200; // moderate initial spread
          node.x = Math.cos(angle) * radius;
          node.y = Math.sin(angle) * radius;
        }
        // Ensure nodes are not locked by previous logic
        node.fx = undefined;
        node.fy = undefined;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragons.length]);

  // Configure forces ONCE per dataset; keep simulation natural and stable
  useEffect(() => {
    if (!graphRef.current || graphData.nodes.length === 0) return;
    const fg = graphRef.current;
    if (!fg.d3Force) return;

    // Repulsion
    const chargeForce = fg.d3Force('charge') as d3.ForceManyBody<FGNode> | undefined;
    chargeForce?.strength(FORCE_CONFIG.chargeStrength);
    chargeForce?.distanceMin?.(50);
    chargeForce?.distanceMax?.(2000);

  // Gentle pull towards center via x/y forces
  fg.d3Force('x', d3.forceX<FGNode>(0).strength(FORCE_CONFIG.centerStrength));
  fg.d3Force('y', d3.forceY<FGNode>(0).strength(FORCE_CONFIG.centerStrength));

    // Collision to enforce minimum spacing
    fg.d3Force(
      'collide',
      d3.forceCollide<FGNode>()
        .radius((node) => (node.size || 2) + FORCE_CONFIG.collisionRadius)
        .strength(FORCE_CONFIG.collisionStrength)
        .iterations(2)
    );

    // Link force - related nodes attract each other
    const linkForce = fg.d3Force('link') as any;
    if (linkForce) {
      if (linkForce.distance && typeof linkForce.distance === 'function') {
        linkForce.distance((link: any) => {
          // Stronger connections = shorter distance (nodes closer together)
          const strength = link.strength || 0.5;
          // High strength (many common tags) = distance 30-60
          // Low strength (few common tags) = distance 80-120
          return FORCE_CONFIG.linkDistance / (strength * 2);
        });
      }
      if (linkForce.strength && typeof linkForce.strength === 'function') {
        linkForce.strength((link: any) => {
          // Connection strength determines pull force
          const strength = link.strength || 0.5;
          return FORCE_CONFIG.linkStrength * strength;
        });
      }
    }

    // Optional boundary to keep within a broad radius
    // No explicit boundary; rely on gentle centering forces

    fg.d3ReheatSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragons.length]);

  // Handle responsive dimensions with requestAnimationFrame for better performance
  useEffect(() => {
    const updateDimensions = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        const container = document.getElementById("bubble-container");
        if (container) {
          setDimensions({
            width: container.offsetWidth,
            height: container.offsetHeight,
          });
        }
      });
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleNodeClick = useCallback((node: { dragonId?: string }) => {
    if (node.dragonId) {
      onDragonClick(node.dragonId);
    }
  }, [onDragonClick]);

  const handleNodeDragEnd = useCallback((node: FGNode) => {
    if (node && node.x !== undefined && node.y !== undefined) {
      // Freeze node at its new position after manual drag
      node.fx = node.x;
      node.fy = node.y;
    }
  }, []);
  
  // PERFORMANCE FIX: Force canvas repaint when highlight/selection changes WITHOUT React re-render
  useEffect(() => {
    if (graphRef.current) {
      // Trigger a single canvas redraw by nudging the force graph
      // This is much cheaper than React re-rendering the entire component
      graphRef.current._refreshCanvas?.();
    }
  }, [highlightedTags, selectedNodeIds]);

  // PERFORMANCE FIX: Create stable predicates that read from refs (no dependencies = no recreations)
  const isNodeSelected = useCallback((node: FGNode) => {
    const selected = selectedNodeIdsRef.current;
    return selected.includes(node.dragonId || '');
  }, []); // Empty deps - stable forever

  const isNodeHighlighted = useCallback((node: FGNode) => {
    const highlighted = highlightedTagsRef.current;
    if (highlighted.size === 0) return false;
    return node.tags?.some((tag: string) => highlighted.has(tag)) ?? false;
  }, []); // Empty deps - stable forever

  // Memoize the node renderer for better performance
  const nodeCanvasObject = useCallback((
    node: FGNode,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const dragon = dragons.find((d) => d._id === node.dragonId);
    if (!dragon) return;
    
    const cachedImage = node.dragonId ? imageCache.get(node.dragonId) : undefined;
    
    renderDragonNode({
      node: { 
        type: 'dragon', 
        color: node.color || '#888', 
        size: node.size || 20, 
        name: node.name || '', 
        dragonId: node.dragonId, 
        tags: node.tags, 
        imageUrl: node.imageUrl, 
        x: node.x, 
        y: node.y, 
        isSelected: isNodeSelected(node), 
        isHighlighted: isNodeHighlighted(node), 
        id: String(node.dragonId || node.name || '') 
      },
      ctx,
      globalScale,
      cachedImage,
    });
  }, [dragons, imageCache]); // PERFORMANCE FIX: Remove dependencies that change on highlight/selection


  return (
    <div id="bubble-container" className="w-full h-full bg-dragon-bg">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0A0A0A"
        nodeRelSize={6}
  nodeVal={(node: FGNode) => node.size ?? 20}
  nodeLabel={(node: FGNode) => `${node.name}\n${node.tags?.join(", ") || ""}`}
  nodeColor={(node: FGNode) => node.color || '#888'}
        nodeCanvasObject={nodeCanvasObject}
          linkColor={(link: FGLink) => getLinkColor(link.strength ?? 0)}
          linkWidth={(link: FGLink) => getLinkWidth(link.strength ?? 0.5)}
          linkDirectionalParticles={(link: FGLink) => getLinkParticles(link.strength ?? 0)}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleSpeed={0.003}
  onNodeClick={(node: any) => handleNodeClick(node)}
        onNodeDragEnd={handleNodeDragEnd}
  cooldownTicks={FORCE_CONFIG.cooldownTicks}
        d3VelocityDecay={FORCE_CONFIG.velocityDecay}
  d3AlphaDecay={FORCE_CONFIG.alphaDecay}
  d3AlphaMin={FORCE_CONFIG.alphaMin}
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

// Custom comparison function for React.memo with PROPER Set comparison
const customComparison = (prevProps: BubbleCloudProps, nextProps: BubbleCloudProps) => {
  const dragonsEqual = prevProps.dragons.length === nextProps.dragons.length;
  
  // Deep compare selectedNodeIds - must check actual values not just length
  const selectedIdsEqual = 
    (prevProps.selectedNodeIds?.length || 0) === (nextProps.selectedNodeIds?.length || 0) &&
    (prevProps.selectedNodeIds?.every((id, idx) => id === nextProps.selectedNodeIds?.[idx]) ?? true);
  
  // PERFORMANCE FIX: Properly compare Set contents, not just size
  const prevTags = Array.from(prevProps.highlightedTags || []).sort();
  const nextTags = Array.from(nextProps.highlightedTags || []).sort();
  const highlightedTagsEqual = 
    prevTags.length === nextTags.length &&
    prevTags.every((tag, idx) => tag === nextTags[idx]);
  
  const callbackEqual = prevProps.onDragonClick === nextProps.onDragonClick;
  
  return dragonsEqual && selectedIdsEqual && highlightedTagsEqual && callbackEqual;
};

export default memo(BubbleCloud, customComparison);
