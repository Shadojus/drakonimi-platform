"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { TagHighlighterGroup, FEATURED_DRAGON_TAGS } from "@/components/atoms/TagHighlighter";
import { SelectedNodeBar } from "@/components/molecules/SelectedNodeBar";

const BubbleCloud = dynamic(() => import("../components/organisms/BubbleCloud"), {
  ssr: false,
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDragonIds, setSelectedDragonIds] = useState<string[]>([]); // Up to 3 IDs
  const [highlightedTags, setHighlightedTags] = useState<Set<string>>(new Set());
  const [hasUserClosedSelection, setHasUserClosedSelection] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // Load favorites from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('drakonimi-favorites');
        return stored ? new Set(JSON.parse(stored)) : new Set();
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  // Persist favorites to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drakonimi-favorites', JSON.stringify(Array.from(favorites)));
    }
  }, [favorites]);

  // Get all dragons for bubble cloud
  const allDragons = useQuery(api.dragons.list, {});

  // Get filtered dragons based on search
  const filteredDragons = useQuery(
    api.dragons.search,
    searchQuery.trim().length >= 2 ? { searchTerm: searchQuery } : "skip"
  );

  // Display dragons (filtered or all) - memoized to prevent re-render issues
  const displayDragons = useMemo(() => {
    return searchQuery.trim().length >= 2 && filteredDragons
      ? filteredDragons
      : allDragons || [];
  }, [searchQuery, filteredDragons, allDragons]);

  // Get selected dragons objects (up to 3)
  const selectedDragons = useMemo(() => 
    selectedDragonIds
      .map(id => displayDragons.find((d) => d._id === id))
      .filter((d): d is NonNullable<typeof d> => d !== undefined),
    [displayDragons, selectedDragonIds]
  );

  // Initialize default selection and highlighter on first load
  useEffect(() => {
    if (selectedDragonIds.length === 0 && displayDragons.length > 0 && !hasUserClosedSelection) {
      // Select the middle/central dragon as default
      const middleIndex = Math.floor(displayDragons.length / 2);
      const centralDragon = displayDragons[middleIndex];
      requestAnimationFrame(() => {
        setSelectedDragonIds([centralDragon._id]);
        setHighlightedTags(new Set([FEATURED_DRAGON_TAGS[0]]));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayDragons.length, hasUserClosedSelection]);

  const handleDragonClick = (dragonId: string) => {
    setSelectedDragonIds((prev) => {
      // If already selected, remove it
      if (prev.includes(dragonId)) {
        return prev.filter(id => id !== dragonId);
      }
      // If less than 3, add it
      if (prev.length < 3) {
        return [...prev, dragonId];
      }
      // If 3 already selected, remove first and add new (queue behavior)
      return [...prev.slice(1), dragonId];
    });
    setHasUserClosedSelection(false);
  };

  const handleRemoveDragon = (dragonId: string) => {
    setSelectedDragonIds((prev) => prev.filter(id => id !== dragonId));
    if (selectedDragonIds.length === 1) {
      setHasUserClosedSelection(true);
    }
  };

  const handleToggleFavorite = (dragonId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dragonId)) {
        newSet.delete(dragonId);
      } else {
        newSet.add(dragonId);
      }
      return newSet;
    });
  };

  const handleToggleTag = (tag: string) => {
    setHighlightedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-dragon-bg text-dragon-text">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-transparent backdrop-blur-md border-b border-dragon-primary/10">
        <div className="px-4 sm:px-6 py-2 sm:py-3">
          {/* Mobile: Stacked Layout */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 sm:gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🐉</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-dragon-accent">
                  DRAKONOMI
                </h1>
                <p className="text-xs sm:text-sm text-dragon-text-secondary">
                  Dragon Wisdom Platform
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 lg:max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dragons..."
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 pr-10 sm:pr-12 rounded-full bg-dragon-surface/50 border border-dragon-primary/30 focus:border-dragon-accent text-dragon-text placeholder-dragon-text-secondary/50 outline-none transition-colors text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-9 sm:right-12 top-1/2 -translate-y-1/2 text-dragon-text-secondary hover:text-dragon-accent text-sm sm:text-base"
                >
                  ✕
                </button>
              )}
              <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-dragon-accent text-sm sm:text-base">
                🔍
              </span>
            </div>

            {/* Count removed to save space */}
          </div>

          {/* Tag Highlighters - no separator, flows directly */}
          <div className="mt-2 sm:mt-3">
            <TagHighlighterGroup
              activeTags={highlightedTags}
              onToggleTag={handleToggleTag}
            />
          </div>
        </div>
        {/* Gradient fade to transparent at bottom of header */}
        <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
      </header>

      {/* Fullscreen Visualization */}
      <main className="fixed top-[180px] lg:top-40 left-0 right-0 bottom-0">
        <BubbleCloud
          dragons={displayDragons}
          onDragonClick={handleDragonClick}
          searchQuery={searchQuery}
          highlightedTags={highlightedTags}
          selectedNodeIds={selectedDragonIds}
        />
      </main>

      {/* Selected Node Bar - shows under header with up to 3 selections */}
      <SelectedNodeBar 
        selectedDragons={selectedDragons}
        onRemove={handleRemoveDragon}
        onToggleFavorite={handleToggleFavorite}
        favorites={favorites}
      />
    </div>
  );
}
