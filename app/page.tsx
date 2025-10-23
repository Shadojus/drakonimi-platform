"use client";

import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // TODO: Implement search functionality with Convex
    setTimeout(() => setIsSearching(false), 1000); // Placeholder
  };

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
            Search any dragon to reveal its myths and powers
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dragons (e.g., Smaug, Fafnir, Eastern Dragons...)"
                className="w-full px-6 py-4 rounded-full bg-dragon-surface border-2 border-dragon-primary focus:border-dragon-accent text-dragon-text placeholder-dragon-text-secondary/50 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-dragon-accent hover:bg-dragon-secondary text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>

        {/* Placeholder for Bubble Visualization */}
        <div className="bg-dragon-surface/50 rounded-lg p-12 text-center border-2 border-dashed border-dragon-primary/30">
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
