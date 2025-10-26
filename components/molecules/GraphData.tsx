/**
 * Molecule: GraphData
 * Transforms dragon data into network graph structure
 */


export interface GraphNode {
  id: string;
  name: string;
  type: string;
  color: string;
  size: number;
  dragonId: string;
  tags: string[];
  imageUrl?: string;
  isHighlighted: boolean;
  isSelected: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Calculate node size based on number of connections and tags
 */
import { getPrimaryDragonColor } from "../atoms/TagColors";
import type { Dragon } from "./ImageCache";

const calculateNodeSize = (dragon: Dragon, connections: number): number => {
  const baseSize = 22;
  const tagBonus = Math.min(dragon.tags.length * 2, 10);
  const connectionBonus = Math.min(connections * 1.5, 8);
  return baseSize + tagBonus + connectionBonus;
};

/**
 * Transform dragons into graph nodes and links
 */

export const createGraphData = (
  dragons: Dragon[],
  highlightedTags: Set<string> = new Set(),
  selectedNodeId: string | null = null
): GraphData => {
  // Count connections for each dragon
  const connectionCounts = new Map<string, number>();
  dragons.forEach((dragon) => {
    connectionCounts.set(dragon._id, 0);
  });

  // Create nodes
  const nodes: GraphNode[] = dragons.map((dragon) => {
    const isHighlighted = highlightedTags.size > 0 &&
      dragon.tags.some((tag: string) => highlightedTags.has(tag));
    const isSelected = selectedNodeId === null || dragon._id === selectedNodeId;
    return {
      id: dragon._id,
      name: dragon.name,
      type: dragon.origin,
  color: getPrimaryDragonColor(dragon.tags),
      size: 25,
      dragonId: dragon._id,
      tags: dragon.tags,
      imageUrl: dragon.imageUrl,
      isHighlighted,
      isSelected,
    };
  });

  // Create links
  const links: GraphLink[] = [];
  for (let i = 0; i < dragons.length; i++) {
    for (let j = i + 1; j < dragons.length; j++) {
      const dragon1 = dragons[i];
      const dragon2 = dragons[j];
      const commonTags = dragon1.tags.filter((tag: string) =>
        dragon2.tags.includes(tag)
      );
      if (commonTags.length > 0) {
        links.push({
          source: dragon1._id,
          target: dragon2._id,
          strength: commonTags.length,
        });
        connectionCounts.set(
          dragon1._id,
          (connectionCounts.get(dragon1._id) || 0) + 1
        );
        connectionCounts.set(
          dragon2._id,
          (connectionCounts.get(dragon2._id) || 0) + 1
        );
      }
      // Cultural origin links
      const culturalTags = [
        "european", "asian", "chinese", "japanese", "nordic", "greek", "egyptian", "aztec", "indian", "welsh"
      ];
      const dragon1Cultural = dragon1.tags.filter((tag: string) =>
        culturalTags.includes(tag.toLowerCase())
      );
      const dragon2Cultural = dragon2.tags.filter((tag: string) =>
        culturalTags.includes(tag.toLowerCase())
      );
      if (
        dragon1Cultural.length > 0 &&
        dragon2Cultural.length > 0 &&
  dragon1Cultural.some((tag: string) => dragon2Cultural.includes(tag)) &&
        commonTags.length === 0
      ) {
        links.push({
          source: dragon1._id,
          target: dragon2._id,
          strength: 0.5,
        });
        connectionCounts.set(
          dragon1._id,
          (connectionCounts.get(dragon1._id) || 0) + 1
        );
        connectionCounts.set(
          dragon2._id,
          (connectionCounts.get(dragon2._id) || 0) + 1
        );
      }
    }
  }

  // Update node sizes
  nodes.forEach((node) => {
    const dragon = dragons.find((d) => d._id === node.id);
    const connections = connectionCounts.get(node.id) || 0;
    if (dragon) {
      node.size = calculateNodeSize(dragon, connections);
    }
  });

  return { nodes, links };
};

export default createGraphData;
