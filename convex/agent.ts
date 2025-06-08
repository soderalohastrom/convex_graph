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

      // 2. Construct a prompt for the AI
      const prompt = `
User's thought: "${args.originalContent}"

User's memory (entities): ${entityNames || "No entities defined yet."}

Based on the user's thought and their memory, enrich the thought.
Identify key entities mentioned or implied in the thought.
If entities from memory are relevant, briefly incorporate information about them.
If new entities are mentioned, acknowledge them.
Keep the enriched thought concise and preserve the original meaning.
Do not repeat the original thought verbatim in your enrichment. Focus on adding context or connections.
For example, if the thought is "Thinking about my trip to Paris" and "Paris" is in memory as "Capital of France, known for Eiffel Tower",
an enrichment could be: "Recalling the trip to Paris, the city of lights and the iconic Eiffel Tower."
If the thought is "My dog Max is playful" and "Max" is in memory as "Golden Retriever, loves fetch",
an enrichment could be: "Max, the energetic Golden Retriever who loves playing fetch, is certainly playful."

Enriched thought:`;

      // 3. Call OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
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
