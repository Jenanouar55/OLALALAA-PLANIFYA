import { useState } from "react";
import { Check, ClipboardCopy, Loader2, X } from "lucide-react";



export default function StrategyTips() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("Short Video");
  const [duration, setDuration] = useState("");
  const [tips, setTips] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const contentTypes = ["Short Video", "Reel", "Story", "Podcast Clip", "Vlog"];

  const generateTips = (e) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setCopied(false);

    setTimeout(() => {
      const mockTips = `📌 Strategy Tips for ${contentType} on "${topic}"${duration ? ` (~${duration})` : ""}:\n\n1. Hook your audience in the first 3 seconds.\n2. Highlight one main takeaway.\n3. Use captions and engaging visuals.\n4. End with a strong call-to-action.\n\n🎯 Keep it concise, impactful, and aligned with your brand.`;
      setTips(mockTips);
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tips);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-500 text-center">
          Strategy Tips Generator
        </h2>

        <form
          onSubmit={generateTips}
          className="space-y-6 bg-[#1e293b] p-6 rounded-lg"
        >
          <div>
            <label className="block mb-2 font-semibold text-lg" htmlFor="topic">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g. Product Launch, Fitness Motivation"
              className="w-full p-3 rounded bg-[#334155] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-lg" htmlFor="contentType">
              Content Type
            </label>
            <select
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full p-3 rounded bg-[#334155] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-lg" htmlFor="duration">
              Length / Duration (optional)
            </label>
            <input
              id="duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="E.g. 60 seconds"
              className="w-full p-3 rounded bg-[#334155] text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-semibold text-lg transition-colors ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" /> Generating...
              </span>
            ) : (
              "Generate Tips"
            )}
          </button>
        </form>

                {tips && (
        <div className="mt-8 bg-[#334155] p-5 rounded-lg relative whitespace-pre-wrap">
            <button
            onClick={() => setTips("")}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
            aria-label="Clear Tips"
            >
            <X className="w-5 h-5" />
            </button>
            <p className="text-lg mb-4">{tips}</p>
            <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
            >
            {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Tips"}
            </button>
        </div>
        )}

      </div>
    </div>
  );
}
