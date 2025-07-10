import React from "react";
import { X } from "lucide-react";
import { platformColors, getPlatformIcon } from "./Constants";

export const PostForm = ({
  isDialogOpen,
  setIsDialogOpen,
  form,
  setForm,
  handleSavePost,
}) => {
  const handlePlatformToggle = (platform) => {
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
    resetForm();
  };
  const isEditing = form._id && form._id !== undefined && form._id !== null;

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSavePost();
          }}
          className="space-y-5"
        >
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.date?.split("T")[0] || ""}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Enter post title"
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={4}
              placeholder="Write your post content here..."
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platform(s)
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.keys(platformColors).map((platform) => {
                const isSelected = form.platform?.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handlePlatformToggle(platform)}
                    className={`flex items-center justify-center space-x-2 rounded-md px-3 py-2 text-xs font-semibold capitalize transition-shadow duration-200 ${
                      isSelected
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "hover:brightness-90"
                    }`}
                    style={{ backgroundColor: platformColors[platform] }}
                    aria-pressed={isSelected}
                  >
                    {getPlatformIcon(platform)}
                    <span className="text-white select-none">
                      {platform === "x" ? "X" : platform}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Platform Input & Color */}
            {form.platform?.includes("other") && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={form.customPlatform}
                  onChange={(e) =>
                    setForm({ ...form, customPlatform: e.target.value })
                  }
                  placeholder="Enter custom platform name"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Custom Color
                  </label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer border-none p-0"
                    aria-label="Select custom platform color"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md px-5 py-2 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-5 py-2 transition"
            >
              {isEditing ? "Update Post" : "Create Post"}
            </button>
          </div>
        </form>
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-white">Filter Posts</h2>
          <button
            onClick={() => setIsHistoryFilterOpen(false)}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close filter modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsHistoryFilterOpen(false);
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Platform
            </label>
            <select
              value={filters.platform}
              onChange={(e) =>
                setFilters({ ...filters, platform: e.target.value })
              }
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={clearFilters}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md px-5 py-2 transition"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-5 py-2 transition"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};