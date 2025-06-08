import { mutation, query, internalQuery } from "./_generated/server"; // Added internalQuery
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const addEntity = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return await ctx.db.insert("entities", {
      userId,
      name: args.name,
      type: args.type,
      description: args.description,
    });
  },
});

export const getEntities = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("entities")
      .withIndex("by_userId_and_name", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Internal query to be called by actions, requires userId
export const getEntitiesForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("entities")
      .withIndex("by_userId_and_name", (q) => q.eq("userId", args.userId))
      .collect();
  },
});


export const deleteEntity = mutation({
  args: { entityId: v.id("entities") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const entity = await ctx.db.get(args.entityId);
    if (!entity || entity.userId !== userId) {
      throw new Error("Entity not found or user not authorized");
    }
    await ctx.db.delete(args.entityId);
  },
});
