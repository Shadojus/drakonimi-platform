# Platform Replication Guide - Funginomi & Phytonomi

This guide shows how to replicate the Drakonomi template for **Funginomi** (mushroom platform) and **Phytonomi** (plant platform).

## ✅ What You're Copying

The complete Drakonomi setup with:
- ✅ Atomic Design architecture (atoms/molecules/organisms)
- ✅ Fullscreen universe visualization
- ✅ Sticky search header
- ✅ Force-directed network graph
- ✅ Image bubbles with colored borders
- ✅ Balanced aesthetics (optimized spacing & link widths)
- ✅ Real-time Convex backend
- ✅ TypeScript type safety

## 🍄 Funginomi Adaptation

### Step 1: Copy Platform Structure

```bash
# Navigate to platforms directory
cd d:/00_Universe

# Copy Drakonomi to Funginomi
cp -r 05_Drakonimi/drakonimi-platform 05_Funginomi/funginomi-platform

# Navigate to new platform
cd 05_Funginomi/funginomi-platform
```

### Step 2: Update Package.json

```json
{
  "name": "funginomi-platform",
  "version": "0.1.0",
  "description": "Mushroom Wisdom Platform"
}
```

### Step 3: Adapt Atomic Components

#### Atoms - Rename & Adjust

**`components/atoms/DragonNode.tsx` → `MushroomNode.tsx`**

```tsx
// Before
export interface DragonNodeData {
  id: string;
  name: string;
  // ...
}

// After
export interface MushroomNodeData {
  id: string;
  name: string;
  scientificName?: string; // Add mushroom-specific fields
  edibility?: string;      // 'edible' | 'toxic' | 'unknown'
  // ...
}
```

**`components/atoms/TagColors.tsx` → Update Palette**

```tsx
export const TAG_COLORS: Record<string, string> = {
  // Edibility
  edible: "#32CD32",        // Lime Green
  toxic: "#DC143C",         // Crimson
  poisonous: "#8B0000",     // Dark Red
  medicinal: "#4169E1",     // Royal Blue
  psychedelic: "#9370DB",   // Medium Purple
  
  // Habitat
  forest: "#228B22",        // Forest Green
  grassland: "#9ACD32",     // Yellow Green
  woodland: "#8B4513",      // Saddle Brown
  
  // Characteristics
  gilled: "#FFD700",        // Gold
  pored: "#DEB887",         // Burlywood
  toothed: "#CD853F",       // Peru
  
  // Growing patterns
  saprophytic: "#8B4513",   // Saddle Brown
  mycorrhizal: "#32CD32",   // Lime Green
  parasitic: "#DC143C",     // Crimson
  
  // Seasons
  spring: "#90EE90",        // Light Green
  summer: "#FFD700",        // Gold
  autumn: "#FF8C00",        // Dark Orange
  winter: "#4682B4",        // Steel Blue
  
  // ... add more mushroom tags
};
```

**`components/atoms/DragonLink.tsx` → `MushroomLink.tsx`**

```tsx
// Keep same structure, just adjust colors
export interface MushroomLinkData {
  source: string;
  target: string;
  strength: number;
}

// Orange-brown palette for mushrooms
export const getLinkColor = (strength: number): string => {
  if (strength >= 3) {
    return "rgba(255, 140, 0, 0.8)"; // Dark Orange
  } else if (strength >= 2) {
    return "rgba(255, 140, 0, 0.5)";
  } else {
    return "rgba(255, 140, 0, 0.2)";
  }
};

// Keep logarithmic scaling - works perfectly for all platforms!
export const getLinkWidth = (strength: number): number => {
  const baseWidth = 0.8;
  return baseWidth + Math.log(strength + 1) * 0.5;
};
```

#### Molecules - Minimal Changes

**`components/molecules/ImageCache.tsx`** - Rename interface only:

```tsx
export interface Mushroom {
  _id: string;
  name: string;
  scientificName: string;
  tags: string[];
  description: string;
  habitat: string;
  edibility: string;
  imageUrl?: string;
}

// Hook stays the same!
export const useImageCache = (mushrooms: Mushroom[]) => {
  // ... same implementation
};
```

**`components/molecules/GraphData.tsx`** - Adjust connection logic:

