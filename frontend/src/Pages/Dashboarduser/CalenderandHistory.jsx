import React, { useState, useEffect } from 'react';
import { Pencil, Trash, Filter, Star } from 'lucide-react';
import { getPlatformIcon } from './Constants';
import JoyTour from './joytour';

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
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("hasSeenTour")) {
      setTimeout(() => setRunTour(true), 1000); 
    }
  }, []);

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
      <JoyTour run={runTour} setRun={setRunTour} />

      <div className="flex items-center space-x-2 mb-4 tour-header">
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
              className="relative h-24 bg-gray-800 rounded p-1 text-left text-sm border border-gray-700 transition-colors tour-calendar-cell"
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
                      className="mt-1 text-xs px-2 py-1 rounded bg-cyan-800 text-green-200 flex items-center justify-between cursor-grab hover:opacity-80 group tour-post"
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
                      <span>{item.name}</span>
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
