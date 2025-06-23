import React, { useState } from "react";
import { Bell, CheckCircle } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    title: "tested",
    description: "Your dad left again.",
    date: "2025-06-22",
    read: false,
  },
  {
    id: 2,
    title: " Meeting at 3 PM",
    description: "nah im fine.",
    date: "2025-06-21",
    read: true,
  },
  {
    id: 3,
    title: "nigger",
    description: "i can say that cauz m mf african too.",
    date: "2025-06-20",
    read: false,
  },
];

const NotificationsPage = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const filtered = notifications.filter((n) => {
    if (filter === "read") return n.read;
    if (filter === "unread") return !n.read;
    return true;
  });

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>
            <div className="inline-flex bg-[#334155] rounded-full p-1 mb-4">
            {["All", "Unread", "Read"].map((label) => {
                const key = label.toLowerCase();
                const isActive = filter === key;
                return (
                <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-4 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-300 hover:text-white"
                    }`}
                >
                    {label}
                </button>
                );
            })}
            </div>
        <ul className="space-y-4">
          {filtered.map((note) => (
                <li
        key={note.id}
        className={`group flex items-center justify-between gap-4 border rounded-xl px-4 py-3 transition-all ${
            note.read
            ? "bg-[#1e293b] border-gray-700"
            : "bg-[#1e293b]/80 border-blue-600"
        }`}
        >
        
        <div className="flex-1">
            <h3
            className={`font-medium text-base ${
                note.read ? "text-gray-400 line-through" : "text-white"
            }`}
            >
            {note.title}
            </h3>
            <p className="text-sm text-gray-400">{note.description}</p>
            <span className="text-xs text-gray-500">{note.date}</span>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 ml-4">
            {/* Read/Unread Toggle */}
            <button
            onClick={() =>
                setNotifications((prev) =>
                prev.map((n) =>
                    n.id === note.id ? { ...n, read: !n.read } : n
                )
                )
            }
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${
                note.read
                ? "text-green-400 border-green-400 hover:bg-green-800"
                : "text-blue-400 border-blue-400 hover:bg-blue-800"
            }`}
            title={note.read ? "Mark as unread" : "Mark as read"}
            >
            {note.read ? <CheckCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </button>

            {/* Delete Icon (hidden until hover) */}
            <button
            onClick={() =>
                setNotifications((prev) => prev.filter((n) => n.id !== note.id))
            }
            title="Delete"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>
        </li>



        ))}

        </ul>
      </div>
    </div>
  );
};

export default NotificationsPage;
