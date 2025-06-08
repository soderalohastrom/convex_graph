import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import EntitiesPage from "./EntitiesPage";
import ThoughtsFeed from "./ThoughtsFeed";

type Page = "thoughts" | "entities";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50" data-oid="mw22f_q">
      <header
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b"
        data-oid="2seigg-"
      >
        <h2 className="text-xl font-semibold accent-text" data-oid="vz-j-wg">
          AI Memory Agent
        </h2>
        <SignOutButton data-oid="3vdyox6" />
      </header>
      <main
        className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8"
        data-oid="cv56zbs"
      >
        <div className="w-full max-w-2xl mx-auto" data-oid="so8gk5u">
          <Content data-oid="airzfyd" />
        </div>
      </main>
      <Toaster data-oid="w6qg0:f" />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [currentPage, setCurrentPage] = useState<Page>("thoughts");

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-64" data-oid="6cjsc2z">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"
          data-oid="3avmuk0"
        ></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8" data-oid="txb2bv7">
      <Unauthenticated data-oid="0byxuqe">
        <div
          className="text-center p-8 bg-white shadow-lg rounded-lg"
          data-oid="aud0xq_"
        >
          <h1
            className="text-4xl sm:text-5xl font-bold accent-text mb-4"
            data-oid="l60squm"
          >
            Convex Memory Agent
          </h1>
          <p className="text-xl text-slate-600" data-oid="hshq82x">
            Sign in to get started
          </p>
          <div className="mt-6" data-oid="mkfp6qr">
            <SignInForm data-oid="jdqbzwa" />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated data-oid="fnns2sb">
        <div className="bg-white shadow-lg rounded-lg p-6" data-oid="0hrg0s_">
          <div className="mb-6 text-center" data-oid="iwaqejz">
            <p className="text-xl text-slate-700" data-oid="_oy8nn7">
              Welcome back,{" "}
              <span className="font-semibold accent-text" data-oid="mb6zzrm">
                {loggedInUser?.name ?? loggedInUser?.email ?? "friend"}
              </span>
              !
            </p>
          </div>

          <nav
            className="mb-8 flex justify-center gap-4 border-b pb-4"
            data-oid="l46q77d"
          >
            <button
              onClick={() => setCurrentPage("thoughts")}
              className={`px-4 py-2 rounded-md font-medium transition-colors
                ${currentPage === "thoughts" ? "bg-indigo-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              data-oid="53a3szc"
            >
              My Thoughts
            </button>
            <button
              onClick={() => setCurrentPage("entities")}
              className={`px-4 py-2 rounded-md font-medium transition-colors
                ${currentPage === "entities" ? "bg-indigo-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              data-oid="hjruoq5"
            >
              My Memory (Entities)
            </button>
          </nav>

          {currentPage === "thoughts" && <ThoughtsFeed data-oid="70jdm__" />}
          {currentPage === "entities" && <EntitiesPage data-oid="vgd6spt" />}
        </div>
      </Authenticated>
    </div>
  );
}
