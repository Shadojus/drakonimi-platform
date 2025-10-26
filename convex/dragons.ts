import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query all dragons
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("dragons").collect();
  },
});

// Query dragons by search term
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm || args.searchTerm.length < 2) {
      return [];
    }

    const searchLower = args.searchTerm.toLowerCase();
    const allDragons = await ctx.db.query("dragons").collect();
    
    const results = allDragons.filter((dragon) => {
      // Search in common name
      if (dragon.name.toLowerCase().includes(searchLower)) return true;
      
      // Search in latin name
      if (dragon.latinName && dragon.latinName.toLowerCase().includes(searchLower)) return true;
      
      // Search in tags
      if (dragon.tags && dragon.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))) return true;
      
      // Search in origin
      if (dragon.origin && dragon.origin.toLowerCase().includes(searchLower)) return true;
      
      // Search in description
      if (dragon.description && dragon.description.toLowerCase().includes(searchLower)) return true;
      
      return false;
    });

    return results.slice(0, 50); // Limit to 50 results
  },
});

// Get dragon by ID
export const getById = query({
  args: { id: v.id("dragons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get dragon by Latin name (for URL routing)
export const getByLatinName = query({
  args: { latinName: v.string() },
  handler: async (ctx, args) => {
    // Normalize the search term (handle URL format: lowercase with hyphens)
    const searchTerm = args.latinName.toLowerCase().replace(/-/g, ' ');
    
    const allDragons = await ctx.db.query("dragons").collect();
    
    // Find dragon where latinName matches (case-insensitive)
    const dragon = allDragons.find(d => 
      d.latinName && d.latinName.toLowerCase() === searchTerm
    );
    
    return dragon || null;
  },
});

// Get related dragons (same element or similar properties)
export const getRelated = query({
  args: { 
    dragonId: v.id("dragons"), 
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    const dragon = await ctx.db.get(args.dragonId);
    if (!dragon) return [];

    const allDragons = await ctx.db.query("dragons").collect();
    
    // Find dragons with shared tags or properties
    const related = allDragons
      .filter((d) => {
        if (d._id === dragon._id) return false;
        
        // Check for shared tags
        if (dragon.tags && d.tags) {
          const sharedTags = dragon.tags.filter((tag: string) => d.tags.includes(tag));
          if (sharedTags.length > 0) return true;
        }
        
        return false;
      })
      .slice(0, args.limit || 6);

    return related;
  },
});

// Get all available dragons (for listing)
export const getAvailable = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("dragons").collect();
  },
});

// Seed initial dragon data
export const seedDragons = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("dragons").first();
    if (existing) {
      return { message: "Dragons already seeded", count: 0 };
    }

    // Create dragons - 30+ dragons from various cultures and mythologies
    const dragons = [
      // WISDOM & ANCIENT DRAGONS
      {
        name: "Draconis Sapiens",
        origin: "Ancient Mountains of Wisdom",
        commonNames: ["Wisdom Dragon", "Knowledge Keeper", "Dream Weaver"],
        description: "Ancient dragon of wisdom, keeper of forgotten knowledge and cosmic secrets. Known for transmitting knowledge through dreams and visions.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        tags: ["wisdom", "knowledge", "ancient", "mystical", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Shenlong",
        origin: "Chinese Heaven",
        commonNames: ["Azure Dragon", "Weather Master", "Celestial Dragon"],
        description: "Divine Chinese dragon controlling weather, rain, and natural phenomena. Symbol of power and good fortune in East Asian mythology.",
        imageUrl: "https://images.unsplash.com/photo-1551651767-c76fdccf085b?w=400",
        tags: ["asian", "weather", "celestial", "benevolent", "chinese"],
        createdAt: Date.now(),
      },
      {
        name: "Quetzalcoatl",
        origin: "Aztec Empire",
        commonNames: ["Feathered Serpent", "Wind God", "Morning Star"],
        description: "Aztec feathered serpent god of wind, air, and learning. Bringer of knowledge and civilization to humanity.",
        imageUrl: "https://images.unsplash.com/photo-1584195820841-6d6c06535598?w=400",
        tags: ["aztec", "feathered", "knowledge", "divine", "legendary"],
        createdAt: Date.now(),
      },

      // FIRE & POWER DRAGONS
      {
        name: "Ignis Rex",
        origin: "Volcanic Depths",
        commonNames: ["Fire Dragon", "Lord of Flames", "Phoenix Dragon"],
        description: "Lord of flames, master of volcanic fury and rebirth through fire. Commands the power of phoenix rebirth and eternal flame.",
        imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400",
        tags: ["fire", "power", "volcanic", "rebirth", "epic"],
        createdAt: Date.now(),
      },
      {
        name: "Fafnir",
        origin: "Germanic Mythology",
        commonNames: ["Gold Drake", "Cursed Guardian", "Dwarf-Slayer"],
        description: "Once a dwarf, transformed into a mighty dragon by greed. Guards cursed treasure with deadly ferocity.",
        imageUrl: "https://images.unsplash.com/photo-1566888596782-c7f41cc4e5c0?w=400",
        tags: ["european", "greed", "cursed", "treasure", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Smaug",
        origin: "Middle-earth (Literary)",
        commonNames: ["The Golden", "The Magnificent", "The Terrible"],
        description: "Legendary dragon who conquered the Lonely Mountain, hoarding vast treasures. Known for intelligence and cruelty.",
        imageUrl: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400",
        tags: ["literary", "fire", "treasure", "ancient", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Pyroclast",
        origin: "Ring of Fire",
        commonNames: ["Lava Wyrm", "Volcanic Destroyer", "Magma Lord"],
        description: "Elemental fire dragon born from volcanic eruptions. Brings destruction and renewal through molten fury.",
        imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400",
        tags: ["fire", "volcanic", "elemental", "destruction", "power"],
        createdAt: Date.now(),
      },

      // ICE & FROST DRAGONS
      {
        name: "Glacius Guardian",
        origin: "Frozen Northern Wastes",
        commonNames: ["Ice Dragon", "Winter Guardian", "Frost Keeper"],
        description: "Ice dragon protecting frozen realms, master of winter's eternal slumber. Wields the power of eternal frost and time suspension.",
        imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400",
        tags: ["ice", "guardian", "winter", "frost", "elemental"],
        createdAt: Date.now(),
      },
      {
        name: "Frostfang",
        origin: "Arctic Circle",
        commonNames: ["Blizzard Bringer", "Eternal Winter", "Ice Wyrm"],
        description: "Ancient ice dragon whose breath brings eternal winter. Guardian of frozen secrets buried in glaciers.",
        imageUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400",
        tags: ["ice", "frost", "ancient", "winter", "elemental"],
        createdAt: Date.now(),
      },

      // WATER & OCEAN DRAGONS
      {
        name: "Ryujin",
        origin: "Japanese Sea",
        commonNames: ["Dragon King", "Ocean Lord", "Tide Master"],
        description: "Japanese dragon god of the sea, controlling tides and marine life from an underwater palace of coral and pearl.",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
        tags: ["japanese", "water", "ocean", "divine", "asian"],
        createdAt: Date.now(),
      },
      {
        name: "Long Wang",
        origin: "Chinese Rivers",
        commonNames: ["River Dragon", "Rain Bringer", "Water King"],
        description: "Chinese dragon king of rivers and lakes, bringing rain to crops. Benevolent protector of fishermen and sailors.",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
        tags: ["chinese", "water", "rivers", "benevolent", "asian"],
        createdAt: Date.now(),
      },

      // SERPENT & PRIMORDIAL DRAGONS
      {
        name: "Jörmungandr",
        origin: "Norse Mythology",
        commonNames: ["World Serpent", "Midgard Serpent", "Ocean Coiler"],
        description: "Gigantic serpent encircling the world, son of Loki. Destined to battle Thor during Ragnarök.",
        imageUrl: "https://images.unsplash.com/photo-1578670812003-60745e2c2ea9?w=400",
        tags: ["nordic", "serpent", "ocean", "primordial", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Ouroboros",
        origin: "Ancient Egypt/Greece",
        commonNames: ["Infinity Serpent", "Cycle Dragon", "Eternal"],
        description: "Cosmic serpent eating its own tail, symbolizing infinity, eternal return, and the unity of all things.",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
        tags: ["cosmic", "serpent", "eternity", "mystical", "symbolic"],
        createdAt: Date.now(),
      },
      {
        name: "Tiamat",
        origin: "Mesopotamian Mythology",
        commonNames: ["Chaos Dragon", "Primordial Mother", "Salt Water Dragon"],
        description: "Primordial goddess of chaos and salt water oceans. Mother of the first generation of gods.",
        imageUrl: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400",
        tags: ["mesopotamian", "chaos", "primordial", "ocean", "divine"],
        createdAt: Date.now(),
      },
      {
        name: "Apophis",
        origin: "Ancient Egypt",
        commonNames: ["Chaos Serpent", "Eclipse Dragon", "Darkness"],
        description: "Egyptian serpent of chaos and darkness, eternal enemy of Ra. Attempts to swallow the sun each night.",
        imageUrl: "https://images.unsplash.com/photo-1614463983778-33762a96d578?w=400",
        tags: ["egyptian", "chaos", "darkness", "serpent", "primordial"],
        createdAt: Date.now(),
      },

      // GUARDIAN & PROTECTIVE DRAGONS
      {
        name: "Ladon",
        origin: "Ancient Greece",
        commonNames: ["Golden Guardian", "Hundred-Headed", "Hesperides Guardian"],
        description: "Multi-headed serpent-dragon guarding the golden apples of the Hesperides. Never sleeps, eternal vigilance.",
        imageUrl: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400",
        tags: ["greek", "guardian", "serpent", "vigilant", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Y Ddraig Goch",
        origin: "Wales",
        commonNames: ["Red Dragon", "Welsh Dragon", "National Guardian"],
        description: "Red dragon of Wales, symbol of power and sovereignty. Legendary victor over the white dragon of the Saxons.",
        imageUrl: "https://images.unsplash.com/photo-1578672996041-08012f6fa921?w=400",
        tags: ["welsh", "red", "guardian", "national", "european"],
        createdAt: Date.now(),
      },
      {
        name: "Naga",
        origin: "Indian Mythology",
        commonNames: ["Serpent Deity", "Water Guardian", "Cobra Dragon"],
        description: "Hindu and Buddhist serpent deities, guardians of treasures, waters, and thresholds. Shape-shifters with divine wisdom.",
        imageUrl: "https://images.unsplash.com/photo-1589118949053-fdf44c91c0ce?w=400",
        tags: ["indian", "serpent", "guardian", "divine", "asian"],
        createdAt: Date.now(),
      },

      // ELEMENT & NATURE DRAGONS
      {
        name: "Tempest",
        origin: "Storm Peaks",
        commonNames: ["Thunder Drake", "Lightning Lord", "Sky Fury"],
        description: "Elemental storm dragon commanding thunder and lightning. Flies through hurricanes, splitting skies with electrical fury.",
        imageUrl: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400",
        tags: ["storm", "lightning", "elemental", "sky", "power"],
        createdAt: Date.now(),
      },
      {
        name: "Terraclaw",
        origin: "Mountain Depths",
        commonNames: ["Earth Dragon", "Stone Guardian", "Mountain Lord"],
        description: "Elemental earth dragon, body of living stone. Shapes mountains with its passage, guardian of mineral treasures.",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        tags: ["earth", "stone", "elemental", "mountain", "ancient"],
        createdAt: Date.now(),
      },
      {
        name: "Verdantis",
        origin: "Primeval Forests",
        commonNames: ["Forest Dragon", "Nature Guardian", "Green Wyrm"],
        description: "Dragon of forests and nature, covered in living vines and moss. Protector of ancient groves and natural balance.",
        imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
        tags: ["nature", "forest", "elemental", "guardian", "benevolent"],
        createdAt: Date.now(),
      },

      // COSMIC & MYSTICAL DRAGONS
      {
        name: "Chronos Drake",
        origin: "Outside Time",
        commonNames: ["Time Dragon", "Temporal Lord", "Eternity Keeper"],
        description: "Mystical dragon existing outside normal time. Witnesses all moments simultaneously, guardian of temporal stability.",
        imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400",
        tags: ["cosmic", "time", "mystical", "eternal", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Void Serpent",
        origin: "Space Between Stars",
        commonNames: ["Star Eater", "Cosmic Wyrm", "Void Dragon"],
        description: "Dragon of the cosmic void, dwelling between stars. Feeds on dying suns, leaves darkness in its wake.",
        imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
        tags: ["cosmic", "void", "space", "darkness", "primordial"],
        createdAt: Date.now(),
      },
      {
        name: "Aurelia",
        origin: "Celestial Realms",
        commonNames: ["Golden Dragon", "Divine Light", "Holy Wyrm"],
        description: "Divine dragon of pure golden light. Banishes darkness and evil, symbol of ultimate good and righteousness.",
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
        tags: ["divine", "light", "holy", "legendary", "celestial"],
        createdAt: Date.now(),
      },
      {
        name: "Prismatic",
        origin: "Realm of Light",
        commonNames: ["Rainbow Dragon", "Spectrum Wyrm", "Hope Bringer"],
        description: "Dragon of living rainbow light, embodiment of hope and possibility. Scales refract all colors simultaneously.",
        imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400",
        tags: ["light", "rainbow", "hope", "mystical", "benevolent"],
        createdAt: Date.now(),
      },

      // SHADOW & DARK DRAGONS
      {
        name: "Nightmare",
        origin: "Dream Realm",
        commonNames: ["Shadow Drake", "Fear Eater", "Dream Walker"],
        description: "Dragon of nightmares and illusions, feeding on fear. Can enter dreams and manifest terrors into reality.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
        tags: ["shadow", "illusion", "fear", "psychic", "mystical"],
        createdAt: Date.now(),
      },
      {
        name: "Nidhogg",
        origin: "Norse Mythology",
        commonNames: ["Corpse Eater", "Root Gnawer", "Underworld Dragon"],
        description: "Dragon gnawing at the roots of Yggdrasil, the World Tree. Dwells in the underworld among corpses.",
        imageUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400",
        tags: ["nordic", "death", "underworld", "serpent", "dark"],
        createdAt: Date.now(),
      },

      // UNIQUE & SPECIAL DRAGONS
      {
        name: "Bakunawa",
        origin: "Philippine Mythology",
        commonNames: ["Moon Eater", "Eclipse Serpent", "Sea Dragon"],
        description: "Giant sea serpent attempting to swallow the moon, causing eclipses. Guardians must make noise to scare it away.",
        imageUrl: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400",
        tags: ["philippine", "serpent", "ocean", "eclipse", "asian"],
        createdAt: Date.now(),
      },
      {
        name: "Wyvern",
        origin: "Medieval Europe",
        commonNames: ["Two-Legged Drake", "Venomous Wyrm", "Sky Hunter"],
        description: "Two-legged winged dragon with venomous tail. Aggressive predator of medieval European skies.",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
        tags: ["european", "wyvern", "venomous", "aggressive", "medieval"],
        createdAt: Date.now(),
      },
      {
        name: "Zilant",
        origin: "Tatar Mythology",
        commonNames: ["Crowned Serpent", "Kazan Dragon", "Winged Snake"],
        description: "Winged serpent-dragon from Tatar mythology, symbol of the city of Kazan. Often depicted with a crown.",
        imageUrl: "https://images.unsplash.com/photo-1551651767-c76fdccf085b?w=400",
        tags: ["tatar", "serpent", "winged", "crowned", "symbolic"],
        createdAt: Date.now(),
      },
    ];

    let count = 0;
    const dragonIds = [];
    
    for (const dragon of dragons) {
      const dragonId = await ctx.db.insert("dragons", dragon);
      dragonIds.push(dragonId);
      count++;
    }

    return { message: "Dragons seeded successfully", count };
  },
});

// Clear all dragons (for re-seeding)
export const clearAllDragons = mutation({
  args: {},
  handler: async (ctx) => {
    const allDragons = await ctx.db.query("dragons").collect();
    let count = 0;
    
    for (const dragon of allDragons) {
      await ctx.db.delete(dragon._id);
      count++;
    }
    
    return { message: "All dragons deleted", count };
  },
});

// Re-seed: Clear and seed fresh
export const reseedDragons = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing
    const allDragons = await ctx.db.query("dragons").collect();
    for (const dragon of allDragons) {
      await ctx.db.delete(dragon._id);
    }
    
    // Create fresh dragons - 30+ dragons from various cultures and mythologies
    const dragons = [
      // WISDOM & ANCIENT DRAGONS
      {
        name: "Draconis Sapiens",
        origin: "Ancient Mountains of Wisdom",
        commonNames: ["Wisdom Dragon", "Knowledge Keeper", "Dream Weaver"],
        description: "Ancient dragon of wisdom, keeper of forgotten knowledge and cosmic secrets. Known for transmitting knowledge through dreams and visions.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        tags: ["wisdom", "knowledge", "ancient", "mystical", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Shenlong",
        origin: "Chinese Heaven",
        commonNames: ["Azure Dragon", "Weather Master", "Celestial Dragon"],
        description: "Divine Chinese dragon controlling weather, rain, and natural phenomena. Symbol of power and good fortune in East Asian mythology.",
        imageUrl: "https://images.unsplash.com/photo-1551651767-c76fdccf085b?w=400",
        tags: ["asian", "weather", "celestial", "benevolent", "chinese"],
        createdAt: Date.now(),
      },
      {
        name: "Quetzalcoatl",
        origin: "Aztec Empire",
        commonNames: ["Feathered Serpent", "Wind God", "Morning Star"],
        description: "Aztec feathered serpent god of wind, air, and learning. Bringer of knowledge and civilization to humanity.",
        imageUrl: "https://images.unsplash.com/photo-1584195820841-6d6c06535598?w=400",
        tags: ["aztec", "feathered", "knowledge", "divine", "legendary"],
        createdAt: Date.now(),
      },

      // FIRE & POWER DRAGONS
      {
        name: "Ignis Rex",
        origin: "Volcanic Depths",
        commonNames: ["Fire Dragon", "Lord of Flames", "Phoenix Dragon"],
        description: "Lord of flames, master of volcanic fury and rebirth through fire. Commands the power of phoenix rebirth and eternal flame.",
        imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400",
        tags: ["fire", "power", "volcanic", "rebirth", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Fafnir",
        origin: "Germanic Mythology",
        commonNames: ["Gold Drake", "Cursed Guardian", "Dwarf-Slayer"],
        description: "Once a dwarf, transformed into a mighty dragon by greed. Guards cursed treasure with deadly ferocity.",
        imageUrl: "https://images.unsplash.com/photo-1566888596782-c7f41cc4e5c0?w=400",
        tags: ["european", "greed", "cursed", "treasure", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Smaug",
        origin: "Middle-earth (Literary)",
        commonNames: ["The Golden", "The Magnificent", "The Terrible"],
        description: "Legendary dragon who conquered the Lonely Mountain, hoarding vast treasures. Known for intelligence and cruelty.",
        imageUrl: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400",
        tags: ["literary", "fire", "treasure", "ancient", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Pyroclast",
        origin: "Ring of Fire",
        commonNames: ["Lava Wyrm", "Volcanic Destroyer", "Magma Lord"],
        description: "Elemental fire dragon born from volcanic eruptions. Brings destruction and renewal through molten fury.",
        imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400",
        tags: ["fire", "volcanic", "elemental", "destruction", "power"],
        createdAt: Date.now(),
      },

      // ICE & FROST DRAGONS
      {
        name: "Glacius Guardian",
        origin: "Frozen Northern Wastes",
        commonNames: ["Ice Dragon", "Winter Guardian", "Frost Keeper"],
        description: "Ice dragon protecting frozen realms, master of winter's eternal slumber. Wields the power of eternal frost and time suspension.",
        imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400",
        tags: ["ice", "guardian", "winter", "frost", "elemental"],
        createdAt: Date.now(),
      },
      {
        name: "Frostfang",
        origin: "Arctic Circle",
        commonNames: ["Blizzard Bringer", "Eternal Winter", "Ice Wyrm"],
        description: "Ancient ice dragon whose breath brings eternal winter. Guardian of frozen secrets buried in glaciers.",
        imageUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400",
        tags: ["ice", "frost", "ancient", "winter", "elemental"],
        createdAt: Date.now(),
      },

      // WATER & OCEAN DRAGONS
      {
        name: "Ryujin",
        origin: "Japanese Sea",
        commonNames: ["Dragon King", "Ocean Lord", "Tide Master"],
        description: "Japanese dragon god of the sea, controlling tides and marine life from an underwater palace of coral and pearl.",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
        tags: ["japanese", "water", "ocean", "divine", "asian"],
        createdAt: Date.now(),
      },
      {
        name: "Long Wang",
        origin: "Chinese Rivers",
        commonNames: ["River Dragon", "Rain Bringer", "Water King"],
        description: "Chinese dragon king of rivers and lakes, bringing rain to crops. Benevolent protector of fishermen and sailors.",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
        tags: ["chinese", "water", "rivers", "benevolent", "asian"],
        createdAt: Date.now(),
      },

      // SERPENT & PRIMORDIAL DRAGONS
      {
        name: "Jörmungandr",
        origin: "Norse Mythology",
        commonNames: ["World Serpent", "Midgard Serpent", "Ocean Coiler"],
        description: "Gigantic serpent encircling the world, son of Loki. Destined to battle Thor during Ragnarök.",
        imageUrl: "https://images.unsplash.com/photo-1578670812003-60745e2c2ea9?w=400",
        tags: ["nordic", "serpent", "ocean", "primordial", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Ouroboros",
        origin: "Ancient Egypt/Greece",
        commonNames: ["Infinity Serpent", "Cycle Dragon", "Eternal"],
        description: "Cosmic serpent eating its own tail, symbolizing infinity, eternal return, and the unity of all things.",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
        tags: ["cosmic", "serpent", "eternity", "mystical", "symbolic"],
        createdAt: Date.now(),
      },
      {
        name: "Tiamat",
        origin: "Mesopotamian Mythology",
        commonNames: ["Chaos Dragon", "Primordial Mother", "Salt Water Dragon"],
        description: "Primordial goddess of chaos and salt water oceans. Mother of the first generation of gods.",
        imageUrl: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400",
        tags: ["mesopotamian", "chaos", "primordial", "ocean", "divine"],
        createdAt: Date.now(),
      },
      {
        name: "Apophis",
        origin: "Ancient Egypt",
        commonNames: ["Chaos Serpent", "Eclipse Dragon", "Darkness"],
        description: "Egyptian serpent of chaos and darkness, eternal enemy of Ra. Attempts to swallow the sun each night.",
        imageUrl: "https://images.unsplash.com/photo-1614463983778-33762a96d578?w=400",
        tags: ["egyptian", "chaos", "darkness", "serpent", "primordial"],
        createdAt: Date.now(),
      },

      // GUARDIAN & PROTECTIVE DRAGONS
      {
        name: "Ladon",
        origin: "Ancient Greece",
        commonNames: ["Golden Guardian", "Hundred-Headed", "Hesperides Guardian"],
        description: "Multi-headed serpent-dragon guarding the golden apples of the Hesperides. Never sleeps, eternal vigilance.",
        imageUrl: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400",
        tags: ["greek", "guardian", "serpent", "vigilant", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Y Ddraig Goch",
        origin: "Wales",
        commonNames: ["Red Dragon", "Welsh Dragon", "National Guardian"],
        description: "Red dragon of Wales, symbol of power and sovereignty. Legendary victor over the white dragon of the Saxons.",
        imageUrl: "https://images.unsplash.com/photo-1578672996041-08012f6fa921?w=400",
        tags: ["welsh", "red", "guardian", "national", "european"],
        createdAt: Date.now(),
      },
      {
        name: "Naga",
        origin: "Indian Mythology",
        commonNames: ["Serpent Deity", "Water Guardian", "Cobra Dragon"],
        description: "Hindu and Buddhist serpent deities, guardians of treasures, waters, and thresholds. Shape-shifters with divine wisdom.",
        imageUrl: "https://images.unsplash.com/photo-1589118949053-fdf44c91c0ce?w=400",
        tags: ["indian", "serpent", "guardian", "divine", "asian"],
        createdAt: Date.now(),
      },

      // ELEMENT & NATURE DRAGONS
      {
        name: "Tempest",
        origin: "Storm Peaks",
        commonNames: ["Thunder Drake", "Lightning Lord", "Sky Fury"],
        description: "Elemental storm dragon commanding thunder and lightning. Flies through hurricanes, splitting skies with electrical fury.",
        imageUrl: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400",
        tags: ["storm", "lightning", "elemental", "sky", "power"],
        createdAt: Date.now(),
      },
      {
        name: "Terraclaw",
        origin: "Mountain Depths",
        commonNames: ["Earth Dragon", "Stone Guardian", "Mountain Lord"],
        description: "Elemental earth dragon, body of living stone. Shapes mountains with its passage, guardian of mineral treasures.",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        tags: ["earth", "stone", "elemental", "mountain", "ancient"],
        createdAt: Date.now(),
      },
      {
        name: "Verdantis",
        origin: "Primeval Forests",
        commonNames: ["Forest Dragon", "Nature Guardian", "Green Wyrm"],
        description: "Dragon of forests and nature, covered in living vines and moss. Protector of ancient groves and natural balance.",
        imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
        tags: ["nature", "forest", "elemental", "guardian", "benevolent"],
        createdAt: Date.now(),
      },

      // COSMIC & MYSTICAL DRAGONS
      {
        name: "Chronos Drake",
        origin: "Outside Time",
        commonNames: ["Time Dragon", "Temporal Lord", "Eternity Keeper"],
        description: "Mystical dragon existing outside normal time. Witnesses all moments simultaneously, guardian of temporal stability.",
        imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400",
        tags: ["cosmic", "time", "mystical", "eternal", "legendary"],
        createdAt: Date.now(),
      },
      {
        name: "Void Serpent",
        origin: "Space Between Stars",
        commonNames: ["Star Eater", "Cosmic Wyrm", "Void Dragon"],
        description: "Dragon of the cosmic void, dwelling between stars. Feeds on dying suns, leaves darkness in its wake.",
        imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
        tags: ["cosmic", "void", "space", "darkness", "primordial"],
        createdAt: Date.now(),
      },
      {
        name: "Aurelia",
        origin: "Celestial Realms",
        commonNames: ["Golden Dragon", "Divine Light", "Holy Wyrm"],
        description: "Divine dragon of pure golden light. Banishes darkness and evil, symbol of ultimate good and righteousness.",
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
        tags: ["divine", "light", "holy", "legendary", "celestial"],
        createdAt: Date.now(),
      },
      {
        name: "Prismatic",
        origin: "Realm of Light",
        commonNames: ["Rainbow Dragon", "Spectrum Wyrm", "Hope Bringer"],
        description: "Dragon of living rainbow light, embodiment of hope and possibility. Scales refract all colors simultaneously.",
        imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400",
        tags: ["light", "rainbow", "hope", "mystical", "benevolent"],
        createdAt: Date.now(),
      },

      // SHADOW & DARK DRAGONS
      {
        name: "Nightmare",
        origin: "Dream Realm",
        commonNames: ["Shadow Drake", "Fear Eater", "Dream Walker"],
        description: "Dragon of nightmares and illusions, feeding on fear. Can enter dreams and manifest terrors into reality.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
        tags: ["shadow", "illusion", "fear", "psychic", "mystical"],
        createdAt: Date.now(),
      },
      {
        name: "Nidhogg",
        origin: "Norse Mythology",
        commonNames: ["Corpse Eater", "Root Gnawer", "Underworld Dragon"],
        description: "Dragon gnawing at the roots of Yggdrasil, the World Tree. Dwells in the underworld among corpses.",
        imageUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400",
        tags: ["nordic", "death", "underworld", "serpent", "dark"],
        createdAt: Date.now(),
      },

      // UNIQUE & SPECIAL DRAGONS
      {
        name: "Bakunawa",
        origin: "Philippine Mythology",
        commonNames: ["Moon Eater", "Eclipse Serpent", "Sea Dragon"],
        description: "Giant sea serpent attempting to swallow the moon, causing eclipses. Guardians must make noise to scare it away.",
        imageUrl: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400",
        tags: ["philippine", "serpent", "ocean", "eclipse", "asian"],
        createdAt: Date.now(),
      },
      {
        name: "Wyvern",
        origin: "Medieval Europe",
        commonNames: ["Two-Legged Drake", "Venomous Wyrm", "Sky Hunter"],
        description: "Two-legged winged dragon with venomous tail. Aggressive predator of medieval European skies.",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
        tags: ["european", "wyvern", "venomous", "aggressive", "medieval"],
        createdAt: Date.now(),
      },
      {
        name: "Zilant",
        origin: "Tatar Mythology",
        commonNames: ["Crowned Serpent", "Kazan Dragon", "Winged Snake"],
        description: "Winged serpent-dragon from Tatar mythology, symbol of the city of Kazan. Often depicted with a crown.",
        imageUrl: "https://images.unsplash.com/photo-1551651767-c76fdccf085b?w=400",
        tags: ["tatar", "serpent", "winged", "crowned", "symbolic"],
        createdAt: Date.now(),
      },
    ];

    let count = 0;
    
    for (const dragon of dragons) {
      await ctx.db.insert("dragons", dragon);
      count++;
    }

    return { message: "Dragons re-seeded successfully", count };
  },
});
