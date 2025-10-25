# 🐉 Drakonomi - Dragon Wisdom Platform

**Interactive mythology platform exploring dragons across civilizations with immersive fullscreen universe visualization built on Atomic Design principles.**

![Status](https://img.shields.io/badge/Status-Production_Ready-success) ![Version](https://img.shields.io/badge/Version-2.2-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Convex](https://img.shields.io/badge/Convex-Backend-orange) ![Architecture](https://img.shields.io/badge/Atomic_Design-Implemented-purple)

---

## 🎯 Overview

Drakonomi is a **template platform** for knowledge visualization, featuring a revolutionary fullscreen "universe" design built with **Atomic Design architecture**. It explores dragon mythology, powers, and cultural significance through an interactive force-directed graph where dragons are nodes connected by shared attributes.

### ✨ Version 2.1 Features (October 2025)

#### 🏗️ Atomic Design Architecture
- **⚛️ Atoms**: Reusable building blocks (DragonNode, DragonLink, TagColors)
- **🔬 Molecules**: Compound components (ImageCache, GraphData, ForceSimulation)
- **🧬 Organisms**: Complex features (BubbleCloud)
- **Full modularity** - Each component independently testable
- **Template-ready** - Easy adaptation for Funginomi/Phytonomi
- **Type-safe** - Complete TypeScript coverage

#### 🌌 Fullscreen Universe Design
- **No borders, no containers** - Just the cosmic dragon network
- **Sticky header** with integrated search (always accessible)
- **Immersive experience** - The visualization IS the page
- **Universe feeling** - Float through knowledge like stars in space

#### 🎨 Enhanced Visualization with Balanced Aesthetics
- **30+ Dragon Profiles** across multiple mythologies
- **Dragon Images in Bubbles** - Circular cropped photos with colored borders
- **60+ Color-coded Tags** for attributes and cultures
- **Smart Link Scaling** - Logarithmic width prevents thick lines (0.8-1.8px)
- **Zoom-Independent Layout** - Looks great at any zoom level
- **Better Node Spacing** - Stronger repulsion (-600) for clarity
- **Collision Prevention** - 15px padding prevents overlap
- **Smooth Particle Flows** for living, breathing network
- **Cultural Connections** - Dragons linked by origin and type

#### 🔍 Improved Search & Navigation
- **Real-time filtering** in sticky header
- **Tag-based similarity** matching
- **Dragon count display** showing filtered results
- **Smooth transitions** between views

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup Convex (first time only)
npx convex dev --once

# Seed 30+ dragons (first time only)
# Run in Convex dashboard or mutation

# Start development server
npm run dev            # → http://localhost:3000

# Start with different port (for multi-platform dev)
npm run dev -- --port 3003
```

---

## 📊 Dragon Database

### 30+ Dragons Across Cultures

**European Dragons (7)**
- Fafnir (Germanic - greed, cursed, treasure)
- Smaug (Literary - fire, treasure, legendary)
- Ladon (Greek - guardian, serpent, immortal)
- Wyvern (British - venomous, aggressive)
- Y Ddraig Goch (Welsh - red, national, guardian)
- Nidhogg (Norse - death, underworld)
- Zilant (Tatar - crowned, symbolic)

**Asian Dragons (7)**
- Shenlong (Chinese - weather, celestial)
- Ryujin (Japanese - ocean, divine)
- Long Wang (Chinese - rivers, prosperity)
- Naga (Indian - serpent, wisdom, guardian)
- Bakunawa (Philippine - eclipse, ocean)
- And more...

**Primordial & Cosmic (7)**
- Tiamat (Mesopotamian - chaos, primordial)
- Ouroboros (Ancient - eternity, infinity)
- Jörmungandr (Norse - world serpent)
- Apophis (Egyptian - darkness, chaos)
- Quetzalcoatl (Aztec - feathered, knowledge)
- Chronos Drake (Time dragon)
- Void Serpent (Space dragon)

**Elemental Dragons (6)**
- Ignis Rex (Fire/Volcanic)
- Glacius Guardian (Ice/Frost)
- Frostfang (Arctic/Winter)
- Tempest (Storm/Lightning)
- Terraclaw (Earth/Stone)
- Verdantis (Forest/Nature)

**Special Types (3+)**
- Aurelia (Divine/Light)
- Prismatic (Rainbow/Hope)
- Nightmare (Shadow/Dreams)

### 🏷️ Tag System

**60+ Tags across categories:**
- **Elements**: fire, ice, water, earth, air, lightning, light, shadow
- **Attributes**: wisdom, power, chaos, divine, cursed, ancient, legendary
- **Cultures**: european, asian, chinese, japanese, nordic, greek, egyptian, aztec
- **Nature**: serpent, winged, feathered, guardian, benevolent, primordial
- **Domains**: ocean, mountain, sky, underworld, celestial, forest

---

## 🎨 Design Philosophy

### The "Universe Feeling"

```
┌─────────────────────────────────┐
│ Header: Logo + Search (sticky)  │
├─────────────────────────────────┤
│                                 │
│    🐉 🐲 🐉                     │
│  🐲    🐉    🐲                │
│     🐉   🐲   🐉               │
│  🐲    🐉    🐲   🐉          │
│     🐉   🐲   🐉               │
│  🐲    🐉    🐲                │
│                                 │
│   (Fullscreen BubbleCloud)      │
└─────────────────────────────────┘
```

**Key Principles:**
- ✅ Visualization is primary content
- ✅ No unnecessary UI chrome
- ✅ Search always available
- ✅ Immersive, distraction-free
- ✅ Like floating in cosmos

---

## 🔧 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **react-force-graph-2d** - Interactive network visualization

### Backend
- **Convex** - Real-time database & backend
- **Convex DEV**: `combative-cassowary-221`
- **Real-time sync** between devices

### Key Components
- `app/page.tsx` - Main page with sticky header + fullscreen layout
- `components/BubbleCloud.tsx` - Enhanced force-directed graph
- `convex/dragons.ts` - 30+ dragon seed data + queries
- `convex/schema.ts` - Database schema

---

## 🎯 Template for Other Platforms

**This design is being replicated for:**
- 🍄 **Funginomi** - Mushroom knowledge (99+ species)
- 🌿 **Phytonomi** - Plant wisdom (50+ plants)

**See**: `Drakonomi_TEMPLATE_DESIGN.md` for full template documentation

### Adaptation Guide

**For Funginomi:**
```typescript
// Change theme colors
--fungi-primary: #FF6B35;  // Orange
--fungi-accent: #F7931E;   // Bright Orange

// Adapt tags
"edible", "toxic", "medicinal", "psychoactive",
"saprobic", "mycorrhizal", "culinary"
```

**For Phytonomi:**
```typescript
// Change theme colors
--plant-primary: #10B981;  // Green
--plant-accent: #34D399;   // Bright Green

// Adapt tags
"medicinal", "edible", "toxic", "ceremonial",
"endangered", "cultivated", "psychoactive"
```

---

## 📈 Performance

- **Initial Load**: < 2s
- **Search Response**: < 100ms  
- **Animation**: 60 FPS
- **Bundle Size**: ~400KB (gzipped)

---

## 🔗 Links

- **GitHub**: [shadojus/drakonomi-platform](https://github.com/shadojus/drakonomi-platform)
- **Main Project**: [00_Universe README](../../README.md)
- **Design Template**: [Drakonomi_TEMPLATE_DESIGN.md](./Drakonomi_TEMPLATE_DESIGN.md)
- **Sister Platforms**: 
  - [Funginomi](../../05_Funginomi/funginomi-platform)
  - [Phytonomi](../../05_Phytonomi/phytonomi-platform)
  - [Bifröst](../../05_Bifroest/bifroest-platform) (Hub)

---

## 📝 Recent Changes

### Version 2.0 (October 25, 2025)
- ✅ Fullscreen universe design
- ✅ Sticky header with integrated search
- ✅ 30+ dragons across all mythologies
- ✅ Enhanced visualization (larger, brighter, more particles)
- ✅ 60+ tag system
- ✅ Cultural connection links
- ✅ Template documentation for replication

### Version 1.0 (October 2025)
- Initial release with 3 dragons
- Basic BubbleCloud in container
- Simple search functionality

---

**Part of the 00_Universe Wisdom Network** 🐉

*Template platform for immersive knowledge visualization*
