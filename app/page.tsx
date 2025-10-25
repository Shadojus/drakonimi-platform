"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";

const BubbleCloud = dynamic(() => import("../components/BubbleCloud"), {
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

  const handleBack = () => {
    setSelectedDragonId(null);
  };

  // Show dragon detail view
  if (selectedDragonId && dragonData) {
    return (
      <div className="min-h-screen bg-dragon-bg text-dragon-text">
        <header className="border-b border-dragon-surface/50 bg-dragon-surface/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <button
              onClick={handleBack}
              className="text-dragon-accent hover:text-dragon-secondary mb-2 flex items-center gap-2"
            >
              ← Back to search
            </button>
            <h1 className="text-3xl font-bold text-dragon-accent">
              {dragonData.name}
            </h1>
            <p className="text-sm text-dragon-text-secondary italic">{dragonData.origin}</p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-16">
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
        </main>
      </div>
    );
  }

  // Show search/home view with BubbleCloud
  const displayDragons = searchQuery.trim().length >= 2 ? filteredDragons : allDragons;

  return (
    <div className="min-h-screen bg-dragon-bg text-dragon-text">
      {/* Header */}
      <header className="border-b border-dragon-surface/50 bg-dragon-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-dragon-accent">
            🐉 DRAKONIMI
          </h1>
          <p className="text-sm text-dragon-text-secondary">Dragon Wisdom Platform</p>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-dragon-accent mb-4">
            Explore Dragon Lore
          </h2>
          <p className="text-xl text-dragon-text-secondary mb-8">
            Interactive visualization of dragon wisdom and mythology
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter dragons (e.g., fire, wisdom, ancient...)"
                className="w-full px-6 py-4 rounded-full bg-dragon-surface border-2 border-dragon-primary focus:border-dragon-accent text-dragon-text placeholder-dragon-text-secondary/50 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-dragon-text-secondary hover:text-dragon-accent"
                >
                  ✕
                </button>
              )}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dragon-accent">
                🔍
              </div>
            </div>
          </form>

          {searchQuery && displayDragons && (
            <p className="text-dragon-text-secondary mb-6">
              Showing {displayDragons.length} dragon{displayDragons.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* BubbleCloud Visualization */}
        {displayDragons && displayDragons.length > 0 && (
          <div className="mb-12">
            <div className="bg-dragon-surface/30 rounded-lg p-6 border border-dragon-primary/20">
              <h3 className="text-2xl font-bold text-dragon-accent mb-4 text-center">
                🫧 Interactive Dragon Network
              </h3>
              <p className="text-dragon-text-secondary text-center mb-6">
                Click any dragon bubble to explore in detail
              </p>
              <BubbleCloud
                dragons={displayDragons}
                onDragonClick={handleDragonClick}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Dragon Grid (fallback/additional view) */}
        {displayDragons && displayDragons.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-dragon-accent mb-6">
              Dragon Archive
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayDragons.map((dragon) => (
                <button
                  key={dragon._id}
                  onClick={() => handleDragonClick(dragon._id)}
                  className="bg-dragon-surface/50 p-6 rounded-lg border border-dragon-primary/20 hover:border-dragon-accent/50 transition-all hover:scale-105 text-left cursor-pointer group"
                >
                  {dragon.imageUrl && (
                    <img
                      src={dragon.imageUrl}
                      alt={dragon.name}
                      className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-80 transition-opacity"
                    />
                  )}
                  <h3 className="text-xl font-bold text-dragon-accent mb-2 group-hover:text-dragon-secondary transition-colors">
                    {dragon.name}
                  </h3>
                  <p className="text-sm text-dragon-text-secondary mb-3">
                    Origin: {dragon.origin}
                  </p>
                  <p className="text-sm text-dragon-text mb-4 line-clamp-3">
                    {dragon.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dragon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-dragon-primary/30 text-dragon-accent text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {displayDragons && displayDragons.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐉</div>
            <h3 className="text-2xl font-bold text-dragon-accent mb-2">
              No dragons found
            </h3>
            <p className="text-dragon-text-secondary">
              Try a different search term or browse all dragons
            </p>
          </div>
        )}

        {/* Placeholder for Bubble Visualization */}
        <div className="bg-dragon-surface/50 rounded-lg p-12 text-center border-2 border-dashed border-dragon-primary/30 mt-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🫧</div>
            <h3 className="text-2xl font-bold text-dragon-accent mb-4">
              Interactive Bubble Cloud
            </h3>
            <p className="text-dragon-text-secondary mb-6">
              Search for a dragon to see an interactive visualization of 6 knowledge categories:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-dragon-surface p-3 rounded-lg">
                <div className="text-2xl mb-1">📜</div>
                <div className="font-medium text-dragon-accent">Mythology</div>
              </div>
              <div className="bg-dragon-surface p-3 rounded-lg">
                <div className="text-2xl mb-1">🔥</div>
                <div className="font-medium text-dragon-accent">Powers</div>
              </div>
              <div className="bg-dragon-surface p-3 rounded-lg">
                <div className="text-2xl mb-1">🌍</div>
                <div className="font-medium text-dragon-accent">Geography</div>
              </div>
              <div className="bg-dragon-surface p-3 rounded-lg">
                <div className="text-2xl mb-1">📚</div>
                <div className="font-medium text-dragon-accent">Literature</div>
              </div>
              <div className="bg-dragon-surface p-3 rounded-lg">
                <div className="text-2xl mb-1">⚔️</div>
                <div className="font-medium text-dragon-accent">Legends</div>
              </div>
              <div className="bg-dragon-surface p-3 rounded-lg">
                <div className="text-2xl mb-1">🎭</div>
                <div className="font-medium text-dragon-accent">Culture</div>
              </div>
            </div>
            <p className="text-dragon-text-secondary text-sm mt-6">
              Click any bubble to explore detailed articles and myths
            </p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-dragon-surface/30 p-6 rounded-lg border border-dragon-primary/20">
            <div className="text-3xl mb-3">🐲</div>
            <h4 className="text-lg font-bold text-dragon-accent mb-2">
              Eastern Dragons
            </h4>
            <p className="text-sm text-dragon-text-secondary">
              Benevolent beings of wisdom, water, and prosperity
            </p>
          </div>
          <div className="bg-dragon-surface/30 p-6 rounded-lg border border-dragon-primary/20">
            <div className="text-3xl mb-3">🔥</div>
            <h4 className="text-lg font-bold text-dragon-accent mb-2">
              Western Dragons
            </h4>
            <p className="text-sm text-dragon-text-secondary">
              Fire-breathing guardians of treasure and ancient knowledge
            </p>
          </div>
          <div className="bg-dragon-surface/30 p-6 rounded-lg border border-dragon-primary/20">
            <div className="text-3xl mb-3">🌌</div>
            <h4 className="text-lg font-bold text-dragon-accent mb-2">
              Cosmic Serpents
            </h4>
            <p className="text-sm text-dragon-text-secondary">
              Primordial forces shaping reality across mythologies
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dragon-surface/50 mt-16 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-dragon-text-secondary">
          <p className="mb-2">
            Drakonimi - Dragon Wisdom Platform
          </p>
          <p className="text-xs">
            Part of the Bifröst Knowledge Network
          </p>
        </div>
      </footer>
    </div>
  );
}
