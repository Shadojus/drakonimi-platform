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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const searchResults = useQuery(
    api.dragons.search,
    searchQuery.trim().length >= 2 ? { searchTerm: searchQuery } : "skip"
  );

  const dragonData = useQuery(
    api.dragons.getById,
    selectedDragonId ? { id: selectedDragonId as any } : "skip"
  );

  // Mock categories until we add them to the database
  const mockCategories = selectedDragonId ? [
    { _id: "1", type: "mythology", title: "Ancient Myths", content: "Discover the ancient myths..." },
    { _id: "2", type: "powers", title: "Dragon Powers", content: "Explore the mystical powers..." },
    { _id: "3", type: "history", title: "Historical Records", content: "Read historical accounts..." },
    { _id: "4", type: "culture", title: "Cultural Impact", content: "Learn about cultural influence..." },
    { _id: "5", type: "lore", title: "Dragon Lore", content: "Deep dive into dragon lore..." },
    { _id: "6", type: "wisdom", title: "Ancient Wisdom", content: "Wisdom passed down..." },
  ] : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDragonSelect = (dragonId: string) => {
    setSelectedDragonId(dragonId);
    setSelectedCategoryId(null);
    setSearchQuery("");
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleBack = () => {
    if (selectedCategoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedDragonId(null);
    }
  };

  // Show category detail view
  if (selectedCategoryId && mockCategories) {
    const category = mockCategories.find((c) => c._id === selectedCategoryId);
    return (
      <div className="min-h-screen bg-dragon-bg text-dragon-text">
        <header className="border-b border-dragon-surface/50 bg-dragon-surface/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <button
              onClick={handleBack}
              className="text-dragon-accent hover:text-dragon-secondary mb-2"
            >
              ← Back to {dragonData?.name}
            </button>
            <h1 className="text-3xl font-bold text-dragon-accent">
              {category?.title}
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-dragon-text text-lg">{category?.content}</p>
        </main>
      </div>
    );
  }

  // Show dragon detail with bubble cloud
  if (selectedDragonId && dragonData) {
    return (
      <div className="min-h-screen bg-dragon-bg text-dragon-text">
        <header className="border-b border-dragon-surface/50 bg-dragon-surface/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <button
              onClick={handleBack}
              className="text-dragon-accent hover:text-dragon-secondary mb-2"
            >
              ← Back to search
            </button>
            <h1 className="text-3xl font-bold text-dragon-accent">
              {dragonData.name}
            </h1>
            <p className="text-sm text-dragon-text-secondary">{dragonData.origin}</p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-16">
          {/* Dragon Details */}
          <div className="bg-dragon-surface/50 p-8 rounded-lg border border-dragon-primary/20 mb-8">
            <p className="text-dragon-text text-lg mb-4">{dragonData.description}</p>
            <div className="flex flex-wrap gap-2">
              {dragonData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-dragon-primary/30 text-dragon-accent text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bubble Cloud */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dragon-accent mb-4">
              🫧 Knowledge Categories
            </h2>
            <BubbleCloud
              categories={mockCategories}
              dragonName={dragonData.name}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </main>
      </div>
    );
  }

  // Show search/home view
  return (
    <div className="min-h-screen bg-dragon-bg text-dragon-text">
      {/* Header */}
      <header className="border-b border-dragon-surface/50 bg-dragon-surface/80 backdrop-blur-sm">
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
            Search and select a dragon to see an interactive bubble visualization
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dragons (e.g., Ignis Rex, Glacius Guardian...)"
                className="w-full px-6 py-4 rounded-full bg-dragon-surface border-2 border-dragon-primary focus:border-dragon-accent text-dragon-text placeholder-dragon-text-secondary/50 outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-dragon-accent hover:bg-dragon-secondary text-white rounded-full font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((dragon) => (
              <button
                key={dragon._id}
                onClick={() => handleDragonSelect(dragon._id)}
                className="bg-dragon-surface/50 p-6 rounded-lg border border-dragon-primary/20 hover:border-dragon-accent/50 transition-colors text-left cursor-pointer"
              >
                {dragon.imageUrl && (
                  <img
                    src={dragon.imageUrl}
                    alt={dragon.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-dragon-accent mb-2">
                  {dragon.name}
                </h3>
                <p className="text-sm text-dragon-text-secondary mb-3">
                  Origin: {dragon.origin}
                </p>
                <p className="text-sm text-dragon-text mb-4">
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
