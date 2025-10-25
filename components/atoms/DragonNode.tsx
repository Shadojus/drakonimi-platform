/**
 * Atom: DragonNode
 * The fundamental building block - represents a single dragon bubble in the network
 */

export interface DragonNodeData {
  id: string;
  name: string;
  type: string;
  color: string;
  size: number;
  dragonId?: string;
  tags?: string[];
  imageUrl?: string;
  x?: number;
  y?: number;
}

interface DragonNodeProps {
  node: DragonNodeData;
  ctx: CanvasRenderingContext2D;
  globalScale: number;
  cachedImage?: HTMLImageElement;
}

/**
 * Renders a dragon node on canvas with image and colored border
 */
export const renderDragonNode = ({
  node,
  ctx,
  globalScale,
  cachedImage,
}: DragonNodeProps): void => {
  const x = node.x || 0;
  const y = node.y || 0;

  // Draw image if available
  if (cachedImage && cachedImage.complete) {
    ctx.save();
    
    // Clip to circular shape
    ctx.beginPath();
    ctx.arc(x, y, node.size, 0, 2 * Math.PI);
    ctx.clip();
    
    // Draw image
    ctx.drawImage(
      cachedImage,
      x - node.size,
      y - node.size,
      node.size * 2,
      node.size * 2
    );
    
    ctx.restore();
    
    // Draw colored border
    ctx.beginPath();
    ctx.arc(x, y, node.size, 0, 2 * Math.PI);
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 3 / globalScale;
    ctx.stroke();
  } else {
    // Fallback: solid colored circle
    ctx.beginPath();
    ctx.arc(x, y, node.size, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
  }

  // Draw label below node
  if (globalScale >= 0.8) {
    ctx.font = `${12 / globalScale}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#FFD700";
    ctx.fillText(node.name, x, y + node.size + 5);
  }
};

export default DragonNodeData;
