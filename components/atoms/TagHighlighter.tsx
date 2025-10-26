/**
 * Atom: TagHighlighter
 * Small colored buttons to highlight bubbles with specific tags
 */

"use client";

import { TAG_COLORS } from "./TagColors";

export interface TagHighlighterProps {
  tag: string;
  isActive: boolean;
  onToggle: (tag: string) => void;
}

/**
 * Single tag highlighter button
 */
export function TagHighlighter({ tag, isActive, onToggle }: TagHighlighterProps) {
  const color = TAG_COLORS[tag] || "#FFD700";
  
  return (
    <button
      onClick={() => onToggle(tag)}
      className={`
        relative px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium
        transition-all duration-300 ease-in-out
        ${isActive 
          ? "scale-105 shadow-lg" 
          : "hover:scale-102 hover:brightness-110"
        }
      `}
      style={{
        backgroundColor: isActive ? `${color}dd` : `${color}15`,
        color: isActive ? "#000000" : `${color}99`,
        border: `1px solid ${isActive ? color : `${color}40`}`,
        boxShadow: isActive ? `0 0 24px ${color}66, 0 4px 12px ${color}44` : `0 2px 4px #00000020`,
        textShadow: isActive ? `0 0 8px ${color}aa` : 'none',
      } as React.CSSProperties}
      title={`Highlight ${tag} dragons`}
    >
      {tag}
    </button>
  );
}

/**
 * Featured tags for Drakonomi (dragons)
 */
export const FEATURED_DRAGON_TAGS = [
  "fire",
  "ice",
  "water",
  "legendary",
  "ancient",
  "guardian",
  "dark",
] as const;

export type FeaturedDragonTag = typeof FEATURED_DRAGON_TAGS[number];

/**
 * Group of tag highlighters
 */
export interface TagHighlighterGroupProps {
  activeTags: Set<string>;
  onToggleTag: (tag: string) => void;
}

export function TagHighlighterGroup({ activeTags, onToggleTag }: TagHighlighterGroupProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
      <span className="text-xs text-dragon-text-secondary mr-1 hidden sm:inline">Highlight:</span>
      {FEATURED_DRAGON_TAGS.map((tag) => (
        <TagHighlighter
          key={tag}
          tag={tag}
          isActive={activeTags.has(tag)}
          onToggle={onToggleTag}
        />
      ))}
    </div>
  );
}

export default TagHighlighter;
