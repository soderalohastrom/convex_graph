import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc } from "../convex/_generated/dataModel";

export default function PromptEditor() {
  const prompts: Doc<"prompts">[] = useQuery(api.prompts.getPrompts) || [];
  const savePrompt = useMutation(api.prompts.savePrompt);
  const ensurePrompt = useMutation(api.prompts.ensureInitialPrompt);
  const [promptText, setPromptText] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("latest");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    ensurePrompt();
  }, [ensurePrompt]);

  useEffect(() => {
    if (prompts.length > 0) {
      setPromptText(prompts[0].promptText);
      setSelectedVersion(prompts[0].version.toString());
    }
  }, [prompts]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePrompt({ promptText });
      toast.success("Prompt saved and thoughts are being re-processed!");
    } catch (error) {
      toast.error("Failed to save prompt.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const version = e.target.value;
    setSelectedVersion(version);
    if (version === "latest" && prompts.length > 0) {
      setPromptText(prompts[0].promptText);
    } else {
      const selectedPrompt = prompts.find(
        (p) => p.version.toString() === version,
      );
      if (selectedPrompt) {
        setPromptText(selectedPrompt.promptText);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">
        System Prompt Editor
      </h2>
      <div className="mb-4">
        <label
          htmlFor="version-select"
          className="block text-sm font-medium text-slate-700"
        >
          Prompt Version
        </label>
        <select
          id="version-select"
          value={selectedVersion}
          onChange={handleVersionChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {prompts.map((p: Doc<"prompts">) => (
            <option key={p._id} value={p.version.toString()}>
              Version {p.version} ({new Date(p._creationTime).toLocaleString()})
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        className="flex-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter your system prompt here..."
      />

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
      >
        {isSaving ? "Saving..." : "Save & Rerun"}
      </button>
    </div>
  );
}
