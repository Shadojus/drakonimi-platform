"use client";

/**
 * Molecule: ImageCache
 * Manages preloading and caching of dragon images
 */

import { useState, useEffect } from "react";

export interface Dragon {
  _id: string;
  name: string;
  latinName?: string;
  origin: string;
  tags: string[];
  description: string;
  imageUrl?: string;
  // Extended fields from Convex schema
  images?: string[];
  element?: string;
  dangerLevel?: 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary';
  habitat?: string[];
  powerLevel?: number;
  wingspan?: number;
  intelligence?: number;
  speed?: number;
  fireBreath?: number;
  family?: string;
  order?: string;
  diet?: string;
  lifespan?: string;
  abilities?: string[];
  isAvailable?: boolean;
}

/**
 * Hook to preload and cache dragon images
 */
export const useImageCache = (dragons: Dragon[]) => {
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(
    new Map()
  );

  useEffect(() => {
    const cache = new Map<string, HTMLImageElement>();

    dragons.forEach((dragon) => {
      if (dragon.imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = dragon.imageUrl;
        img.onload = () => {
          cache.set(dragon._id, img);
          setImageCache(new Map(cache));
        };
      }
    });
  }, [dragons]);

  return imageCache;
};

export default useImageCache;
