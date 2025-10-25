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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDragonClick = (dragonId: string) => {
    setSelectedDragonId(dragonId);
  };

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
    return (
      <div className="min-h-screen bg-dragon-bg text-dragon-text">
        {/* Sticky Header with Back + Search */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-dragon-bg/80 backdrop-blur-md border-b border-dragon-primary/30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Left: Logo + Back Button */}
            <div className="flex items-center gap-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-dragon-accent hover:text-dragon-secondary transition-colors"
              >
                <span className="text-2xl">←</span>
                <span className="font-medium">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐉</span>
                <div>
                  <h1 className="text-xl font-bold text-dragon-accent">
                    {dragonData.name}
                  </h1>
                  <p className="text-xs text-dragon-text-secondary italic">
                    {dragonData.origin}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Search (consistent with main view) */}
            <div className="flex items-center gap-4">
              <div className="relative w-96">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dragons..."
                  className="w-full px-4 py-2 rounded-full bg-dragon-surface/50 border border-dragon-primary/30 focus:border-dragon-accent text-dragon-text placeholder-dragon-text-secondary/50 outline-none transition-colors"
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
            </div>
          </div>
        </header>

        {/* Scrollable content below header */}
        <main className="pt-[89px] min-h-screen">
          <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Dragon Image */}
            {dragonData.imageUrl && (
              <div className="mb-8">
              <img
                src={dragonData.imageUrl}
                alt={dragonData.name}
                className="w-full max-w-2xl mx-auto h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          )}

          {/* Dragon Details */}
          <div className="bg-dragon-surface/50 p-8 rounded-lg border border-dragon-primary/20 mb-8">
            <h2 className="text-2xl font-bold text-dragon-accent mb-4">Description</h2>
            <p className="text-dragon-text text-lg mb-6">{dragonData.description}</p>
            
            <h3 className="text-xl font-bold text-dragon-accent mb-3">Common Names</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {dragonData.commonNames?.map((name: string) => (
                <span
                  key={name}
                  className="px-3 py-1 bg-dragon-primary/30 text-dragon-accent text-sm rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-bold text-dragon-accent mb-3">Attributes</h3>
            <div className="flex flex-wrap gap-2">
              {dragonData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-dragon-accent/20 text-dragon-accent text-sm rounded-full border border-dragon-accent/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        </main>
      </div>
    );
  }

  // Show search/home view with BubbleCloud - FULLSCREEN UNIVERSE
  const displayDragons = searchQuery.trim().length >= 2 ? filteredDragons : allDragons;

  return (
    <div className="min-h-screen bg-dragon-bg text-dragon-text">
      {/* Sticky Header with Logo + Search */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dragon-bg/80 backdrop-blur-md border-b border-dragon-primary/30">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile: Stack vertically */}
          <div className="flex flex-col gap-3 lg:hidden">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🐉</span>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-dragon-accent">
                    Drakonomi
                  </h1>
                  <p className="text-xs text-dragon-text-secondary">
                    Dragon Wisdom Platform
                  </p>
                </div>
              </div>
              {/* Dragon Count (mobile) */}
              {displayDragons && (
                <p className="text-dragon-text-secondary text-sm whitespace-nowrap">
                  {displayDragons.length} dragon{displayDragons.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {/* Search (full width on mobile) */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dragons..."
                className="w-full px-4 py-2 rounded-full bg-dragon-surface/50 border border-dragon-primary/30 focus:border-dragon-accent text-dragon-text placeholder-dragon-text-secondary/50 outline-none transition-colors"
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
          </div>

          {/* Desktop: Side by side */}
          <div className="hidden lg:flex items-center justify-between gap-6">
            {/* Left: Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-3xl">🐉</span>
              <div>
                <h1 className="text-xl font-bold text-dragon-accent">
                  Drakonomi
                </h1>
                <p className="text-xs text-dragon-text-secondary">
                  Dragon Wisdom Platform
                </p>
              </div>
            </div>

            {/* Center: Search (grows to fill space) */}
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dragons (name, tags, origin...)"
                className="w-full px-4 py-2 rounded-full bg-dragon-surface/50 border border-dragon-primary/30 focus:border-dragon-accent text-dragon-text placeholder-dragon-text-secondary/50 outline-none transition-colors"
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

            {/* Right: Dragon Count */}
            {displayDragons && (
              <p className="text-dragon-text-secondary text-sm whitespace-nowrap shrink-0">
                {displayDragons.length} dragon{displayDragons.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Fullscreen BubbleCloud Universe - NO BORDERS, NO CONTAINERS */}
      {/* Responsive top spacing: mobile stacked header is taller */}
      <main className="fixed top-[140px] lg:top-[73px] left-0 right-0 bottom-0 overflow-hidden">
        {displayDragons && displayDragons.length > 0 ? (
          <BubbleCloud
            dragons={displayDragons}
            onDragonClick={handleDragonClick}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">�</div>
              <h3 className="text-2xl font-bold text-dragon-accent mb-2">
                No dragons found
              </h3>
              <p className="text-dragon-text-secondary">
                Try a different search term
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
