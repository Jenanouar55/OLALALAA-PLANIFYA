import { useState } from "react";
import { Check, ClipboardCopy, Loader2 } from "lucide-react";

export default function CaptionGenerator() {
  const [platform, setPlatform] = useState("Instagram");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const platforms = ["Instagram", "TikTok", "Facebook", "LinkedIn"];
  const tones = ["Professional", "Friendly", "Funny", "Inspiring"];

  const generateCaption = (e) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setCopied(false);
    setTimeout(() => {
      const mockCaption = `Here's a ${tone.toLowerCase()} caption for your ${platform} post about "${topic}"! ✨`;
      setCaption(mockCaption);
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 text-center">
          Caption Generator
        </h2>

        <form
          onSubmit={generateCaption}
          className="space-y-6 bg-[#1e293b] p-6 rounded-lg"
        >
          <div>
            <label className="block mb-2 font-semibold text-lg" htmlFor="platform">
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
            <label className="block mb-2 font-semibold text-lg" htmlFor="topic">
              Post Topic/Title
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g. Summer Sale Announcement"
              className="w-full p-3 rounded bg-[#334155] text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-lg" htmlFor="tone">
              Tone / Style
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 rounded bg-[#334155] text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-semibold text-lg transition-colors ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" /> Generating...
              </span>
            ) : (
              "Generate Caption"
            )}
          </button>
        </form>

        {caption && (
          <div className="mt-8 bg-[#334155] p-5 rounded-lg">
            <p className="text-lg mb-4">{caption}</p>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />} 
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
