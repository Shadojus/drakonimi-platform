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
  isHighlighted?: boolean; // NEW: for tag highlighting
  isSelected?: boolean; // NEW: for selected node focus
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

  // Apply greyfade to non-selected nodes
  const opacity = node.isSelected ? 1.0 : 0.3;

  // Draw image if available
  if (cachedImage && cachedImage.complete) {
    ctx.save();
    
    // Set opacity for non-selected nodes
    ctx.globalAlpha = opacity;
    
    // Draw glow effect for highlighted nodes
    if (node.isHighlighted) {
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    
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
    
    // Draw colored border (thicker and more visible)
    ctx.beginPath();
    ctx.arc(x, y, node.size, 0, 2 * Math.PI);
    ctx.strokeStyle = node.color;
    ctx.lineWidth = node.isHighlighted ? 6 / globalScale : 4 / globalScale;
    ctx.stroke();
    
    // Additional glow ring for highlighted nodes
    if (node.isHighlighted) {
      ctx.beginPath();
      ctx.arc(x, y, node.size + 8, 0, 2 * Math.PI);
      ctx.strokeStyle = `${node.color}88`;
      ctx.lineWidth = 10 / globalScale;
      ctx.stroke();
    }
  } else {
    // Fallback: solid colored circle
    ctx.save();
    ctx.globalAlpha = opacity;
    
    ctx.beginPath();
    ctx.arc(x, y, node.size, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    
    ctx.restore();
    
    // Glow for highlighted nodes even without image
    if (node.isHighlighted) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, node.size + 8, 0, 2 * Math.PI);
      ctx.strokeStyle = `${node.color}88`;
      ctx.lineWidth = 10 / globalScale;
      ctx.stroke();
      ctx.restore();
    }
  }

  // Draw label below node
  if (globalScale >= 0.8) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = `${12 / globalScale}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#FFD700";
    ctx.fillText(node.name, x, y + node.size + 5);
    ctx.restore();
  }
};

export default DragonNodeData;
