import React from 'react';
import { Pencil, Trash, Filter, Star } from 'lucide-react';
import { getPlatformIcon } from './Constants';

const getPlatformColor = (platform) => {
  const colors = {
    facebook: "#3b5998",
    instagram: "#e1306c",
    twitter: "#1da1f2",
    x: "#000000",
    linkedin: "#0077b5",
    youtube: "#ff0000",
    default: "#6b7280"
  };
  return colors[platform] || colors.default;
};

export const CalendarView = ({
  posts,
  events,
  handlePostDrop,
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  setShowPostDetails,
  handleEditPost,
  handleDeletePost
}) => {
  const handleDragStart = (e, postId) => {
    e.dataTransfer.setData("text/plain", postId);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, newDate) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const postId = e.dataTransfer.getData("text/plain");
    handlePostDrop(postId, newDate);
  };

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
  const today = new Date();

  const calendarDays = generateCalendarDays();

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <button
          className="bg-gray-700 px-3 py-1 rounded"
          onClick={() => {
            if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
            else { setCurrentMonth(currentMonth - 1); }
          }}
        >❮</button>
        <h2 className="text-lg font-semibold px-4 py-1 bg-gray-700 rounded">
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <button
          className="bg-gray-700 px-3 py-1 rounded"
          onClick={() => {
            if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
            else { setCurrentMonth(currentMonth + 1); }
          }}
        >❯</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
          <div key={day} className="font-semibold text-white">{day}</div>
        ))}
        {calendarDays.map((date, i) => {
          if (!date) return <div key={i} className="h-24" />;
          const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;

          const calendarItems = [
            ...posts.filter(p => p.date && p.date.startsWith(dateStr)).map(item => ({ ...item, type: 'post' })),
            ...events.filter(e => e.date && e.date.startsWith(dateStr)).map(item => ({ ...item, type: 'event' })),
          ];

          return (
            <div
              key={i}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dateStr)}
              onDragLeave={handleDragLeave}
              className="relative h-24 bg-gray-800 rounded p-1 text-left text-sm border border-gray-700 transition-colors"
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-white'}`}>
                {date.getDate()}
              </span>
              {calendarItems.map((item, idx) => {
                const topPosition = 1.25 + (idx * 1.75);

                if (item.type === 'post') {
                  return (
                  <div
                  key={`post-${item._id}`}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, item._id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setShowPostDetails(item)}
                  className="mt-1 text-xs px-2 py-1 rounded bg-green-800 text-green-200 flex items-center justify-between cursor-grab hover:opacity-80 group"
                  style={{ top: `${topPosition}rem` }}
                >
                  <span className="text-center flex-1">
                    {item.title.length > 15 ? `${item.title.slice(0, 13)}…` : item.title}
                  </span>
                  <span className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <Pencil className="w-3 h-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleEditPost(item); }} />
                    <Trash className="w-3 h-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDeletePost(item._id); }} />
                  </span>
                </div>


                  );
                }

                if (item.type === 'event') {
                  return (
                    <div
                      key={`event-${item._id}`}
                      onClick={() => setShowPostDetails(item)}
                      className="text-xs px-2 py-1 rounded bg-green-800 text-green-200 flex justify-between items-center cursor-default"
                      style={{ top: `${topPosition}rem` }}
                    >
                      <span className="flex items-center">
                        {/* <Star className="w-3 h-3 mr-1.5 flex-shrink-0" /> */}
                        <span>{item.name}</span>
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export const HistoryView = ({ posts, filters, setIsHistoryFilterOpen, handleEditPost, handleDeletePost }) => {
  const getFilteredPosts = () => {
    return posts.filter(post => {
      const postDate = new Date(post.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const dateMatch = (!startDate || postDate >= startDate) && (!endDate || postDate <= endDate);

      let platformMatch = false;
      if (filters.platform === "all") {
        platformMatch = true;
      } else if (post.platform && Array.isArray(post.platform)) {
        platformMatch = post.platform.includes(filters.platform);
      } else if (typeof post.platform === "string") {
        platformMatch = post.platform === filters.platform;
      }

      return dateMatch && platformMatch;
    });
  };

  const renderPlatformBadges = (post) => {
    const platforms = Array.isArray(post.platform) ? post.platform : (typeof post.platform === 'string' ? [post.platform] : []);
    return (
      <div className="flex flex-wrap gap-1">
        {platforms.map((platform, index) => {
          const safePlatform = typeof platform === "string" ? platform : "other";
          return (
            <div
              key={index}
              className="flex items-center space-x-1 px-2 py-1 rounded text-white text-xs"
              style={{ backgroundColor: safePlatform === "other" ? post.color : getPlatformColor(safePlatform) }}
            >
              {getPlatformIcon(safePlatform)}
              <span>{safePlatform.charAt(0).toUpperCase() + safePlatform.slice(1)}</span>
            </div>
          );
        })}
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
          getFilteredPosts().map((post) => (
            <div key={post._id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => handleEditPost(post)} className="text-blue-400 hover:text-blue-300">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeletePost(post._id)} className="text-red-400 hover:text-red-300">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {renderPlatformBadges(post)}
                <p className="text-sm text-gray-300 mt-2">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
    const platforms = Array.isArray(post.platform) ? post.platform : (typeof post.platform === "string" ? [post.platform] : []);
    return platforms.map((platform, index) => (
      <span key={index}>{platform.charAt(0).toUpperCase() + platform.slice(1)}{index < platforms.length - 1 ? ", " : ""}</span>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{showPostDetails.title}</h2>
        <p className="mb-2">{showPostDetails.content}</p>
        <p className="mb-2 text-sm text-gray-500">
          Platforms: {renderPlatformInfo(showPostDetails)}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Date: {new Date(showPostDetails.date).toLocaleDateString()}
        </p>
        <button onClick={() => setShowPostDetails(null)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};