```tsx
export const createGraphData = (mushrooms: Mushroom[]): GraphData => {
  // Same structure, different connection rules
  
  // Connect mushrooms by:
  // 1. Same habitat
  // 2. Similar edibility (both edible, both toxic)
  // 3. Same growing season
  // 4. Shared characteristics (gilled, pored, etc.)
  
  if (commonTags.length > 0) {
    links.push({
      source: mushroom1._id,
      target: mushroom2._id,
      strength: commonTags.length,
    });
  }
  
  // Habitat connections
  if (mushroom1.habitat === mushroom2.habitat) {
    links.push({
      source: mushroom1._id,
      target: mushroom2._id,
      strength: 0.5,
    });
  }
};
```

**`components/molecules/ForceSimulation.tsx`** - Keep as-is!

Same balanced physics work for mushrooms:
```tsx
export const FORCE_CONFIG = {
  chargeStrength: -600,    // Same great spacing
  collisionRadius: 15,     // Same padding
  collisionStrength: 1.0,  // Same collision
  // ... all values stay
};
```

#### Organisms - Rename & Integrate

**`components/organisms/BubbleCloud.tsx` → `MushroomCloud.tsx`**

```tsx
import { renderMushroomNode } from "../atoms/MushroomNode";
import { getLinkColor, getLinkWidth, getLinkParticles } from "../atoms/MushroomLink";
import { useImageCache, type Mushroom } from "../molecules/ImageCache";
import { createGraphData } from "../molecules/GraphData";
import { useForceSimulation, FORCE_CONFIG } from "../molecules/ForceSimulation";

interface MushroomCloudProps {
  mushrooms: Mushroom[];
  onMushroomClick: (mushroomId: string) => void;
  searchQuery?: string;
}

export default function MushroomCloud({
  mushrooms,
  onMushroomClick,
  searchQuery = "",
}: MushroomCloudProps) {
  // ... rest is identical!
}
```

### Step 4: Update Convex Schema

**`convex/schema.ts`**

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  mushrooms: defineTable({
    name: v.string(),
    scientificName: v.string(),
    commonNames: v.array(v.string()),
    habitat: v.string(),
    edibility: v.string(),
    season: v.array(v.string()),
    tags: v.array(v.string()),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    lookalikes: v.optional(v.array(v.string())),
  }).searchIndex("search_name", {
    searchField: "name",
  }),
});
```

### Step 5: Seed Mushroom Data

**`convex/mushrooms.ts`**

```typescript
export const seedMushrooms = mutation({
  handler: async (ctx) => {
    const mushrooms = [
      {
        name: "Amanita muscaria",
        scientificName: "Amanita muscaria",
        commonNames: ["Fly Agaric", "Fly Amanita"],
        habitat: "Forest",
        edibility: "Toxic",
        season: ["Summer", "Autumn"],
        tags: ["toxic", "psychedelic", "iconic", "forest", "mycorrhizal", "red"],
        description: "Iconic red mushroom with white spots...",
        imageUrl: "https://images.unsplash.com/photo-...",
      },
      {
        name: "Boletus edulis",
        scientificName: "Boletus edulis",
        commonNames: ["Porcini", "Penny Bun", "Cep"],
        habitat: "Forest",
        edibility: "Edible",
        season: ["Summer", "Autumn"],
        tags: ["edible", "pored", "mycorrhizal", "forest", "prized"],
        description: "Highly prized edible mushroom...",
        imageUrl: "https://images.unsplash.com/photo-...",
      },
      // Add 30-99 mushrooms...
    ];
    
    for (const mushroom of mushrooms) {
      await ctx.db.insert("mushrooms", mushroom);
    }
  },
});
```

### Step 6: Update UI Text

**`app/page.tsx`**

```tsx
<header>
  <h1>FUNGINOMI</h1>
  <p>Mushroom Wisdom Platform</p>
  <span>{allMushrooms?.length || 0} mushrooms</span>
  <input placeholder="Search mushrooms..." />
