/**
 * Molecule: SelectedNodeBar
 * Displays up to 3 simultaneously selected dragon nodes below the header
 */

import Link from "next/link";
import { TAG_COLORS, getPrimaryDragonColor } from "@/components/atoms/TagColors";
import type { Dragon } from "./ImageCache";

interface SelectedNodeBarProps {
  selectedDragons: Dragon[];
  onRemove: (dragonId: string) => void;
  onToggleFavorite: (dragonId: string) => void;
  favorites: Set<string>;
}

export const SelectedNodeBar: React.FC<SelectedNodeBarProps> = ({ 
  selectedDragons, 
  onRemove, 
  onToggleFavorite,
  favorites 
}) => {
  if (selectedDragons.length === 0) return null;

  return (
    <div className="fixed top-[165px] lg:top-[145px] left-0 right-0 z-40 bg-black/70 backdrop-blur-md">
      {/* Top fade instead of border */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 space-y-2">
        {selectedDragons.map((dragon) => {
          const nodeColor = getPrimaryDragonColor(dragon.tags);
          
          return (
          <div key={dragon._id} className="flex items-center gap-2 sm:gap-3 py-1">
            {/* Image */}
            <div 
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 shrink-0"
              style={{ borderColor: nodeColor }}
            >
              <img
                src={dragon.imageUrl}
                alt={dragon.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Link to detail page - HIGHEST PRIORITY */}
              <Link 
                href={`/${encodeURIComponent(dragon.latinName.toLowerCase().replace(/\s+/g, '-'))}`}
                className="font-bold text-sm sm:text-base transition-all block mb-0.5 sm:mb-1 truncate hover:brightness-110"
                style={{ color: nodeColor }}
              >
                {dragon.name} →
              </Link>
              {/* All tags */}
              <div className="flex flex-wrap gap-0.5 sm:gap-1">
                {dragon.tags.map((tag: string) => {
                  const tagColor = TAG_COLORS[tag.toLowerCase()] || "#FFD700";
                  return (
                    <span
                      key={tag}
                      className="px-1 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium border"
                      style={{
                        backgroundColor: `${tagColor}22`,
                        color: tagColor,
                        borderColor: `${tagColor}44`,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(dragon._id)}
              className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-amber-500/20 hover:bg-amber-500/40 transition-colors text-lg sm:text-xl"
              aria-label={favorites.has(dragon._id) ? "Remove from favorites" : "Add to favorites"}
              title={favorites.has(dragon._id) ? "Remove from favorites" : "Add to favorites"}
            >
              <span className={favorites.has(dragon._id) ? "text-yellow-400" : "text-amber-300"}>
                {favorites.has(dragon._id) ? "★" : "☆"}
              </span>
            </button>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(dragon._id)}
              className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white transition-colors text-sm sm:text-base"
              aria-label="Remove from selection"
            >
              ✕
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
};
