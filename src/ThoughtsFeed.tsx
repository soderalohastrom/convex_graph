import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ThoughtsFeed() {
  const thoughts = useQuery(api.thoughts.getThoughts) || [];
  const addThought = useMutation(api.thoughts.addThought);
  const [newThought, setNewThought] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) {
      toast.error("Thought cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addThought({ originalContent: newThought });
      toast.success("Thought added and sent for enrichment!");
      setNewThought("");
    } catch (error) {
      toast.error("Failed to add thought.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" data-oid="9gs00t6">
      <div data-oid="2qgokyb">
        <h2
          className="text-2xl font-semibold text-slate-800 mb-4"
          data-oid="15xumfu"
        >
          Add New Thought
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 bg-slate-50 rounded-lg shadow"
          data-oid="okn1l4e"
        >
          <div data-oid="kh7t_gy">
            <label
              htmlFor="thought"
              className="block text-sm font-medium text-slate-700"
              data-oid="2fhny44"
            >
              Your Thought
            </label>
            <textarea
              id="thought"
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              placeholder="What's on your mind? E.g., Planning my trip to Paris next month."
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isSubmitting}
              data-oid="i2syaza"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newThought.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            data-oid="wsgf3b0"
          >
            {isSubmitting ? "Adding..." : "Add Thought & Enrich"}
          </button>
        </form>
      </div>

      <div data-oid="ts0whho">
        <h2
          className="text-2xl font-semibold text-slate-800 mb-4"
          data-oid="y_kqjgf"
        >
          My Thoughts Feed
        </h2>
        {thoughts.length === 0 ? (
          <p className="text-slate-600" data-oid="pbtufx6">
            You haven't added any thoughts yet. Use the form above to share
            what's on your mind!
          </p>
        ) : (
          <ul className="space-y-4" data-oid="q:lsvej">
            {thoughts.map((thought) => (
              <li
                key={thought._id}
                className="p-4 bg-white rounded-lg shadow"
                data-oid="nvp27e1"
              >
                <div className="mb-2" data-oid="ui70csf">
                  <p className="text-sm text-slate-500" data-oid="h0jxjcr">
                    Original Thought:
                  </p>
                  <p className="text-slate-700" data-oid=":g64o9t">
                    {thought.originalContent}
                  </p>
                </div>
                <div data-oid="5nvyo5e">
                  <p className="text-sm text-slate-500" data-oid="t_o904l">
                    Enriched by AI Agent:
                  </p>
                  {thought.processing ? (
                    <div
                      className="flex items-center text-sm text-indigo-600"
                      data-oid="8rq7:4d"
                    >
                      <div
                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"
                        data-oid="ca8mtlw"
                      ></div>
                      Enriching...
                    </div>
                  ) : thought.enrichedContent ? (
                    <p
                      className="text-indigo-700 font-medium"
                      data-oid="lb.1nen"
                    >
                      {thought.enrichedContent}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic" data-oid="e:0sxm4">
                      No enrichment available yet.
                    </p>
                  )}
                </div>
                <p
                  className="text-xs text-slate-400 mt-2 text-right"
                  data-oid=":y0jry9"
                >
                  Added: {new Date(thought._creationTime).toLocaleDateString()}{" "}
                  {new Date(thought._creationTime).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
