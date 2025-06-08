# Onboarding PoC Reference: `profile_onboarder`

## 1. Overview

This document serves as an analysis of the `profile_onboarder` proof-of-concept application and outlines how its architecture and learnings will inform the "Gamified Onboarding Questionnaire" feature specified in `prd-phase2-interactive-memory-loop.md`.

The `profile_onboarder` project is a standalone Convex/React application that demonstrates a highly effective, gamified, and modular questionnaire system. Its primary purpose is to serve as a reusable component library for collecting user profile data.

## 2. Key Architectural Learnings & Patterns to Adopt

The `profile_onboarder` provides a robust and validated template for our Phase 2 onboarding feature. The following patterns should be directly adopted:

- **Client-Side State Management:** The use of React's `useReducer` and `useContext` (`ProfileContext.tsx`) is a lightweight and effective way to manage the questionnaire's state (current question, answers, progress) without requiring constant backend communication. We will replicate this pattern.

- **Modular Component Structure:** The separation of concerns within the `src/profileGenerator/` directory is excellent. We will adopt a similar structure:
    - `Questionnaire.tsx`: The main component that orchestrates the onboarding flow.
    - `QuestionCard.tsx`: A component responsible for rendering a single question, adaptable to different types (slider, multiple-choice, etc.).
    - `ProgressBar.tsx`: A visual component to show progress and allow navigation between categories.
    - `questions.ts`: A configuration file to define the questions, categories, and types, making it easy to modify the content of our onboarding flow.

- **Gamification Hook:** The concept of unlocking a reward (e.g., "Spirit Animal") upon reaching a certain completion percentage (e.g., 85%) is a proven engagement strategy. We will incorporate a similar gamified reward to incentivize users to complete the initial memory seeding.

- **Data Structure for Backend Submission:** The `profile_onboarder` collects all answers into a single `answers` object within its state. When the questionnaire is complete, this entire object can be sent to our backend in a single mutation. This is the pattern we will use to populate the `entities` table for a new user.

## 3. Integration Strategy for Phase 2

When implementing the "Gamified Onboarding Questionnaire" for the AI Memory Agent, we will not need to design the frontend flow from scratch. Instead, we will:

1.  **Copy & Adapt:** Copy the `src/profileGenerator/` directory from the `profile_onboarder` project into our `convex_graph` project.
2.  **Customize Content:** Modify the `questions.ts` file to ask questions relevant to seeding our memory graph (e.g., "Who are key people in your life?", "What are your main projects?").
3.  **Implement Backend Mutation:** Create a new Convex mutation, `seedInitialMemories`, that accepts the final `answers` object from the questionnaire. This mutation will then iterate through the answers and create multiple entries in the `entities` table, establishing the user's foundational memory graph.

By leveraging the `profile_onboarder` as a reference implementation, we can significantly accelerate the development of the Phase 2 onboarding feature and build upon a proven, engaging user experience pattern.