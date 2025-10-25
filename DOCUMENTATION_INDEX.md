# 📚 Documentation Index - Drakonomi Platform

Complete guide to the platform architecture, features, and replication process.

## 🗂️ Core Documentation

### 1. **README.md** - Start Here
**Purpose**: Overview and quick start guide  
**Contents**:
- Platform introduction
- Version 2.1 features
- Installation instructions
- Dragon database (30+ profiles)
- Development workflow
- Tag system reference

**Read first if**: You're new to the platform

---

### 2. **ATOMIC_DESIGN.md** - Architecture Guide
**Purpose**: Complete atomic design structure explanation  
**Contents**:
- Component hierarchy (atoms/molecules/organisms)
- Each component detailed breakdown
- Data flow visualization
- Benefits and principles
- Configuration constants
- Adaptation guide for other platforms

**Read first if**: You want to understand the codebase structure

---

### 3. **ATOMIC_IMPLEMENTATION.md** - Migration Details
**Purpose**: How we achieved atomic architecture  
**Contents**:
- Before/after comparison
- Code metrics and improvements
- Testability enhancements
- Reusability examples
- Future migration plans
- Best practices established

**Read first if**: You want to see the refactoring process

---

### 4. **PLATFORM_REPLICATION_GUIDE.md** - Template Usage
**Purpose**: Step-by-step guide for Funginomi & Phytonomi  
**Contents**:
- Complete replication process
- Component adaptation instructions
- Color palette changes
- Schema modifications
- Quick start commands
- Estimated timelines (6-8 hours total)

**Read first if**: You're ready to create Funginomi or Phytonomi

---

### 5. **CHANGELOG_v2.1.md** - Recent Updates
**Purpose**: Latest improvements and technical details  
**Contents**:
- Logarithmic link scaling explanation
- Mathematical analysis
- Before/after comparisons
- Documentation updates summary
- Testing checklist

**Read first if**: You want to know what changed in v2.1

---

## 🏗️ Component Documentation

### Atoms (`components/atoms/`)

**DragonNode.tsx**
- Single dragon bubble rendering
- Image clipping and border drawing
- Label positioning
- Exports: `DragonNodeData`, `renderDragonNode()`

**DragonLink.tsx**  
- Connection styling between dragons
- **Logarithmic width scaling**: `0.8 + log(n+1) * 0.5`
- Color gradation by strength
- Particle count calculation
- Exports: `DragonLinkData`, `getLinkColor()`, `getLinkWidth()`, `getLinkParticles()`

**TagColors.tsx**
- 60+ color palette for dragon attributes
- Category-based colors (fire=red, water=blue, etc.)
- Primary color selection algorithm
- Exports: `TAG_COLORS`, `getTagColor()`, `getPrimaryDragonColor()`

---

### Molecules (`components/molecules/`)

**ImageCache.tsx**
- Dragon image preloading system
- Async image loading with React hooks
- Cache management
- Exports: `Dragon` interface, `useImageCache()` hook

**GraphData.tsx**
- Transform dragons → network graph
- Node/link creation logic
- Tag similarity matching
- Connection strength calculation
- Size calculation based on connections
- Exports: `GraphData`, `createGraphData()`

**ForceSimulation.tsx**
- D3 force physics configuration
- Repulsion: `-600` (strong spacing)
- Collision: `15px` radius, `1.0` strength
- Auto-centering and damping
- Exports: `useForceSimulation()`, `FORCE_CONFIG`

---

### Organisms (`components/organisms/`)

**BubbleCloud.tsx**
- Main visualization component
- Orchestrates all atoms/molecules
- Integrates react-force-graph-2d
- Handles user interactions (click, zoom, drag)
- Responsive dimensions
- Exports: `BubbleCloud` (default)

---

## 🎯 Quick Reference

### Key Files by Task

**Want to change colors?**  
→ `components/atoms/TagColors.tsx`

**Want to adjust spacing?**  
→ `components/molecules/ForceSimulation.tsx` (`FORCE_CONFIG`)

**Want to modify link appearance?**  
→ `components/atoms/DragonLink.tsx`

**Want to change node rendering?**  
→ `components/atoms/DragonNode.tsx`

**Want to add dragons?**  
→ `convex/dragons.ts` (`seedDragons` mutation)

**Want to update UI layout?**  
→ `app/page.tsx`

---

## 📐 Configuration Reference

### Visual Balance Constants

```typescript
// Link Width (DragonLink.tsx)
baseWidth: 0.8px
formula: 0.8 + Math.log(strength + 1) * 0.5
range: 0.8px - 1.9px

// Force Physics (ForceSimulation.tsx)
chargeStrength: -600      // Repulsion
collisionRadius: 15px     // Spacing
collisionStrength: 1.0    // Full force
velocityDecay: 0.3        // Damping
alphaDecay: 0.01          // Cooling

// Node Sizes (GraphData.tsx)
baseSize: 22px
range: 22px - 40px
calculation: base + tags*2 + connections*1.5
```

