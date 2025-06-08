import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";

export default function EntitiesPage() {
  const entities = useQuery(api.entities.getEntities) || [];
  const addEntity = useMutation(api.entities.addEntity);
  const deleteEntity = useMutation(api.entities.deleteEntity);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !type || !description) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await addEntity({ name, type, description });
      toast.success(`Entity "${name}" added successfully!`);
      setName("");
      setType("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to add entity.");
      console.error(error);
    }
  };

  const handleDelete = async (entityId: Id<"entities">, entityName: string) => {
    if (
      confirm(`Are you sure you want to delete the entity "${entityName}"?`)
    ) {
      try {
        await deleteEntity({ entityId });
        toast.success(`Entity "${entityName}" deleted.`);
      } catch (error) {
        toast.error("Failed to delete entity.");
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8" data-oid="uly59pl">
      <div data-oid=":16tpl8">
        <h2
          className="text-2xl font-semibold text-slate-800 mb-4"
          data-oid="zwzoy6y"
        >
          Add New Memory (Entity)
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 bg-slate-50 rounded-lg shadow"
          data-oid="il9ej9p"
        >
          <div data-oid="hykrpm.">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
              data-oid="2demql1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Max, Paris, My Car"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              data-oid="i2ztiw5"
            />
          </div>
          <div data-oid="s29n6av">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-slate-700"
              data-oid="vwaazjc"
            >
              Type
            </label>
            <input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="E.g., Pet, City, Object"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              data-oid="aav614w"
            />
          </div>
          <div data-oid="03jycl5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
              data-oid="w-o6qs5"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., My golden retriever, Capital of France, 2021 Honda Civic"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              data-oid="47nvjz7"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            data-oid="dfs.fod"
          >
            Add Entity
          </button>
        </form>
      </div>

      <div data-oid="z.u-y0t">
        <h2
          className="text-2xl font-semibold text-slate-800 mb-4"
          data-oid="53m:a1n"
        >
          My Memories
        </h2>
        {entities.length === 0 ? (
          <p className="text-slate-600" data-oid="8_2w.a8">
            You haven't added any memories yet. Use the form above to add some!
          </p>
        ) : (
          <ul className="space-y-3" data-oid="mlkv:ow">
            {entities.map((entity) => (
              <li
                key={entity._id}
                className="p-4 bg-white rounded-lg shadow flex justify-between items-start"
                data-oid="ovmjruc"
              >
                <div data-oid="6xri3js">
                  <h3
                    className="text-lg font-semibold text-indigo-700"
                    data-oid="u160bvy"
                  >
                    {entity.name}{" "}
                    <span
                      className="text-sm text-slate-500 font-normal"
                      data-oid="b80y2b3"
                    >
                      ({entity.type})
                    </span>
                  </h3>
                  <p className="text-slate-600" data-oid="6ujpyw0">
                    {entity.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-1" data-oid="ual:71c">
                    Added: {new Date(entity._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(entity._id, entity.name)}
                  className="ml-4 text-red-500 hover:text-red-700 font-medium text-sm"
                  aria-label={`Delete ${entity.name}`}
                  data-oid="3km.4iq"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
