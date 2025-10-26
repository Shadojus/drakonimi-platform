/**
 * Molecule: ForceSimulation
 * Configuration for the physics simulation that positions nodes
 */

import { useEffect } from "react";
import { forceCollide } from "d3-force";

// Minimal typings to avoid `any`
export type GraphNode = {
  size: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};

export type ForceGraphLink = {
  strength?: number;
  source: string | GraphNode;
  target: string | GraphNode;
};

export type ForceLike = {
  strength?: (n: number | ((link: ForceGraphLink) => number)) => unknown;
  distance?: (fn: number | ((l: ForceGraphLink) => number)) => unknown;
};

export type ForceGraphLike = {
  d3Force: (name: string, force?: unknown) => ForceLike | undefined;
  d3ReheatSimulation: () => void;
};

interface ForceSimulationProps {
  graphRef: React.RefObject<ForceGraphLike | null>;
}

/**
 * Configure force simulation for optimal node spacing
 */
export const useForceSimulation = ({ graphRef }: ForceSimulationProps) => {
  useEffect(() => {
    if (graphRef.current) {
      const fg = graphRef.current;

      // Wait a bit for graph to initialize
      setTimeout(() => {
        if (!fg.d3Force) return;

        // Very strong repulsion between nodes
        const chargeForce = fg.d3Force("charge");
        chargeForce?.strength?.(FORCE_CONFIG.chargeStrength);

        // Weak centering force
        const centerForce = fg.d3Force("center");
        centerForce?.strength?.(FORCE_CONFIG.centerStrength);

        // Link force - related nodes attract each other
        const linkForce = fg.d3Force("link");
        if (linkForce?.distance) {
          linkForce.distance((link: ForceGraphLink) => {
            // Stronger connections = shorter distance (nodes closer together)
            const strength = link.strength || 0.5;
            // High strength (many common tags) = distance 30-60
            // Low strength (few common tags) = distance 80-120
            return FORCE_CONFIG.linkDistance / (strength * 2);
          });
        }
        if (linkForce?.strength) {
          linkForce.strength((link: ForceGraphLink) => {
            // Connection strength determines pull force
            const strength = link.strength || 0.5;
            return FORCE_CONFIG.linkStrength * strength;
          });
        }

        // Strong collision detection
        fg.d3Force(
          "collide",
          forceCollide<GraphNode>()
            .radius((node: GraphNode) => node.size + FORCE_CONFIG.collisionRadius)
            .strength(FORCE_CONFIG.collisionStrength)
        );

        // Reheat simulation to apply new forces
        fg.d3ReheatSimulation();
      }, 100);
    }
  }, [graphRef]);
};

/**
 * Force simulation configuration constants
 * EXACT same as Drakonimi and Funginomi
 */
export const FORCE_CONFIG = {
  velocityDecay: 0.3, // moderate friction for smooth movement
  alphaDecay: 0.05, // faster cooling for stability
  warmupTicks: 60, // quick warmup
  cooldownTicks: 80, // settle without freezing
  chargeStrength: -3000, // 40% stronger repulsion - non-related nodes farther apart
  centerStrength: 0.08, // stronger centering to keep nodes together
  collisionRadius: 15, // Much larger padding - ensures minimum distance
  collisionStrength: 0.95, // Very strong collision enforcement
  maxRadius: 400, // tighter boundary for compact view
  linkDistance: 120, // Larger base distance between connected nodes
  linkStrength: 0.35, // Slightly weaker attraction for more space
};

/**
 * Radial boundary constraint - keeps nodes within a certain radius
 */
export const applyRadialBoundary = (nodes: GraphNode[], maxRadius: number = FORCE_CONFIG.maxRadius) => {
  nodes.forEach((node: GraphNode) => {
    const { x = 0, y = 0 } = node;
    const distance = Math.sqrt(x * x + y * y);
    
    if (distance > maxRadius) {
      const scale = maxRadius / distance;
      node.x = x * scale;
      node.y = y * scale;
      
      // Dampen velocity when hitting boundary
      if (node.vx) node.vx *= 0.5;
      if (node.vy) node.vy *= 0.5;
    }
  });
};
export default useForceSimulation;
