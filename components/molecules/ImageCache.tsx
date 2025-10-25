/**
 * Molecule: ImageCache
 * Manages preloading and caching of dragon images
 */

import { useState, useEffect } from "react";

export interface Dragon {
  _id: string;
  name: string;
  origin: string;
  tags: string[];
  description: string;
  imageUrl?: string;
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
