import axios from "axios";
import { useState } from "react";
import apiClient from "../../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { clearGeneratedContent, generateScript } from "../../features/aiSlice";

const icons = {
  delete: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  regenerate: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4v5h.582M20 20v-5h-.581M5.5 9a7 7 0 0111.94-2.94L20 9m-16 6l3.56 3.56A7 7 0 0019 15.5" />
    </svg>
  ),
  like: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9l-3 3-3-3" />
      <path d="M5 15h14" />
    </svg>
  ),
  dislike: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 15l3-3 3 3" />
      <path d="M19 9H5" />
    </svg>
  ),
  copy: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  copied: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-green-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  share: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
};

export default function ScriptGenerator() {
  const dispatch = useDispatch();
  const { generatedContent, loading, error } = useSelector((state) => state.ai);

  const [topic, setTopic] = useState("");
  const [type, setType] = useState("Short video");
  const [duration, setDuration] = useState("");
  const [script, setScript] = useState("");
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);

  // const generateScript = async () => {
  //   setLoading(true);
  //   setScript("");
  //   setCopied(false);
  //   setLiked(null);

  //   try {
  //     const response = await apiClient.post("/ai/script", {
  //       topic,
  //       type,
  //       duration,
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       }
  //     });
  //     if (response.data && response.data.result) {
  //       setScript(response.data.result);
  //     } else {
  //       console.log("Failed to generate script. The response was empty.");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching AI script:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGenerate = () => {
    dispatch(clearGeneratedContent());
    dispatch(generateScript({ topic, type, duration }));
  };

  // const handleRegenerate = () => {
  //   if (!loading && topic) {
  //     generateScript();
  //   }
  // };

  const handleCopy = () => {
    if (!script) return;
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDelete = () => {
    setScript("");
    dispatch(clearGeneratedContent());
  };

  const handleShare = () => {
    if (!script) return;
    if (navigator.share) {
      navigator
        .share({
          title: "Generated Script",
          text: script,
          url: window.location.href,
        })
        .catch((error) => {
          alert("Error sharing: " + error);
        });
    } else {
      navigator.clipboard.writeText(script).then(() => {
        alert("Script copied to clipboard! You can now share it anywhere.");
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#1e293b] p-6 rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-blue-400 mb-8 text-center">
          Script/Idea Generator
        </h1>

        <div>
          <label className="block text-sm font-semibold mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-[#334155] text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your topic..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Content Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#334155] text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Short video</option>
            <option>Reel</option>
            <option>Story</option>
            <option>Script</option>
            <option>Podcast</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Length/Duration (optional)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-[#334155] text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., 60 (seconds)"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${loading || !topic
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Generating..." : "Generate Script"}
          </button>
        </div>
        {script && (
          <div className="relative mt-6 p-4 border border-blue-600 rounded-lg bg-[#0f172a]/80">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Generated Output:</h2>
              <div className="flex space-x-6 text-gray-400">
                <button
                  onClick={handleDelete}
                  title="Delete"
                  className="hover:text-red-500 transition-colors"
                >
                  {icons.delete}
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  title="Regenerate"
                  className={`hover:text-blue-400 transition-colors ${loading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                >
                  {icons.regenerate}
                </button>

                <button
                  onClick={handleCopy}
                  title="Copy to Clipboard"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {copied ? icons.copied : icons.copy}
                </button>
                <button
                  onClick={handleShare}
                  title="Share"
                  className="hover:text-purple-400 transition-colors"
                >
                  {icons.share}
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap">{script}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
