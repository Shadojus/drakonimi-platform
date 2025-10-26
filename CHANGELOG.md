# Changelog - Drakonomi Platform

All notable changes to the Drakonomi (Dragon Wisdom) platform are documented here.

---

## [2.3.0] - 2025-10-26

### ✨ Added - Interactive Tag Highlighter System
- **Tag-Based Highlighting**: 7 featured tags with colored buttons
  - fire, ice, water, legendary, ancient, guardian, dark
- **Visual Glow Effect**: Highlighted bubbles get thicker borders + glow rings
- **Multi-Selection**: Toggle multiple tags simultaneously
- **No Filtering**: All bubbles remain visible, only highlighted ones glow
- **Tag-Colored Buttons**: Each button uses its TAG_COLORS definition

### 🎨 Enhanced - Colored Tags in Popup Dialogs
- **Tag-Specific Colors**: Tags now use TAG_COLORS instead of uniform gold
- **Visual Consistency**: Popup tags match bubble colors and highlighter buttons
- **Better Readability**: Semi-transparent backgrounds with colored text and borders

### 🔧 Fixed - Radial Boundary Constraint
- **Max Distance**: Nodes limited to 400px radius from center
- **Prevents Drift**: Nodes no longer float away into infinity
- **Smooth Boundary**: Velocity dampening when hitting edge (50% reduction)
- **Applied Every Tick**: Custom D3 force runs continuously

### 📦 Components Added
- `atoms/TagHighlighter.tsx` - Individual tag button with glow effect
- `molecules/ForceSimulation.tsx` - Added `applyRadialBoundary()` function
- Updated `DragonNode.tsx` - Added `isHighlighted` property and glow rendering
- Updated `GraphData.tsx` - Tag matching for highlighting
- Updated `BubbleCloud.tsx` - Integrated boundary constraint
- Updated `DragonDetailCard.tsx` - Colored tag badges

---

## [2.2.0] - 2025-10-25

### ✨ Initial Release - Dragon Mythology Database
- **30 Dragons**: Diverse mythological collection from global cultures
- **Force-Directed Graph**: Interactive bubble visualization
- **Tag System**: Cultural origins, elements, characteristics
- **Atomic Design**: Atoms → Molecules → Organisms architecture
- **Real-time Database**: Convex backend with instant updates
- **Responsive Design**: Mobile-first approach

### 🐉 Dragon Collection
- **Fire Dragons**: Ignis Rex, Fafnir, Smaug, Tiamat
- **Ice Dragons**: Glacius Eternus, Frostfang
- **Water Dragons**: Ryūjin, Long Wang, Jörmungandr
- **Legendary**: Draconis Sapiens, Shenlong, Quetzalcoatl
- **Cultural Variety**: European, Asian, Nordic, Egyptian, Greek, Welsh, Indian

### 🎨 Features
- Search & filter by name or tags
- Modal popup dialogs with dragon details
- Gold color theme throughout
- Tag-based network connections
- Smooth physics simulation