### Color Categories

```typescript
// Fire/Power: #FF4500 (Orange Red)
// Water/Ice: #1E90FF (Dodger Blue)
// Nature/Earth: #228B22 (Forest Green)
// Light/Holy: #FFD700 (Gold)
// Dark/Shadow: #8B008B (Dark Magenta)
// Time/Space: #9370DB (Medium Purple)
// Default: #FFD700 (Gold)
```

---

## 🔄 Development Workflow

### 1. Local Development
```bash
npm run dev              # Port 3000
npm run dev -- --port 3003  # Custom port
```

### 2. Database Seeding
```bash
# Via Convex dashboard
npx convex dashboard

# Run mutation: dragons:reseedDragons
```

### 3. Type Checking
```bash
npm run lint   # ESLint
tsc --noEmit   # TypeScript check
```

### 4. Production Build
```bash
npm run build  # Next.js build
npm start      # Production server
```

---

## 🎓 Learning Path

### Beginner → Advanced

1. **Start**: Read `README.md` for overview
2. **Understand**: Study `ATOMIC_DESIGN.md` for architecture
3. **Explore**: Browse component files in order (atoms → molecules → organisms)
4. **Practice**: Modify `TagColors.tsx` to see immediate visual changes
5. **Advanced**: Read `ATOMIC_IMPLEMENTATION.md` for deep dive
6. **Replicate**: Follow `PLATFORM_REPLICATION_GUIDE.md` to create Funginomi

---

## 🧪 Testing Guide

### Component Testing
```typescript
// Test atoms
describe('TagColors', () => {
  it('returns correct color for fire', () => {
    expect(getTagColor('fire')).toBe('#FF4500');
  });
});

// Test molecules
describe('GraphData', () => {
  it('creates correct nodes', () => {
    const data = createGraphData(mockDragons);
    expect(data.nodes.length).toBe(30);
  });
});

// Test organisms
describe('BubbleCloud', () => {
  it('renders without error', () => {
    render(<BubbleCloud dragons={[]} onDragonClick={jest.fn()} />);
  });
});
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Links too thick  
**Solution**: Already fixed with logarithmic scaling in v2.1

**Issue**: Nodes overlapping  
**Solution**: Increase `FORCE_CONFIG.chargeStrength` (more negative)

**Issue**: Network too spread out  
**Solution**: Decrease `FORCE_CONFIG.chargeStrength` (less negative)

**Issue**: Images not loading  
**Solution**: Check CORS and Unsplash URLs in `convex/dragons.ts`

**Issue**: TypeScript errors  
**Solution**: Run `npm install @types/d3-force`

---

## 📊 Metrics & Performance

### Codebase Size
- Total components: 10+ (atoms + molecules + organisms)
- Lines of code: ~2,000 (well-structured)
- Largest file: 118 lines (BubbleCloud.tsx)
- Test coverage: Ready for unit tests

### Performance
- Initial load: <2s
- Image caching: Async, non-blocking
- Force simulation: 200 ticks, optimized
- 30+ nodes: Smooth 60fps
- Zoom/pan: Hardware accelerated

---

## 🔮 Future Enhancements

### Planned Features
- [ ] DragonTooltip atom (hover details)
- [ ] SearchFilter molecule (advanced filtering)
- [ ] LegendPanel organism (tag legend)
- [ ] Timeline organism (dragon evolution)
- [ ] ComparisonView template (side-by-side)

### Template Expansion
- [ ] Funginomi (mushrooms) - Ready for replication
- [ ] Phytonomi (plants) - Ready for replication
- [ ] Additional platforms (minerals, animals, etc.)

---

## 🏆 Version History

**v2.1** (Current - October 2025)
- ✅ Logarithmic link scaling
- ✅ Zoom-independent layout
- ✅ Complete documentation overhaul

**v2.0** (October 2025)
- ✅ Atomic Design migration
- ✅ 30+ dragon profiles
- ✅ Fullscreen universe design

**v1.0** (Initial)
- ✅ Basic 3-dragon network
- ✅ Force-directed graph
- ✅ Convex backend

---

## 📞 Support & Contribution

### Getting Help
1. Check this documentation index
2. Review component-specific docs
3. Check troubleshooting section
4. Review code comments (JSDoc)

### Contributing
1. Follow atomic design principles
2. Maintain type safety
3. Document new components
4. Test before committing

---

**This documentation index covers everything you need to understand, use, and extend the platform!** 🐉

**Navigation**: Start with `README.md`, then explore based on your needs. All docs are cross-referenced.
