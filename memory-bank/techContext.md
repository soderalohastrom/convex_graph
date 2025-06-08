# Technical Context

## Technologies Used
- **Frontend**: React 19, Vite 6, TypeScript 5.7
- **Styling**: Tailwind CSS 3
- **Backend**: Convex 1.21
- **Authentication**: Convex Auth
- **AI Integration**: OpenAI API
- **Build Tools**: npm, Vite

## Development Setup
1. Create a new Convex project:
   ```bash
   npx convex dev
   ```
   This will prompt you to create a new project and generate credentials

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The `npx convex dev` command will create/update `.env.local`
   - Add your OpenAI API key if using enrichment features:
     ```env
     OPENAI_API_KEY=your-api-key
     ```

4. Start development servers:
   ```bash
   npm run dev
   ```

## Technical Constraints
- Requires Node.js v18+
- Convex backend must be running locally or connected to cloud deployment
- OpenAI API key needed for thought enrichment features
- Strict TypeScript type checking enforced

## Key Dependencies
- `convex`: Backend-as-a-service
- `@convex-dev/auth`: Authentication library
- `openai`: OpenAI API client
- `react`/`react-dom`: Frontend framework
- `tailwindcss`: CSS framework

## Tool Usage Patterns
- `npm run dev`: Starts both frontend and backend
- `npx convex dev`: Starts Convex development server
- `npm run lint`: Runs TypeScript and ESLint checks
- `vite build`: Creates production build