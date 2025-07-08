import axios from "axios";
import { useState } from "react";
import apiClient from "../../lib/axios";

const icons = {
  loading: (
    <svg
      className="animate-spin h-6 w-6 text-white inline-block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  ),
  save: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 cursor-pointer text-green-600 hover:text-green-400 transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      title="Save idea"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  trash: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 cursor-pointer text-red-600 hover:text-red-400 transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      title="Remove idea"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  refresh: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 cursor-pointer text-blue-600 hover:text-blue-400 transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      title="Regenerate idea"
    >
      <path d="M4 4v5h.582M20 20v-5h-.581M4 9a8 8 0 0114 4M20 9a8 8 0 00-14 4" />
    </svg>
  ),
};

export default function CalendarIdeas() {
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [category, setCategory] = useState("Art");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);

  const platforms = ["Instagram", "Facebook", "Twitter", "TikTok", "LinkedIn"];
  const categories = ["Art", "Tech", "Gaming", "Education", "Lifestyle"];

  const generateIdeaText = (category, platform, date) => {
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `Idea for ${category} on ${platform} scheduled for ${date} (#${randomSuffix})`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    try {
      const response = await apiClient.post("/ai/calendar-ideas", {
        platform,
        category,
        date,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const ideasArray = response.data.result?.split('*')
        .slice(1)
      const cleanedArray = ideasArray.filter(item => item.trim() !== '');

      const structuredIdeas = [];
      for (let i = 0; i < cleanedArray.length; i += 2) {
        if (cleanedArray[i + 1]) {
          structuredIdeas.push({
            title: cleanedArray[i].replace(':', '').trim(),
            description: cleanedArray[i + 1].trim()
          });
        }
      }
      if (structuredIdeas && response.data.result) {
        setIdeas(structuredIdeas);
      } else {
        console.log("Failed to generate script. The response was empty.");
      }
    } catch (err) {
      console.error("Error fetching AI script:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, saved: !idea.saved } : idea
      )
    );
  };

  const removeIdea = (id) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  const regenerateAndSave = (id) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === id) {
          return {
            ...idea,
            idea: generateIdeaText(idea.category, idea.platform, idea.date),
            saved: true,
          };
        }
        return idea;
      })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 text-center">
          Calendar Ideas
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#1e293b] p-6 rounded-lg"
        >
          <div>
            <label className="block mb-2 font-semibold text-lg" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded bg-[#334155] text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 font-semibold text-lg"
              htmlFor="platform"
            >
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 rounded bg-[#334155] text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block mb-2 font-semibold text-lg"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded bg-[#334155] text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-semibold text-lg transition-colors ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
              }`}
          >
            {loading ? (
              <>
                {icons.loading} Generating...
              </>
            ) : (
              "Generate Idea"
            )}
          </button>
        </form>

        <div className="mt-8 space-y-5 max-h-[350px] overflow-auto scrollbar-hide">
          {ideas.length === 0 && (
            <p className="text-gray-400 italic text-lg text-center">
              No ideas generated yet.
            </p>
          )}
          {/* {ideas?.map(({ id, date, platform, category, idea, saved }) => ( */}
          {ideas?.map((idea, i) => (
            <div
              // key={id}
              className="bg-[#334155] p-5 rounded-lg flex justify-between items-center"
            >
              <div id={i}>
                <p className="font-semibold text-lg">{idea.title}</p>
                <p className="text-sm text-gray-300 mt-1">
                  {/* Date: {date} | Platform: {platform} | Category: {category} */}
                  {/* title: {title} | description: {description} */}
                  description: {idea.description}
                </p>
              </div>
              {/* <div className="flex space-x-4 items-center">

                <span
                  onClick={() => toggleSave(id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") toggleSave(id);
                  }}
                // aria-label={saved ? "Unsave idea" : "Save idea"}
                >
                  {icons.save}
                </span>

                <span
                  onClick={() => removeIdea(id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") removeIdea(id);
                  }}
                  aria-label="Remove idea"
                >
                  {icons.trash}
                </span>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
