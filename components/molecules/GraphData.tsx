/**
 * Molecule: GraphData
 * Transforms dragon data into network graph structure
 */

import type { DragonNodeData } from "../atoms/DragonNode";
import type { DragonLinkData } from "../atoms/DragonLink";
import { getPrimaryDragonColor } from "../atoms/TagColors";
import type { Dragon } from "./ImageCache";

export interface GraphData {
  nodes: DragonNodeData[];
  links: DragonLinkData[];
}

/**
 * Calculate node size based on number of connections and tags
 */
const calculateNodeSize = (dragon: Dragon, connections: number): number => {
  const baseSize = 22;
  const tagBonus = Math.min(dragon.tags.length * 2, 10);
  const connectionBonus = Math.min(connections * 1.5, 8);
  return baseSize + tagBonus + connectionBonus;
};

/**
 * Transform dragons into graph nodes and links
 */
export const createGraphData = (dragons: Dragon[]): GraphData => {
  // Count connections for each dragon
  const connectionCounts = new Map<string, number>();
  dragons.forEach((dragon) => {
    connectionCounts.set(dragon._id, 0);
  });

  // Create nodes - let force simulation position them naturally
  const nodes: DragonNodeData[] = dragons.map((dragon) => ({
    id: dragon._id,
    name: dragon.name,
    type: dragon.origin,
    color: getPrimaryDragonColor(dragon.tags),
    size: 25, // Will be updated after counting connections
    dragonId: dragon._id,
    tags: dragon.tags,
    imageUrl: dragon.imageUrl,
  }));

  // Create links based on tag similarity
  const links: DragonLinkData[] = [];
  
  for (let i = 0; i < dragons.length; i++) {
    for (let j = i + 1; j < dragons.length; j++) {
      const dragon1 = dragons[i];
      const dragon2 = dragons[j];

      // Calculate tag overlap
      const commonTags = dragon1.tags.filter((tag) =>
        dragon2.tags.includes(tag)
      );

      // Create connection if there are common tags
      if (commonTags.length > 0) {
        links.push({
          source: dragon1._id,
          target: dragon2._id,
          strength: commonTags.length,
        });

        // Update connection counts
        connectionCounts.set(
          dragon1._id,
          (connectionCounts.get(dragon1._id) || 0) + 1
        );
        connectionCounts.set(
          dragon2._id,
          (connectionCounts.get(dragon2._id) || 0) + 1
        );
      }

      // Also connect dragons with similar cultural origins
      const culturalTags = [
        "european",
        "asian",
        "chinese",
        "japanese",
        "nordic",
        "greek",
        "egyptian",
        "aztec",
        "indian",
        "welsh",
      ];
      
      const dragon1Cultural = dragon1.tags.filter((tag) =>
        culturalTags.includes(tag.toLowerCase())
      );
      const dragon2Cultural = dragon2.tags.filter((tag) =>
        culturalTags.includes(tag.toLowerCase())
      );

      if (
        dragon1Cultural.length > 0 &&
        dragon2Cultural.length > 0 &&
        dragon1Cultural.some((tag) => dragon2Cultural.includes(tag)) &&
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

  // Update node sizes based on connection counts
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
