# PRD: Phase 2 - The Interactive Memory Loop

## 1. Introduction/Overview

This document outlines the requirements for Phase 2 of the AI Memory Agent application. This phase evolves the application from a static prompt-testing playground into a dynamic, interactive system that actively collaborates with the user to build a rich and accurate memory graph. The core focus is on creating a feedback loop where the AI can suggest new memories and the user can easily confirm or clarify them, thus moving away from purely manual memory entry. This phase also introduces a structured onboarding process to seed the initial memory graph.

## 2. Goals

- To transition the primary mechanism of memory growth from manual user entry to an AI-assisted, interactive process.
- To implement a user-friendly clarification system that allows the AI to resolve ambiguities and learn new entities with user validation.
- To create a "gamified" onboarding experience that populates a foundational memory graph for new users.
- To enhance the backend to support the storage and management of "potential" or "pending" memories suggested by the AI.
- To increase the accuracy and richness of the user's memory graph over time through continuous, low-friction interaction.

## 3. User Stories

- **As a User,** I want the application to automatically identify potential new people, places, or projects from my thoughts so that I don't have to enter them all manually.
- **As a User,** when the AI is unsure about a new entity it has found, I want it to ask me for clarification via a simple pop-up so I can quickly confirm or correct its understanding.
- **As a New User,** I want to be guided through a quick and engaging setup process that asks me about key aspects of my life so that the AI has a baseline understanding of me from the start.
- **As a User,** I want to see the AI's understanding of my world grow more accurate and detailed as I use the app more, without it feeling like a chore.

## 4. Functional Requirements

### 4.1. AI-Powered Entity & Relationship Extraction
1.  **Secondary AI Action:** After the initial thought enrichment is complete, a new, internal-only AI action shall be triggered.
2.  **Analysis of Original Thought:** This action will analyze the user's *original, raw thought* to identify potential new entities and relationships.
3.  **Structured Extraction:** The AI should be prompted to extract information in a structured format, such as `(Subject, Predicate, Object)` triplets or a simple JSON object describing the potential new entity.
4.  **Confidence Scoring:** The AI's response should include a confidence score (0-1) for each potential memory it identifies.
5.  **Pending Memories Table:**
    - A new table, `potential_memories`, will be added to the `convex/schema.ts`.
    - This table will store the AI's suggestions, including the extracted text, the suggested entity type, the confidence score, and a status field (e.g., "pending", "confirmed", "rejected").

### 4.2. User-Assisted Memory Confirmation
1.  **Clarification Trigger:** If a potential memory is identified with a confidence score below a defined threshold (e.g., 0.75), a clarification request is triggered on the frontend.
2.  **Non-Intrusive UI Notification:** A small, dismissible notification or pop-up will appear in the UI.
    - **Example Text:** "I noticed you mentioned 'Greg'. Is this the 'Greg' from work, or someone new?"
3.  **User Actions:** The notification will provide simple actions:
    - `[Confirm]`: If the user confirms, the potential memory's status is updated to "confirmed" and it is moved from `potential_memories` to the main `entities` table.
    - `[Clarify/Correct]`: This will open a simple modal allowing the user to edit the suggested entity name or description before it is saved to the `entities` table.
    - `[Ignore/Dismiss]`: The notification is dismissed, and the potential memory's status might be updated to "rejected".

### 4.3. Gamified Onboarding Questionnaire
1.  **Trigger for New Users:** The onboarding flow will be triggered the first time a user logs in and has an empty `entities` table.
2.  **UI Presentation:**
    - The onboarding process will be presented as a modal or a dedicated page titled "Calibrating Your AI Companion".
    - A progress bar will be displayed to encourage completion.
3.  **Questionnaire Content:** The questionnaire will consist of a few simple, open-ended questions to seed the memory graph:
    - "Who are 3-5 key people in your life (e.g., 'Steve - My Manager')?"
    - "What are 1-3 important places (e.g., 'Home Office', 'Downtown Cafe')?"
    - "What are 1-3 major projects or goals you're focused on right now?"
4.  **Backend Logic:** Each answer submitted by the user will trigger a mutation that creates a new, confirmed entry in the `entities` table.

## 5. Non-Goals (Out of Scope)

- Fully automated memory consolidation and proactive insight generation (this is reserved for Phase 3).
- Complex relationship graph visualization.
- The ability for the AI to ask complex, multi-turn clarification questions. The interaction should be simple and single-response.

## 6. Design Considerations

- The clarification pop-up must be non-blocking and easy to dismiss to avoid interrupting the user's flow.
- The onboarding questionnaire should feel light and engaging, not like a tedious form.
- The UI should clearly distinguish between confirmed memories and AI-suggested potential memories if they are ever displayed.

## 7. Technical Considerations

- The `convex/schema.ts` will need to be updated with the `potential_memories` table.
- New Convex actions and mutations will be required for the entity extraction and confirmation workflow.
- Frontend state management will need to handle the presentation and dismissal of clarification notifications.
- The onboarding flow will require a new frontend component and associated backend logic.

## 8. Success Metrics

- A measurable increase in the number of entities in a user's memory graph over time, with a significant portion originating from AI suggestions.
- High completion rate (>80%) for the onboarding questionnaire.
- Positive user feedback regarding the ease and usefulness of the clarification feature.
- A reduction in the need for purely manual entity entry by the user.