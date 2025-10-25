# Atomic Design Structure - Drakonomi Platform

This document explains the Atomic Design architecture used in the Drakonomi platform.

## Overview

The BubbleCloud visualization follows **Atomic Design** principles, breaking down the complex dragon network into reusable, testable components.

## Component Hierarchy

### ⚛️ Atoms (Smallest Building Blocks)

Located in `components/atoms/`

#### 1. **DragonNode** (`DragonNode.tsx`)
- Represents a single dragon bubble in the network
- Handles rendering of circular nodes with images and colored borders
- Exports: `DragonNodeData` interface, `renderDragonNode()` function

#### 2. **DragonLink** (`DragonLink.tsx`)
- Represents connections between dragons based on shared tags
- **Logarithmic scaling** for link width prevents over-thick lines
- Calculates link colors, widths, and particle counts based on connection strength
- **Formula**: `width = 0.8 + log(strength + 1) * 0.5` (range: 0.8-1.8px)
- **Zoom-independent** - Looks consistent at all zoom levels
- Exports: `DragonLinkData` interface, `getLinkColor()`, `getLinkWidth()`, `getLinkParticles()`

#### 3. **TagColors** (`TagColors.tsx`)
- Comprehensive color palette for 60+ dragon attributes
- Maps tags to colors (fire=red, water=blue, etc.)
- Exports: `TAG_COLORS` constant, `getTagColor()`, `getPrimaryDragonColor()`

### 🔬 Molecules (Combinations of Atoms)

Located in `components/molecules/`

#### 1. **ImageCache** (`ImageCache.tsx`)
- Manages preloading and caching of dragon images
- Uses React hooks to handle async image loading
- Exports: `Dragon` interface, `useImageCache()` hook

#### 2. **GraphData** (`GraphData.tsx`)
- Transforms dragon data into network graph structure
- Creates nodes and links based on tag similarity
- Calculates node sizes based on connections
- Exports: `GraphData` interface, `createGraphData()` function

#### 3. **ForceSimulation** (`ForceSimulation.tsx`)
- Configures D3 force simulation for optimal node spacing
- Manages repulsion, centering, and collision forces
- **Balanced aesthetics**: Stronger repulsion (-600) with larger collision radius (15px)
- **Clean layout**: Prevents overlapping while maintaining readability
- Exports: `useForceSimulation()` hook, `FORCE_CONFIG` constants

### 🧬 Organisms (Complex Components)

Located in `components/organisms/`

#### 1. **BubbleCloud** (`BubbleCloud.tsx`)
- Main dragon network visualization component
- Orchestrates all atoms and molecules
- Integrates with react-force-graph-2d
- Handles user interactions (click, zoom, drag)

## Data Flow

```
Dragons (from Convex)
    ↓
ImageCache (preload images)
    ↓
GraphData (transform to nodes/links)
    ↓
ForceSimulation (configure physics)
    ↓
BubbleCloud (render with ForceGraph2D)
    ↓
DragonNode + DragonLink (visual atoms)
```

## Usage Example

```tsx
import { BubbleCloud } from "@/components/organisms";

function MyPage() {
  const dragons = useQuery(api.dragons.list, {});
  
  return (
    <BubbleCloud
      dragons={dragons || []}
      onDragonClick={(id) => console.log("Clicked:", id)}
      searchQuery=""
    />
  );
}
```

## Benefits of This Architecture

### ✅ **Reusability**
- Each atom can be used independently
- Easy to create different visualizations with the same atoms

### ✅ **Testability**
- Pure functions like `renderDragonNode()` are easy to unit test
- Hooks like `useImageCache()` can be tested in isolation

### ✅ **Maintainability**
- Changes to colors only require editing `TagColors.tsx`
- Force physics tweaks are isolated in `ForceSimulation.tsx`
- Visual balance adjustments centralized in `FORCE_CONFIG`

