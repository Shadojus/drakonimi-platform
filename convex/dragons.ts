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
    if (!args.searchTerm) {
      return await ctx.db.query("dragons").collect();
    }
    
    const allDragons = await ctx.db.query("dragons").collect();
    return allDragons.filter((dragon) =>
      dragon.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      dragon.description.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});

// Get dragon by ID
export const getById = query({
  args: { id: v.id("dragons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
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

    // Create dragons
    const dragons = [
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
        name: "Ignis Rex",
        origin: "Volcanic Depths",
        commonNames: ["Fire Dragon", "Lord of Flames", "Phoenix Dragon"],
        description: "Lord of flames, master of volcanic fury and rebirth through fire. Commands the power of phoenix rebirth and eternal flame.",
        imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400",
        tags: ["fire", "power", "rebirth", "volcanic", "epic"],
        createdAt: Date.now(),
      },
      {
        name: "Glacius Guardian",
        origin: "Frozen Northern Wastes",
        commonNames: ["Ice Dragon", "Winter Guardian", "Frost Keeper"],
        description: "Ice dragon protecting frozen realms, master of winter's eternal slumber. Wields the power of eternal frost and time suspension.",
        imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400",
        tags: ["ice", "guardian", "winter", "frost", "rare"],
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

    // Create categories for first dragon (wisdom dragon)
    await ctx.db.insert("categories", {
      dragonId: dragonIds[0],
      type: "mythology",
      title: "Ancient Wisdom Mythology",
      content: "Legends speak of dragons who existed before time, collecting knowledge from dying civilizations.",
      createdAt: Date.now(),
    });

    return { message: "Dragons seeded successfully", count };
  },
});