</header>
```

### Step 7: Update Colors

**Global theme in `globals.css`**

```css
:root {
  --primary: #FF8C00;      /* Dark Orange */
  --secondary: #8B4513;    /* Saddle Brown */
  --accent: #32CD32;       /* Lime Green */
  --bg: #0A0A0A;           /* Dark background */
}
```

## 🌿 Phytonomi Adaptation

Same process as Funginomi, but with plant-specific changes:

### Colors (Green Palette)

```tsx
export const TAG_COLORS: Record<string, string> = {
  // Plant types
  medicinal: "#32CD32",     // Lime Green
  ceremonial: "#9370DB",    // Medium Purple
  culinary: "#FFD700",      // Gold
  toxic: "#DC143C",         // Crimson
  
  // Parts used
  root: "#8B4513",          // Saddle Brown
  leaf: "#228B22",          // Forest Green
  flower: "#FF69B4",        // Hot Pink
  bark: "#A0522D",          // Sienna
  seed: "#DEB887",          // Burlywood
  
  // Properties
  healing: "#4169E1",       // Royal Blue
  psychoactive: "#9370DB",  // Medium Purple
  aromatic: "#FFD700",      // Gold
  
  // ... add more plant tags
};
```

### Schema Changes

```typescript
plants: defineTable({
  name: v.string(),
  scientificName: v.string(),
  family: v.string(),
  nativeRegion: v.string(),
  growingZones: v.array(v.string()),
  uses: v.array(v.string()),
  tags: v.array(v.string()),
  description: v.string(),
  imageUrl: v.optional(v.string()),
  cautions: v.optional(v.string()),
}),
```

## 📊 Checklist for Each Platform

### Funginomi ✅
- [ ] Copy platform structure
- [ ] Rename components (Dragon → Mushroom)
- [ ] Update TagColors with orange-brown palette
- [ ] Create mushroom schema in Convex
- [ ] Seed 30-99 mushroom profiles
- [ ] Update header text & branding
- [ ] Test visualization
- [ ] Deploy to production

### Phytonomi ✅
- [ ] Copy platform structure
- [ ] Rename components (Dragon → Plant)
- [ ] Update TagColors with green palette
- [ ] Create plant schema in Convex
- [ ] Seed 30-99 plant profiles
- [ ] Update header text & branding
- [ ] Test visualization
- [ ] Deploy to production

## 🎯 What Stays The Same

✅ **Atomic structure** - atoms/molecules/organisms hierarchy  
✅ **Force simulation** - same balanced physics (FORCE_CONFIG)  
✅ **Link aesthetics** - same logarithmic width scaling (0.8-1.8px)  
✅ **Spacing** - same -600 repulsion, 15px collision radius  
✅ **Image rendering** - same circular clipping with borders  
✅ **Search functionality** - same real-time filtering  
✅ **Responsive header** - same sticky design  
✅ **Fullscreen layout** - same immersive universe feel  
✅ **Zoom consistency** - links look great at any zoom level

## 🔧 Fine-Tuning Per Platform

Each platform can adjust these constants if needed (but defaults are optimized):

```tsx
// ForceSimulation.tsx
export const FORCE_CONFIG = {
  chargeStrength: -600,    // Adjust if too crowded/sparse
  collisionRadius: 15,     // Adjust for node sizes
  // ...
};

// DragonLink.tsx (or MushroomLink.tsx, PlantLink.tsx)
export const getLinkWidth = (strength: number) => {
  const baseWidth = 0.8;
  // Logarithmic scaling - perfect for all zoom levels!
  return baseWidth + Math.log(strength + 1) * 0.5;
};
```

### Why Logarithmic Scaling Works

```
Linear (old):     1 tag = 1.5px, 2 tags = 3.0px, 3 tags = 4.5px ❌ Too thick!
Logarithmic (new): 1 tag = 0.8px, 2 tags = 1.3px, 3 tags = 1.6px ✅ Balanced!
```

Benefits:
- ✅ Looks good when zoomed out (overview)
- ✅ Looks good when zoomed in (details)
- ✅ Strong connections visible but not overwhelming
- ✅ Weak connections still visible

## ⏱️ Estimated Timeline

- **Funginomi setup**: 3-4 hours
  - 1h: Component renaming
  - 1h: Color palette & schema
  - 1-2h: Mushroom data seeding

- **Phytonomi setup**: 3-4 hours
  - 1h: Component renaming
  - 1h: Color palette & schema
  - 1-2h: Plant data seeding

**Total for both platforms**: 6-8 hours (vs. 2-3 weeks without template!)

## 🚀 Quick Start Commands

```bash
# Funginomi
cd 05_Funginomi/funginomi-platform
npm install
npx convex dev --once
npm run dev -- --port 3001

# Phytonomi
cd 05_Phytonomi/phytonomi-platform
npm install
npx convex dev --once
npm run dev -- --port 3002

# All platforms running
# Drakonomi: localhost:3000
# Funginomi: localhost:3001
# Phytonomi: localhost:3002
```

## 📚 Resources

- **[ATOMIC_DESIGN.md](./ATOMIC_DESIGN.md)** - Architecture principles
- **[DRAKONIMI_TEMPLATE_DESIGN.md](./DRAKONIMI_TEMPLATE_DESIGN.md)** - Original design doc
- **[README.md](./README.md)** - Platform overview

---

**The atomic architecture makes replication fast, easy, and maintainable!** 🐉🍄🌿
