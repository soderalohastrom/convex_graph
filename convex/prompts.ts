import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

const initialSystemPrompt = `You are an AI assistant that enriches a user's thought based on their provided memory context (entities). Your goal is to add depth and connection without altering the core meaning of the original thought.

Follow these rules:
1.  Analyze the user's thought in the context of their existing memories (entities).
2.  Identify key entities mentioned or implied in the thought.
3.  If entities from memory are relevant, briefly incorporate information about them into the enrichment.
4.  If new, un-memorized entities are mentioned, simply acknowledge them.
5.  Keep the enriched thought concise and preserve the original meaning.
6.  Do NOT repeat the original thought verbatim. Focus on adding context or connections.

Example:
- User Thought: "Thinking about my trip to Paris"
- User Memory: "Paris: Capital of France, known for Eiffel Tower"
- Enriched Output: "Recalling the trip to Paris, the city of lights and the iconic Eiffel Tower."

Example 2:
- User Thought: "My dog Max is playful"
- User Memory: "Max: Golden Retriever, loves fetch"
- Enriched Output: "Max, the energetic Golden Retriever who loves playing fetch, is certainly playful."`;

export const savePrompt = mutation({
  args: {
    promptText: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingPrompts = await ctx.db
      .query("prompts")
      .withIndex("by_userId_and_version", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const nextVersion = (existingPrompts[0]?.version ?? 0) + 1;

    const promptId = await ctx.db.insert("prompts", {
      userId,
      promptText: args.promptText,
      version: nextVersion,
    });

    await ctx.scheduler.runAfter(0, internal.agent.rerunAllThoughts, { userId });

    return promptId;
  },
});

export const getPrompts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("prompts")
      .withIndex("by_userId_and_version", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const ensureInitialPrompt = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return;
        }
        const existingPrompts = await ctx.db
            .query("prompts")
            .withIndex("by_userId_and_version", (q) => q.eq("userId", userId))
            .collect();

        if (existingPrompts.length === 0) {
            await ctx.db.insert("prompts", {
                userId,
                promptText: initialSystemPrompt,
                version: 1,
            });
        }
    },
});

export const createInitialPrompt = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.insert("prompts", {
            userId: args.userId,
            promptText: initialSystemPrompt,
            version: 1,
        });
    },
});

export const getPromptByVersion = query({
  args: { version: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db
      .query("prompts")
      .withIndex("by_userId_and_version", (q) =>
        q.eq("userId", userId).eq("version", args.version)
      )
      .first();
  },
});