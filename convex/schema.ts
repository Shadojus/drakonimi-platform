import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  dragons: defineTable({
    // Basic Info
    name: v.string(), // Common name
    latinName: v.optional(v.string()), // Scientific/mythological name (used in URL) - OPTIONAL for migration
    origin: v.string(), // Eastern, Western, etc.
    commonNames: v.optional(v.array(v.string())),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    
    // Media
    imageUrl: v.optional(v.string()),
    images: v.optional(v.array(v.string())), // Additional images
    
    // Classification
    family: v.optional(v.string()),
    order: v.optional(v.string()),
    
    // Dragon Properties
    element: v.optional(v.string()), // fire, water, earth, air, etc.
    dangerLevel: v.optional(v.union(
      v.literal("harmless"),
      v.literal("cautious"),
      v.literal("dangerous"),
      v.literal("deadly"),
      v.literal("legendary")
    )),
    
    // Statistics
    powerLevel: v.optional(v.number()), // 1-10
    wingspan: v.optional(v.number()), // in meters
    intelligence: v.optional(v.number()), // 1-10
    speed: v.optional(v.number()), // 1-10
    fireBreath: v.optional(v.number()), // 1-10
    
    // Details
    habitat: v.optional(v.array(v.string())),
    diet: v.optional(v.string()),
    lifespan: v.optional(v.string()),
    abilities: v.optional(v.array(v.string())),
    
    // Categorization
    tags: v.array(v.string()),
    categories: v.optional(v.array(v.string())), // Optional for migration
    
    // Status
    isAvailable: v.optional(v.boolean()),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["tags"],
    }),

  categories: defineTable({
    dragonId: v.id("dragons"),
    type: v.union(
      v.literal("mythology"),
      v.literal("powers"),
      v.literal("geography"),
      v.literal("literature"),
      v.literal("legends"),
      v.literal("culture")
    ),
    title: v.string(),
    content: v.string(),
    references: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index("by_dragon", ["dragonId"])
    .index("by_type", ["type"]),

  articles: defineTable({
    categoryId: v.id("categories"),
    dragonId: v.id("dragons"),
    title: v.string(),
    content: v.string(),
    author: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_dragon", ["dragonId"]),
});
