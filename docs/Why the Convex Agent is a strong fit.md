# Why the Convex Agent is a strong fit

- **Automatic persistence & indexing.** Every time you call `createThread` or `generateText`, the component stores the message, generates an embedding, and tags it with `userId`/`threadId` so you can retrieve it later — no schema work required.([Stack by Convex](https://stack.convex.dev/ai-agents), [GitHub](https://github.com/get-convex/agent))
- **Built-in hybrid search (RAG).** You can opt-in to full-text and/or vector search and control how many context messages are injected, so the LLM can recall facts like “Steve is my coworker” across sessions.([Stack by Convex](https://stack.convex.dev/ai-agents), [GitHub](https://github.com/get-convex/agent))
- **Per-user cross-thread memory.** Flip `searchOtherThreads: true` and the agent will look across *all* of that user’s past conversations, not just the active one.([GitHub](https://github.com/get-convex/agent))
- **Durable, reactive workflows.** Because the Agent integrates with Convex Workflows, long-running tasks survive restarts and emit realtime progress to the frontend.([Stack by Convex](https://stack.convex.dev/ai-agents), [Convex Developer Hub](https://docs.convex.dev/agents?utm_source=chatgpt.com))
- **Single backend stack.** Everything—messages, embeddings, tools, workflows—lives in your Convex project, so deployment, auth, and scaling stay in one place.

## Architectural snapshot

### 1. Data model

The component installs its own tables (`threads`, `messages`, `vector_index`) inside a **Convex Component sandbox**, meaning it can’t touch your existing tables unless you call into them.([GitHub](https://github.com/get-convex/agent), [Convex Developer Hub](https://docs.convex.dev/components?utm_source=chatgpt.com))

### 2. Agent definition

```other
const supportAgent = new Agent(components.agent, {
  chat: openai.chat("gpt-4o-mini"),
  textEmbedding: openai.embedding("text-embedding-3-small"),
  instructions: "You are a helpful assistant.",
  tools: { accountLookup, fileTicket, sendEmail },
});
```

You can expose the same agent as *actions* (for synchronous calls) or as a *workflow* step for long-running jobs.([GitHub](https://github.com/get-convex/agent))

### 3. Memory retrieval

For each `generateText` call you can tune:

- `recentMessages` – how many of the last N turns to include.
- `searchOptions` – vector vs text, limit, and surrounding `messageRange`.
- `searchOtherThreads` – whether to scan the user’s entire history.([GitHub](https://github.com/get-convex/agent))

Because embeddings are regenerated asynchronously after the message is stored, latency stays low.([Stack by Convex](https://stack.convex.dev/ai-agents))

### 4. Tool calling & functions

`createTool` wraps the Vercel AI SDK so your Convex functions become first-class tools the LLM can invoke (with `ctx.runQuery`, `runMutation`, etc.). Tools automatically capture metadata—`userId`, `threadId`, `messageId`—for auditing and further memory writes.([GitHub](https://github.com/get-convex/agent))

### 5. Durable execution

Wrapping agent calls in a `WorkflowManager` grants retry semantics, back-offs, and persistence across deployment restarts, so multi-agent chains finish eventually even if an LLM call fails.([Stack by Convex](https://stack.convex.dev/ai-agents), [GitHub](https://github.com/get-convex/agent))

## Implementation plan

| **Step**                              | **Action**                                                                                                                                                                                   | **Key pointers**                                                                                                                    |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **1. Bootstrap Convex project**       | `npm create convex` → commit project / deploy.                                                                                                                                               | Uses Convex’s hosted DB & serverless functions.                                                                                     |
| **2. Install component**              | `npm i @convex-dev/agent` and add `app.use(agent)` in `convex/convex.config.ts`.                                                                                                             | Component installs schema & indexes automatically.([GitHub](https://github.com/get-convex/agent))                                   |
| **3. Define your agent(s)**           | Start with a single agent (`supportAgent`) and an embedding model (e.g., `text-embedding-3-small`).                                                                                          | Keep `instructions` concise (<300 words) for prompt economy.                                                                        |
| **4. Wire up login → userId**         | Reuse your auth flow to attach `userId` when you call `createThread`/`continueThread`.                                                                                                       | Needed for per-user memory search.                                                                                                  |
| **5. Persist preferences explicitly** | When the user sets or updates a preference (“My favorite color is teal”), save it as a bot-authored **assistant** message to ensure it’s indexed.                                            | This guarantees the memory survives model updates.                                                                                  |
| **6. Tune contextOptions**            | Start with `recentMessages: 10`, `searchOptions.limit: 10`, `vectorSearch: true`. Adjust based on prompt-token budget.                                                                       | Keep prompts <8 k tokens to stay in GPT-4o-mini context.                                                                            |
| **7. Add Convex tools**               | Wrap domain logic (e.g., `getUserProfile`, `saveNote`) with `createTool`. Register tools at agent level or per-call.                                                                         | Tools can read/write tables and will be logged in message history if `includeToolCalls` is true.                                    |
| **8. Build durable flows**            | Use `WorkflowManager` for multi-step sequences (e.g., summarizing a month of chats into a “profile digest”).                                                                                 | Convex automatically retries failed steps and emits progress via `useQuery`.([Stack by Convex](https://stack.convex.dev/ai-agents)) |
| **9. Monitor usage**                  | Provide a `usageHandler` to log token counts per user for billing or rate-limiting.                                                                                                          | Example in README shows how to persist to a `usage` table.([GitHub](https://github.com/get-convex/agent))                           |
| **10. Evaluate & iterate**            | Run conversations, inspect stored messages and embeddings, tweak `searchOptions` and `instructions`. Consider weekly scheduled workflows to prune or re-embed messages if you change models. |                                                                                                                                     |

## Longer-term considerations

- **Scaling memory size.** The vector index can grow quickly. Periodically summarize old threads or archive them to cold storage; the agent already exposes helpers to regenerate or delete embeddings.([GitHub](https://github.com/get-convex/agent))
- **Context quality.** If irrelevant memories creep in, tighten search filters (`recentMessages` first, then `vectorSearch` threshold) or add metadata tags (e.g., `workspace: "office"`).
- **Offline migration path.** Because everything is stored in Convex tables, you can export/transform data if you later move to a custom memory layer.

With this setup you avoid running (and paying for) a separate memory service, keep all data inside your own Convex project, and still gain the RAG-style recall you need for statements like “Steve made me mad again.” As Convex extends the Agent component (per-user usage limits, virtual file system, nested agents, etc.) you can adopt those features incrementally without rewriting your backend.([Stack by Convex](https://stack.convex.dev/ai-agents))

---

