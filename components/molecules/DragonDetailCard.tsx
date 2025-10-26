/**
 * Molecule: DragonDetailCard
 * Compact dragon information display for popup dialog
 */

"use client";

import { TAG_COLORS } from "../atoms/TagColors";

interface Dragon {
  _id: string;
  name: string;
  origin: string;
  tags: string[];
  description: string;
  imageUrl?: string;
}

interface DragonDetailCardProps {
  dragon: Dragon;
}

export function DragonDetailCard({ dragon }: DragonDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Header with Image */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Dragon Image */}
        {dragon.imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={dragon.imageUrl}
              alt={dragon.name}
              className="w-full md:w-48 h-48 object-cover rounded-lg shadow-xl border-2 border-dragon-primary/30"
            />
          </div>
        )}

        {/* Name and Origin */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-dragon-primary mb-2">
            {dragon.name}
          </h2>
          <p className="text-lg text-dragon-text/70 mb-4">
            Origin: <span className="text-dragon-primary">{dragon.origin}</span>
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {dragon.tags.map((tag) => {
              const tagColor = TAG_COLORS[tag.toLowerCase()] || "#FFD700";
              return (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm font-medium border"
                  style={{
                    backgroundColor: `${tagColor}33`,
                    color: tagColor,
                    borderColor: `${tagColor}66`,
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-dragon-primary/30 pt-6">
        <h3 className="text-xl font-semibold text-dragon-primary mb-3">
          About
        </h3>
        <p className="text-dragon-text/80 leading-relaxed">
          {dragon.description}
        </p>
      </div>

      {/* Stats */}
      <div className="border-t border-dragon-primary/30 pt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-dragon-text/60 mb-1">Attributes</p>
          <p className="text-lg font-semibold text-dragon-primary">
            {dragon.tags.length} tags
          </p>
        </div>
        <div>
          <p className="text-sm text-dragon-text/60 mb-1">Culture</p>
          <p className="text-lg font-semibold text-dragon-primary">
            {dragon.origin}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DragonDetailCard;