### ✅ **Scalability**
- Easy to add new node types or link styles
- Can extend to Funginomi/Phytonomi by swapping atoms
- Aesthetics fine-tuned for optimal readability

### ✅ **Type Safety**
- Each component has clear TypeScript interfaces
- Compile-time checks prevent errors

### ✅ **Visual Balance**
- **Smart link scaling**: Logarithmic formula (0.8 + log(n+1)*0.5)
  - 1 shared tag = 0.8px width
  - 2 shared tags = 1.3px width
  - 3 shared tags = 1.6px width
  - 4+ shared tags = 1.8px width (caps naturally)
- **Node repulsion**: Increased to -600 (from -400) for better spacing
- **Collision radius**: Expanded to 15px (from 10px) for clarity
- **Zoom consistency**: Links maintain visual balance at all zoom levels
- **Result**: Clean, readable, aesthetically pleasing network

## Adapting for Funginomi/Phytonomi

To adapt this structure for other platforms:

1. **Keep Atoms**: `DragonNode` → `MushroomNode` or `PlantNode`
2. **Update Colors**: Modify `TagColors.tsx` with new palette
3. **Adjust GraphData**: Change connection logic in `GraphData.tsx`
4. **Reuse Molecules**: `ImageCache` and `ForceSimulation` work as-is
5. **Clone Organism**: Create `MushroomCloud` or `PlantCloud`

## File Structure

```
components/
├── atoms/
│   ├── DragonNode.tsx      # Node rendering logic
│   ├── DragonLink.tsx      # Link styling logic
│   ├── TagColors.tsx       # Color palette
│   └── index.ts            # Exports
├── molecules/
│   ├── ImageCache.tsx      # Image preloading
│   ├── GraphData.tsx       # Data transformation
│   ├── ForceSimulation.tsx # Physics config
│   └── index.ts            # Exports
└── organisms/
    ├── BubbleCloud.tsx     # Main component
    └── index.ts            # Exports
```

## Configuration Constants

All configurable values are centralized for easy tuning:

- **Colors**: `TAG_COLORS` in `TagColors.tsx` (60+ dragon attributes)
- **Physics**: `FORCE_CONFIG` in `ForceSimulation.tsx`
  - Charge strength: `-600` (strong repulsion)
  - Collision radius: `15px` (generous spacing)
  - Collision strength: `1.0` (full force)
- **Links**: `getLinkWidth()` in `DragonLink.tsx`
  - **Logarithmic scaling**: Prevents exponential thickness growth
  - **Formula**: `0.8 + Math.log(strength + 1) * 0.5`
  - **Range**: 0.8px (weak) to 1.8px (strong)
- **Sizes**: `calculateNodeSize()` in `GraphData.tsx` (22-40px range)

### Visual Balance Parameters

```typescript
// DragonLink.tsx - Smart link width calculation
export const getLinkWidth = (strength: number): number => {
  const baseWidth = 0.8;
  // Logarithmic scaling prevents thick lines when zoomed out
  // 1 tag = 0.8px, 2 tags = 1.3px, 3 tags = 1.6px, 4+ tags = 1.8px
  return baseWidth + Math.log(strength + 1) * 0.5;
};

// ForceSimulation.tsx - Optimal spacing
export const FORCE_CONFIG = {
  chargeStrength: -600,    // Stronger repulsion for clarity
  collisionRadius: 15,     // More spacing between nodes
  collisionStrength: 1.0,  // Full collision prevention
  // ...
};
```

## Future Enhancements

- [ ] Add `DragonTooltip` atom for hover details
- [ ] Create `SearchFilter` molecule for tag-based filtering
- [ ] Build `LegendPanel` organism showing tag categories
- [ ] Implement `Timeline` organism for dragon evolution view
- [ ] Add `ComparisonView` template for side-by-side dragons

---

**This architecture makes Drakonomi a true template platform** - every piece is modular, typed, and ready to be adapted for Funginomi and Phytonomi! 🐉🍄🌿
