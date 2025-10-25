# Component Architecture Overview

## Current Structure

```
components/
├── atoms/                    # ⚛️ Atomic building blocks
│   ├── DragonNode.tsx       # Single dragon bubble rendering
│   ├── DragonLink.tsx       # Connection styling & logic  
│   ├── TagColors.tsx        # 60+ color palette
│   └── index.ts             # Barrel export
│
├── molecules/               # 🔬 Compound components
│   ├── ImageCache.tsx       # Image preloading hook
│   ├── GraphData.tsx        # Network data transformation
│   ├── ForceSimulation.tsx  # Physics configuration
│   └── index.ts             # Barrel export
│
├── organisms/               # 🧬 Complex features
│   ├── BubbleCloud.tsx      # Main visualization
│   └── index.ts             # Barrel export
│
├── DragonDetail.tsx         # TODO: Migrate to organisms/
├── BubbleCloud.old.tsx      # Legacy backup
└── ui/                      # Shadcn UI components
    ├── button.tsx
    └── dialog.tsx
```

## Atomic Design Benefits

### ✅ **Separation of Concerns**
- Rendering logic → Atoms
- Data transformation → Molecules  
- User interactions → Organisms

### ✅ **Independent Testing**
Each layer can be tested without the others:
```tsx
// Test atom
expect(getTagColor('fire')).toBe('#FF4500');

// Test molecule  
expect(createGraphData(mockDragons).nodes.length).toBe(30);

// Test organism
render(<BubbleCloud dragons={[]} onDragonClick={jest.fn()} />);
```

### ✅ **Easy Adaptation**
To create Funginomi:
1. Copy `atoms/` and rename DragonNode → MushroomNode
2. Update `TagColors.tsx` with mushroom palette
3. Adjust `GraphData.tsx` connection logic
4. Clone `BubbleCloud.tsx` → `MushroomCloud.tsx`

## Migration Status

- ✅ BubbleCloud → Atomic structure
- ⏳ DragonDetail → needs organism migration
- ⏳ Header → should become organism
- ⏳ SearchBar → should become molecule

## Next Steps

1. **Migrate DragonDetail**:
   ```
   organisms/DragonDetail/
   ├── DragonDetail.tsx          # Main component
   ├── DragonHeader.tsx          # Atom
   ├── DragonImage.tsx           # Atom
   ├── DragonTags.tsx            # Molecule
   └── DragonConnections.tsx     # Molecule
   ```

2. **Create Header Organism**:
   ```
   organisms/Header/
   ├── Header.tsx                # Main component
   ├── Logo.tsx                  # Atom
   ├── SearchBar.tsx             # Molecule
   └── DragonCounter.tsx         # Atom
   ```

3. **Extract Templates**:
   ```
   templates/
   ├── PlatformLayout.tsx        # Shared layout
   ├── VisualizationPage.tsx     # BubbleCloud + Detail
   └── SearchablePlatform.tsx    # Header + Content
   ```

## Design Principles

### 🎯 **Single Responsibility**
Each component does ONE thing well:
- `TagColors` → manages colors
- `ImageCache` → handles images
- `ForceSimulation` → configures physics

### 🔒 **Encapsulation**
Internal logic is hidden, clean APIs exposed:
```tsx
// Good - abstract implementation
const color = getPrimaryDragonColor(tags);

// Bad - expose internals
const color = tags.length ? tagColors[tags[0]] : '#FFD700';
```

### 📦 **Composability**
Higher-level components built from lower-level ones:
```tsx
BubbleCloud
  ↳ uses useImageCache()
  ↳ uses createGraphData()
  ↳ uses renderDragonNode()
  ↳ uses getLinkColor()
```

## Import Patterns

### ✅ Recommended
```tsx
import { BubbleCloud } from "@/components/organisms";
import { getPrimaryDragonColor } from "@/components/atoms";
import { useImageCache } from "@/components/molecules";
```

### ❌ Avoid
```tsx
import BubbleCloud from "@/components/organisms/BubbleCloud";
```

## Documentation

- 📘 **[ATOMIC_DESIGN.md](./ATOMIC_DESIGN.md)** - Full atomic design guide
- 📗 **[README.md](./README.md)** - Platform overview
- 📙 **[Drakonomi_TEMPLATE_DESIGN.md](./Drakonomi_TEMPLATE_DESIGN.md)** - Template adaptation guide

---

**Status**: ✅ BubbleCloud fully migrated to Atomic Design
**Next**: Migrate remaining components (DragonDetail, Header)
