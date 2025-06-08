# PRD: Thought Augmentation & Prompt Playground

## 1. Introduction/Overview

This document outlines the requirements for the "Thought Augmentation & Prompt Playground," a proof-of-concept application built with Convex and React. The primary purpose of this tool is to provide a development environment for testing, refining, and iterating on AI system prompts. The application focuses on augmenting raw user thoughts with contextual "memories" (entities) and categorizing them according to a Hawaiian metaphorical framework. The user interface should be functional and facilitate rapid prompt engineering, with aesthetic appeal being a low priority.

## 2. Goals

- To create a stable platform for testing AI-driven thought enrichment and categorization.
- To implement a user interface that allows for real-time editing and testing of the AI's system prompt.
- To validate the effectiveness of the Hawaiian-themed categorization model (Mauka, Kula, Makai, Kapu).
- To establish a workflow for saving and comparing different versions of system prompts to measure their impact on AI-generated output.

## 3. User Stories

- **As a Prompt Engineer,** I want to enter a raw thought so that I can see how the AI agent enriches and categorizes it.
- **As a Prompt Engineer,** I want to manage a list of "memories" (entities) so that I can provide the AI with context to use during thought enrichment.
- **As a Prompt Engineer,** I want to see the raw thought and the AI-enriched thought side-by-side to easily compare them.
- **As a Prompt Engineer,** I want to view and edit the current system prompt in a text editor directly within the application.
- **As a Prompt Engineer,** I want to save my changes to the system prompt and trigger a re-processing of all existing thoughts so that I can immediately see the impact of my changes.
- **As a Prompt Engineer,** I want to access previous versions of the system prompt so that I can compare results and revert to a prior version if needed.
## 4. Functional Requirements

### 4.1. Existing Functionality
1.  **Authentication:** The system must support user sign-in to ensure thoughts and entities are tied to a specific user.
2.  **Entity Management:** The system must allow users to Create, Read, and Delete entities (memories), which consist of a name, type, and description.
3.  **Thought Management:** The system must allow users to submit new thoughts.
4.  **Thought Enrichment:** Upon submission, the system must send the thought, along with the user's entities, to an AI agent for enrichment.
5.  **Thought Feed:** The system must display a feed of thoughts, showing both the original content and the AI-enriched content.

### 4.2. New Core Feature: Prompt Engineering UI
1.  **Split-Screen Layout:** The main interface will be divided into two panels:
    - **Left Panel:** Displays the "My Thoughts Feed."
    - **Right Panel:** Contains the "System Prompt Editor."
2.  **System Prompt Editor:**
    - A text area will display the current system prompt used by the AI agent.
    - Users must be able to freely edit the content of the system prompt within this text area.
3.  **Save & Rerun Functionality:**
    - A "Save & Rerun" button will be present in the editor panel.
    - Clicking this button will:
        a. Save the current text in the editor as the new active system prompt.
        b. Trigger a background process to re-run the enrichment process for all existing thoughts in the feed using the new prompt.
        c. The thought feed on the left should update in real-time as thoughts are re-processed.
4.  **Prompt Versioning:**
    - Each time "Save & Rerun" is clicked, the system shall save a new, timestamped version of the system prompt.
    - The UI must provide a mechanism (e.g., a dropdown list) to view and select a previous version of the prompt, loading it back into the editor.

### 4.3. AI & Categorization
1.  **Hawaiian Categorization:** The AI enrichment process must include categorizing the thought into one of the four Hawaiian zones: Mauka, Kula, Makai, or Kapu.
2.  **Color Themes:** The UI should reflect the assigned category using the specified color themes.

## 5. Non-Goals (Out of Scope)

- A highly polished, production-ready user interface. Functionality is the priority.
- Advanced user profile management or settings.
- Collaborative features or sharing of thoughts/prompts.
- Mobile-specific optimization (desktop browser is the primary target).

## 6. Design Considerations

- The UI should be clean and functional, prioritizing the split-screen view for the prompt engineering workflow.
- The existing UI components for the thought feed and entity management can be reused.
- Visual feedback (e.g., loading spinners) is required during thought processing and re-processing.

## 7. Technical Considerations

- The backend will continue to be managed by Convex.
- The frontend will be built in React.
- State management must handle real-time updates to the thought feed as they are re-processed.
- A new data model in `convex/schema.ts` will be required to store the versioned system prompts.

## 8. Success Metrics

- The user can successfully edit, save, and re-run a system prompt against their thoughts.
- The impact of prompt changes is clearly visible in the updated enriched content in the thought feed.
- The user can easily switch between different saved versions of a system prompt.

## 9. Open Questions

- What should the default "initial" system prompt be? In this case we have our intial prompt, but in the future perhaps this will need to be seeded by the user initially.
- How should the UI for selecting prompt versions be presented? (e.g., dropdown with timestamps, list with previews).