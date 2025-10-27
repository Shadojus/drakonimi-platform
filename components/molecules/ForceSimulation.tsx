"use client";

/**
 * Molecule: ForceSimulation
 * Configuration for the physics simulation that positions nodes
 */

import { useEffect } from "react";
import { forceCollide } from "d3-force";
import type { GraphNode, GraphLink } from "./GraphData";

// Minimal typings for D3 force methods
type ForceLike = {
  strength?: (n: number | ((link: GraphLink) => number)) => unknown;
  distance?: (fn: number | ((l: GraphLink) => number)) => unknown;
};

type ForceGraphLike = {
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
          linkForce.distance((link: GraphLink) => {
            // Stronger connections = shorter distance (nodes closer together)
            const strength = link.strength || 0.5;
            // High strength (many common tags) = distance 30-60
            // Low strength (few common tags) = distance 80-120
            return FORCE_CONFIG.linkDistance / (strength * 2);
          });
        }
        if (linkForce?.strength) {
          linkForce.strength((link: GraphLink) => {
            // Connection strength determines pull force
            const strength = link.strength || 0.5;
            return FORCE_CONFIG.linkStrength * strength;
          });
        }

        // Strong collision detection
        fg.d3Force(
          "collide",
          forceCollide()
            .radius((node: any) => node.size + FORCE_CONFIG.collisionRadius)
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
 * OPTIMIZED for performance
 */
export const FORCE_CONFIG = {
  velocityDecay: 0.4, // Higher = faster settling
  alphaDecay: 0.08, // Higher = simulation cools down faster
  alphaMin: 0.001, // Stop simulation earlier
  warmupTicks: 30, // Reduced from 60
  cooldownTicks: 40, // Reduced from 80
  chargeStrength: -3000,
  centerStrength: 0.08,
  collisionRadius: 15,
  collisionStrength: 0.95,
  maxRadius: 400,
  linkDistance: 120,
  linkStrength: 0.35,
};

/**
 * Radial boundary constraint - keeps nodes within a certain radius
 */
export const applyRadialBoundary = (nodes: any[], maxRadius: number = FORCE_CONFIG.maxRadius) => {
  nodes.forEach((node: any) => {
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
