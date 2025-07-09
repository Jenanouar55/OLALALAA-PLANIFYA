import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bell, CheckCircle, X } from "lucide-react";
import apiClient from "../../lib/axios";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get("/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Failed to fetch notifications.");
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "read") return n.isRead;
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const markAsRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
      toast.error("Failed to update notification.");
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch("/notifications/mark-all-read", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to mark all as read.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to delete notification.");
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        <div className="inline-flex bg-gray-700 rounded-full p-1 mb-6">
          {["All", "Unread", "Read"].map((label) => {
            const key = label.toLowerCase();
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1 text-sm font-medium rounded-full transition-all duration-200 ${filter === key
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
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((note) => (
              <li
                key={note._id}
                className={`group flex items-center justify-between gap-4 border rounded-xl px-4 py-3 transition-all ${note.isRead ? "bg-gray-800 border-gray-700" : "bg-blue-900/30 border-blue-600"
                  }`}
              >
                <div className="flex-1">
                  <h3 className={`font-medium text-base ${note.isRead ? "text-gray-500" : "text-white"}`}>
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-400">{note.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!note.isRead && (
                    <button
                      onClick={() => markAsRead(note._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-400 text-blue-400 hover:bg-blue-800 transition"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(note._id)}
                    title="Delete"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400 p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No notifications here.</p>
          )}
        </ul>
      </div>
    </div>
  );
}