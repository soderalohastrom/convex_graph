## Relevant Files

- `convex/schema.ts` - To be modified to include a new table for system prompt versions.
- `src/App.tsx` - To be modified to implement the new split-screen layout.
- `src/PromptEditor.tsx` - New component for the system prompt editor.
- `convex/prompts.ts` - New file for backend functions related to managing system prompts.
- `convex/agent.ts` - To be modified to use the versioned system prompts.

### Notes

- Unit tests should be created for new components and backend functions.
- Use `npx convex dev` to run the backend and `npm run dev:frontend` for the frontend.

## Tasks

## Tasks

- [x] 1.0 Backend: Implement System Prompt Versioning
  - [x] 1.1 Modify `convex/schema.ts` to add a `prompts` table with fields for `promptText`, `version`, and `creationTime`.
  - [x] 1.2 Add an index to the `prompts` table for efficient querying by version or creation time.
- [x] 2.0 Frontend: Create Split-Screen UI and Prompt Editor
  - [x] 2.1 Modify `src/App.tsx` to implement a two-panel, split-screen layout.
  - [x] 2.2 Create a new component `src/PromptEditor.tsx` that contains a textarea for prompt editing.
  - [x] 2.3 Add a "Save & Rerun" button and a dropdown for version selection to the `PromptEditor` component.
- [x] 3.0 Backend: Implement Prompt Management Logic
  - [x] 3.1 Create a new file `convex/prompts.ts`.
  - [x] 3.2 Implement a `savePrompt` mutation that creates a new version of the system prompt.
  - [x] 3.3 Implement a `getPrompts` query to fetch all saved prompt versions.
  - [x] 3.4 Implement a `getPromptByVersion` query to fetch a specific version.
- [x] 4.0 Frontend: Wire up Prompt Editor to Backend
  - [x] 4.1 In `src/PromptEditor.tsx`, use the `useQuery` hook to fetch and display the latest system prompt.
  - [x] 4.2 Implement the `onClick` handler for the "Save & Rerun" button to call the `savePrompt` mutation.
  - [x] 4.3 Populate the version selection dropdown with the results from the `getPrompts` query.
- [x] 5.0 Backend: Modify Enrichment Process to Use Active Prompt
  - [x] 5.1 Modify the `enrichThought` internal action in `convex/agent.ts`.
  - [x] 5.2 Before calling OpenAI, fetch the currently active system prompt from the `prompts` table.
  - [x] 5.3 Inject the fetched system prompt into the `messages` array sent to the OpenAI API.
  - [x] 5.4 Create a new internal action `rerunAllThoughts` that iterates through all user thoughts and calls `enrichThought` for each one.
  - [x] 5.5 The `savePrompt` mutation should trigger the `rerunAllThoughts` action.