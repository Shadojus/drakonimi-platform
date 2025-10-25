/**
 * Molecule: ForceSimulation
 * Configuration for the physics simulation that positions nodes
 */

import { useEffect } from "react";
import { forceCollide } from "d3-force";

interface ForceSimulationProps {
  graphRef: React.RefObject<any>;
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
        if (chargeForce) {
          chargeForce.strength(FORCE_CONFIG.chargeStrength);
        }

        // Weak centering force
        const centerForce = fg.d3Force("center");
        if (centerForce) {
          centerForce.strength(FORCE_CONFIG.centerStrength);
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
 * Optimized for spread-out, readable network
 */
export const FORCE_CONFIG = {
  velocityDecay: 0.4, // Higher = stops faster
  alphaDecay: 0.02, // Higher = simulation ends faster
  warmupTicks: 100, // Reduced initial ticks
  cooldownTicks: 50, // Much shorter to stop rotation quickly
  chargeStrength: -1200, // Very strong repulsion for better spacing
  centerStrength: 0.05, // Weaker centering pull
  collisionRadius: 20, // More spacing between nodes
  collisionStrength: 1.0, // Full collision force strength
};

export default useForceSimulation;
