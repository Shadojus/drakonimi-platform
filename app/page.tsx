"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { DragonDialog } from "@/components/atoms/DragonDialog";
import { DragonDetailCard } from "@/components/molecules/DragonDetailCard";

const BubbleCloud = dynamic(() => import("../components/organisms/BubbleCloud"), {
  ssr: false,
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDragonId, setSelectedDragonId] = useState<string | null>(null);

  // Get all dragons for bubble cloud
  const allDragons = useQuery(api.dragons.list, {});

  // Get filtered dragons based on search
  const filteredDragons = useQuery(
    api.dragons.search,
    searchQuery.trim().length >= 2 ? { searchTerm: searchQuery } : "skip"
  );

  // Get selected dragon details
  const dragonData = useQuery(
    api.dragons.getById,
    selectedDragonId ? { id: selectedDragonId as any } : "skip"
  );

  const handleDragonClick = (dragonId: string) => {
    setSelectedDragonId(dragonId);
  };

  const handleCloseDialog = () => {
    setSelectedDragonId(null);
  };

  // Display dragons (filtered or all)
  const displayDragons = searchQuery.trim().length >= 2 && filteredDragons
    ? filteredDragons
    : allDragons || [];

  return (
    <div className="min-h-screen bg-dragon-bg text-dragon-text">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dragon-bg/80 backdrop-blur-md border-b border-dragon-primary/30">
        <div className="px-6 py-4">
          {/* Mobile: Stacked Layout */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐉</span>
              <div>
                <h1 className="text-2xl font-bold text-dragon-accent">
                  DRAKONOMI
                </h1>
                <p className="text-sm text-dragon-text-secondary">
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
                className="w-full px-4 py-2 pr-12 rounded-full bg-dragon-surface/50 border border-dragon-primary/30 focus:border-dragon-accent text-dragon-text placeholder-dragon-text-secondary/50 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-dragon-text-secondary hover:text-dragon-accent"
                >
                  ✕
                </button>
              )}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dragon-accent">
                🔍
              </span>
            </div>

            {/* Dragon Count */}
            <div className="text-right lg:text-left">
              <p className="text-lg font-semibold text-dragon-primary">
                {displayDragons.length} dragons
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Visualization */}
      <main className="fixed top-[140px] lg:top-[73px] left-0 right-0 bottom-0">
        <BubbleCloud
          dragons={displayDragons}
          onDragonClick={handleDragonClick}
          searchQuery={searchQuery}
        />
      </main>

      {/* Dragon Detail Dialog */}
      <DragonDialog
        isOpen={selectedDragonId !== null && dragonData !== undefined}
        onClose={handleCloseDialog}
      >
        {dragonData && <DragonDetailCard dragon={dragonData} />}
      </DragonDialog>
    </div>
  );
}
