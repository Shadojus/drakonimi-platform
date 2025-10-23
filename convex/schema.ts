import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  dragons: defineTable({
    name: v.string(),
    origin: v.string(), // Eastern, Western, etc.
    commonNames: v.array(v.string()),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    createdAt: v.number(),
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
