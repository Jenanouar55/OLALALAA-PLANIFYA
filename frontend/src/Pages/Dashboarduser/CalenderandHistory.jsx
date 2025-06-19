import React, { useState } from "react";
import { Pencil, Trash, Filter } from "lucide-react";
import { getPlatformIcon, getMediaIcon } from "../Dashboarduser/Constants";

export const CalendarView = ({
  posts,
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  setShowPostDetails,
  handleEditPost,
  handleDeletePost
}) => {
  const getPostsForDate = (dateStr) =>
    posts.map((post, index) => ({ ...post, index })).filter((post) => post.date === dateStr);

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <button className="bg-gray-700 px-3 py-1 rounded" onClick={() => {
          if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
          } else {
            setCurrentMonth(currentMonth - 1);
          }
        }}>❮</button>
        <h2 className="text-lg font-semibold px-4 py-1 bg-gray-700 rounded">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric"
          })}
        </h2>
        <button className="bg-gray-700 px-3 py-1 rounded" onClick={() => {
          if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
          } else {
            setCurrentMonth(currentMonth + 1);
          }
        }}>❯</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
          <div key={day} className="font-semibold text-white">{day}</div>
        ))}
        {calendarDays.map((date, i) => {
          if (!date) return <div key={i} className="h-24"></div>;
          const dateStr = date.toISOString().split("T")[0];
          return (
            <div key={i} className="relative h-24 bg-gray-800 rounded p-1 text-left text-sm border border-gray-700">
              <span className="text-white text-sm" title={date.toLocaleDateString(undefined, {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}>{date.getDate()}</span>
              {getPostsForDate(dateStr).map((post, idx) => (
                <div key={idx} onClick={() => setShowPostDetails(post)}
                  className="absolute top-5 left-0 right-0 text-xs mt-1 h-6 px-2 py-1 rounded text-white flex justify-between items-center cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: post.color }}>
                  <div className="flex items-center space-x-1">
                    <span>{post.title.length > 15 ? post.title.slice(0, 13) + "…" : post.title}</span>
                  </div>
                  <span className="flex space-x-1">
                    <Pencil className="w-3 h-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleEditPost(post.index); }} />
                    <Trash className="w-3 h-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDeletePost(post.index); }} />
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export const HistoryView = ({
  posts,
  filters,
  setIsHistoryFilterOpen,
  handleEditPost,
  handleDeletePost
}) => {
  const getFilteredPosts = () => {
    return posts.filter(post => {
      const postDate = new Date(post.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const dateMatch = (!startDate || postDate >= startDate) && (!endDate || postDate <= endDate);

      // Updated platform filtering to handle multiple platforms
      let platformMatch = false;
      if (filters.platform === "all") {
        platformMatch = true;
      } else if (post.platforms && Array.isArray(post.platforms)) {
        platformMatch = post.platforms.includes(filters.platform);
      } else if (post.platform) {
        platformMatch = post.platform === filters.platform;
      }

      return dateMatch && platformMatch;
    });
  };

  // Helper function to render platform badges
  

  const renderPlatformBadges = (post) => {
    const platforms = post.platforms && Array.isArray(post.platforms) ? post.platforms : post.platform ? [post.platform] : [];
    return (
      <div className="flex flex-wrap gap-1">
        {platforms.map((platform, index) => (
          <div key={index} className="flex items-center space-x-1 px-2 py-1 rounded text-white text-xs" style={{ backgroundColor: platform === "other" ? post.color : getPlatformColor(platform) }}>
            {getPlatformIcon(platform)}
            <span>{platform === "other" ? post.customPlatform || "Custom" : platform === "x" ? "X" : platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Post History</h2>
        <button onClick={() => setIsHistoryFilterOpen(true)} className="bg-purple-600 hover:bg-purple-700 transition-all duration-200 px-4 py-2 rounded text-sm font-medium flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>
      <div className="space-y-4">
        {getFilteredPosts().length === 0 ? (
          <p className="text-gray-400 text-center py-8">No posts found</p>
        ) : (
          getFilteredPosts().map((post, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => handleEditPost(posts.findIndex(p => p === post))} className="text-blue-400 hover:text-blue-300">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  {renderPlatformBadges(post)}
                </div>

                <p className="text-sm text-gray-300 mb-2">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-100">{post.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const PostDetailsModal = ({ showPostDetails, setShowPostDetails }) => {
  if (!showPostDetails) return null;

  const renderPlatformInfo = (post) => {
    const platforms = post.platforms && Array.isArray(post.platforms)
      ? post.platforms
      : post.platform
        ? [post.platform]
        : [];

    return platforms.map((platform, index) => (
      <span key={index}>
        {platform === "other"
          ? post.customPlatform || "Custom Platform"
          : platform === "x"
            ? "X (Twitter)"
            : platform.charAt(0).toUpperCase() + platform.slice(1)
        }
        {index < platforms.length - 1 ? ", " : ""}
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-white" onClick={() => setShowPostDetails(null)}>✕</button>
        <h2 className="text-xl font-bold mb-2">{showPostDetails.title}</h2>
        <p className="mb-2"><strong>Date:</strong> {new Date(showPostDetails.date).toLocaleString()}</p>
        <p className="mb-2"><strong>Platform(s):</strong> {renderPlatformInfo(showPostDetails)}</p>
        <p><strong>Description:</strong><br />{showPostDetails.content}</p>
      </div>
    </div>
  );
};
