# AI Memory Agent & Prompt Playground

This project is a Convex-based application designed as a proof-of-concept and testing ground for AI-powered thought augmentation and categorization. It allows users to input raw thoughts, which are then "enriched" by an AI agent that leverages a user-specific memory graph. The core focus is on refining the AI's system prompts to achieve nuanced and contextually-aware responses.

The application uses a Hawaiian metaphorical framework for categorizing thoughts:
- 🌋 **Mauka (Visionary):** Red to Orange
- 🌱 **Kula (Practical):** Green to Emerald
- 🌊 **Makai (Emotional):** Blue to Cyan
- 🌫️ **Kapu (Sacred):** Purple to Indigo

A key feature goal is a split-screen interface allowing for real-time editing and testing of the AI's system prompt.

## Tech Stack

- **Backend:** [Convex](https://convex.dev)
- **Frontend:** [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI:** [OpenAI](https://openai.com/)
- **Authentication:** [Convex Auth](https://auth.convex.dev/)

## Project Structure

- `src/`: Contains the React frontend code.
- `convex/`: Contains the Convex backend functions and schema.
- `memory-bank/`: Contains documentation, including this PRD, to maintain project context.
- `docs/`: Contains supplementary documentation and vision statements for the parent "Hui Hui Mana'o" project.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Convex and OpenAI API keys:
    ```
    CONVEX_DEPLOYMENT=...
    VITE_CONVEX_URL=...
    CONVEX_OPENAI_BASE_URL=...
    CONVEX_OPENAI_API_KEY=...
    ```

3.  **Run the Development Servers:**
    This command will start both the frontend (Vite) and backend (Convex) servers.
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.
