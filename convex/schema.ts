import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  entities: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.string(), // e.g., "person", "place", "pet"
    description: v.string(),
  }).index("by_userId_and_name", ["userId", "name"]),

  thoughts: defineTable({
    userId: v.id("users"),
    originalContent: v.string(),
    enrichedContent: v.optional(v.string()),
    processing: v.optional(v.boolean()), // To indicate if enrichment is in progress
  }).index("by_userId", ["userId"]),

  prompts: defineTable({
    userId: v.id("users"),
    promptText: v.string(),
    version: v.number(),
  }).index("by_userId_and_version", ["userId", "version"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
