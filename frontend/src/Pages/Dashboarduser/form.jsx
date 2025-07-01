import React from "react";
import { X } from "lucide-react";
import { platformColors, getPlatformIcon } from "./Constants";

export const PostForm = ({
  isDialogOpen,
  setIsDialogOpen,
  form,
  setForm,
  selectedPostIndex,
  setSelectedPostIndex,
  handleSavePost,
}) => {
  const handlePlatformToggle = (platform) => {
    console.log(form);
    setForm((prev) => {
      const isAlreadySelected = prev.platform?.includes(platform);
      return {
        ...prev,
        platform: isAlreadySelected
          ? prev.platform.filter((p) => p !== platform)
          : [...(prev.platform || []), platform],
      };
    });
  };

  const resetForm = () => {
    setForm({
      date: "",
      title: "",
      content: "",
      platform: [],
      customPlatform: "",
      color: "#E4405F",
      mediaType: "image",
    });
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedPostIndex(null);
    resetForm();
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <div className="bg-gray-800 border border-gray-700 text-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          {selectedPostIndex !== null ? "Edit Post" : "Create New Post"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Date *</label>
            <input
              type="date"
              value={form.date.split('T')[0]}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Post Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
              placeholder="Enter post title"
            />
          </div>
          <div>
            <label className="block mb-1">Content *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white h-24"
              placeholder="Write your post content here..."
            />
          </div>

          <div>
            <label className="block mb-2">Platform(s)</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {Object.keys(platformColors).map((platform) => {
                const isSelected = form.platform?.includes(platform);

                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handlePlatformToggle(platform)}
                    className={`px-3 py-2 rounded text-xs font-medium capitalize transition flex items-center justify-center space-x-1 ${isSelected ? "ring-2 ring-blue-400" : "hover:bg-gray-600"
                      }`}
                    style={{ backgroundColor: platformColors[platform] }}
                  >
                    {getPlatformIcon(platform)}
                    <span className="text-white">
                      {platform === "x" ? "X" : platform}
                    </span>
                  </button>
                );
              })}
            </div>

            {form.platform?.includes("other") && (
              <>
                <input
                  type="text"
                  value={form.customPlatform}
                  onChange={(e) =>
                    setForm({ ...form, customPlatform: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white mb-2"
                  placeholder="Enter custom platform name"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Custom Color
                  </label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                    className="w-full h-10 rounded border-none p-1 bg-gray-700 cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={handleSavePost}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            {selectedPostIndex !== null ? "Update Post" : "Create Post"}
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const HistoryFilterModal = ({
  isHistoryFilterOpen,
  setIsHistoryFilterOpen,
  filters,
  setFilters,
}) => {
  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      platform: "all",
    });
  };

  if (!isHistoryFilterOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-gray-800 border border-gray-700 text-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filter Posts</h2>
          <button
            onClick={() => setIsHistoryFilterOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Platform</label>
            <select
              value={filters.platform}
              onChange={(e) =>
                setFilters({ ...filters, platform: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            >
              <option value="all">All Platforms</option>
              {Object.keys(platformColors).map((platform) => (
                <option key={platform} value={platform}>
                  {platform === "x"
                    ? "X (Twitter)"
                    : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={clearFilters}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Clear Filters
          </button>
          <button
            onClick={() => setIsHistoryFilterOpen(false)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};