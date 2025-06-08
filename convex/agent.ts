"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api, internal } from "./_generated/api"; // Ensure internal is imported
import { Id } from "./_generated/dataModel";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const enrichThought = internalAction({
  args: {
    thoughtId: v.id("thoughts"),
    userId: v.id("users"), // userId is passed but not directly used here as getEntities is auth-aware
    originalContent: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // 1. Fetch user's entities (memory)
      // Assuming getEntities is modified or a new internal query is made to accept userId if needed
      // For now, api.entities.getEntities will use the auth context of the action, which is null.
      // This needs to be an internal query that accepts userId.
      const entities = await ctx.runQuery(internal.entities.getEntitiesForUser, { userId: args.userId });
      const entityNames = entities.map(e => e.name).join(", ");

      // Fetch the latest system prompt
      const latestPrompt = await ctx.runQuery(api.prompts.getPrompts);
      const systemPrompt = latestPrompt[0]?.promptText ?? "You are a helpful assistant."; // Default prompt

      // 2. Construct a prompt for the AI
      const userMessage = `
User's thought: "${args.originalContent}"
User's memory (entities): ${entityNames || "No entities defined yet."}
`;

      // 3. Call OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ],
        max_tokens: 150,
      });

      const enrichedContent = response.choices[0].message.content?.trim() ?? "Could not enrich thought.";

      // 4. Update the thought with the enriched content
      await ctx.runMutation(internal.thoughts.updateThoughtWithEnrichment, { // Corrected path
        thoughtId: args.thoughtId,
        enrichedContent: enrichedContent,
        processing: false,
      });
    } catch (error) {
      console.error("Error enriching thought:", error);
      await ctx.runMutation(internal.thoughts.updateThoughtWithEnrichment, { // Corrected path
        thoughtId: args.thoughtId,
        enrichedContent: "Error during enrichment.",
        processing: false,
      });
    }
    return null;
  },
});

// updateThoughtWithEnrichment was moved to thoughts.ts

export const rerunAllThoughts = internalAction({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const thoughts = await ctx.runQuery(api.thoughts.getThoughts);
    for (const thought of thoughts) {
      await ctx.runAction(internal.agent.enrichThought, {
        thoughtId: thought._id,
        userId: args.userId,
        originalContent: thought.originalContent,
      });
    }
  },
});
