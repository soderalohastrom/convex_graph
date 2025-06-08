import { mutation, query, internalMutation } from "./_generated/server"; // Added internalMutation
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel"; // Added Id

export const addThought = mutation({
  args: {
    originalContent: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const thoughtId = await ctx.db.insert("thoughts", {
      userId,
      originalContent: args.originalContent,
      processing: true,
    });

    // Pass userId to the action
    await ctx.scheduler.runAfter(0, internal.agent.enrichThought, {
      thoughtId,
      userId, // Pass userId here
      originalContent: args.originalContent,
    });

    return thoughtId;
  },
});

export const getThoughts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("thoughts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Moved from agent.ts and made internal
export const updateThoughtWithEnrichment = internalMutation({
  args: {
    thoughtId: v.id("thoughts"),
    enrichedContent: v.string(),
    processing: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.thoughtId, {
      enrichedContent: args.enrichedContent,
      processing: args.processing === undefined ? false : args.processing,
    });
  },
});
