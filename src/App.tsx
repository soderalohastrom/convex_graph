import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import EntitiesPage from "./EntitiesPage";
import ThoughtsFeed from "./ThoughtsFeed";
import PromptEditor from "./PromptEditor";

type Page = "thoughts" | "entities";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">AI Memory Agent</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [currentPage, setCurrentPage] = useState<Page>("thoughts");

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Unauthenticated>
        <div className="text-center p-8 shadow-lg rounded-lg bg-[#ECDFDF]">
          <h1 className="text-4xl sm:text-5xl font-bold accent-text mb-4">
            Convex Memory Agent
          </h1>
          <p className="text-xl text-slate-600">
            ssoderstrom@gmail.com - Cr@nberry1!
          </p>
          <div className="mt-6">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6 text-center">
            <p className="text-xl text-slate-700">
              Welcome back,{" "}
              <span className="font-semibold accent-text">
                {loggedInUser?.name ?? loggedInUser?.email ?? "friend"}
              </span>
              !
            </p>
          </div>

          <nav className="mb-8 flex justify-center gap-4 border-b pb-4">
            <button
              onClick={() => setCurrentPage("thoughts")}
              className={`px-4 py-2 rounded-md font-medium transition-colors
                ${currentPage === "thoughts" ? "bg-indigo-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
            >
              My Thoughts
            </button>
            <button
              onClick={() => setCurrentPage("entities")}
              className={`px-4 py-2 rounded-md font-medium transition-colors
                ${currentPage === "entities" ? "bg-indigo-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
            >
              My Memory (Entities)
            </button>
          </nav>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              {currentPage === "thoughts" && <ThoughtsFeed />}
              {currentPage === "entities" && <EntitiesPage />}
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
              <PromptEditor />
            </div>
          </div>
        </div>
      </Authenticated>
    </div>
  );
}
