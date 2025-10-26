/**
 * Atom: DragonLink
 * Represents a connection between two dragons based on shared tags
 */

export interface DragonLinkData {
  source: string;
  target: string;
  strength: number;
}

/**
 * Calculate link color based on strength
 */
export const getLinkColor = (strength: number): string => {
  if (strength >= 3) {
    return "rgba(255, 215, 0, 0.15)"; // More transparent gold for strong connections
  } else if (strength >= 2) {
    return "rgba(255, 215, 0, 0.10)"; // Very transparent gold
  } else {
    return "rgba(255, 215, 0, 0.05)"; // Nearly invisible gold
  }
};

/**
 * Calculate link width based on strength with balanced scaling
 * Uses a logarithmic scale to prevent links from becoming too thick
 */
export const getLinkWidth = (strength: number): number => {
  const baseWidth = 0.8;
  // Logarithmic scaling: 1 tag = 0.8, 2 tags = 1.3, 3 tags = 1.6, 4+ tags = 1.8
  return baseWidth + Math.log(strength + 1) * 0.5;
};

/**
 * Calculate number of directional particles based on strength
 */
export const getLinkParticles = (strength: number): number => {
  return Math.ceil((strength || 0) * 2);
};

export default DragonLinkData;
