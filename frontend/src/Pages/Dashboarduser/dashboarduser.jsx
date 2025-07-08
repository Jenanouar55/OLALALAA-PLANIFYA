import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, Zap } from "lucide-react";
import { sidebarItems } from "./Constants";
import { CalendarView, HistoryView, PostDetailsModal } from './CalenderandHistory';
import { PostForm, HistoryFilterModal } from './form';
import ChatBot from "./Chatbot";
import ScriptGenerator from "./scriptgenerator";
import CalendarIdeas from "./CalendarIdeas";
import CaptionGenerator from "./captiongenearor";
import StrategyTips from "./Stips";
import NotificationsPage from "./alerts";
import UserProfile from "./userprofil";

export default function UserDashboard() {
  const today = new Date();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [currentPage, setCurrentPage] = useState("calendar");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryFilterOpen, setIsHistoryFilterOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const initialFormState = {
    _id: null,
    date: "",
    title: "",
    content: "",
    platforms: [],
    customPlatform: "",
    color: "#E4405F",
  };

  const [form, setForm] = useState(initialFormState);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [showPostDetails, setShowPostDetails] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    platform: "all"
  });

  useEffect(() => {
    const fetchData = async (url, setter, errorMessage) => {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            "authorization": 'Bearer ' + localStorage.getItem("token")
          }
        });
        const data = await response.json();
        if (response.ok) setter(data);
        else toast.error(data.message || errorMessage);
      } catch (err) {
        toast.error('Network error.');
      }
    };

    fetchData("http://localhost:5000/api/posts", setPosts, 'Error fetching posts.');
    fetchData("http://localhost:5000/api/admin/events", setEvents, 'Error fetching events.');

    const fetchTokens = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setTokenCount(data.tokens);
      } catch (err) {
        console.error("Error fetching tokens:", err);
      }
    };
    fetchTokens();
  }, []);

  const handlePostDrop = async (postId, newDate) => {
    const postToUpdate = posts.find(p => p._id === postId);
    if (!postToUpdate) return;

    const updatedPost = { ...postToUpdate, date: newDate };

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(updatedPost)
      });

      if (response.ok) {
        setPosts(currentPosts =>
          currentPosts.map(p =>
            p._id === postId ? updatedPost : p
          )
        );
        toast.success("Post date updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update post date.");
      }
    } catch (err) {
      toast.error("Network error while updating post.");
    }
  };

  const handleSavePost = async () => {
    if (!form.title || !form.content || !form.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const isEditing = !!form._id;
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing
      ? `http://localhost:5000/api/posts/${form._id}`
      : 'http://localhost:5000/api/posts';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          "authorization": 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(form)
      });

      const savedPost = await response.json();

      if (response.ok) {
        toast.success(`Post ${isEditing ? 'updated' : 'created'} successfully!`);

        if (isEditing) {
          setPosts(currentPosts => currentPosts.map(p => (p._id === savedPost._id ? savedPost : p)));
        } else {
          setPosts(currentPosts => [...currentPosts, savedPost]);
        }

        setIsDialogOpen(false);
        setForm(initialFormState);
      } else {
        toast.error(savedPost.message || `Error ${isEditing ? 'updating' : 'creating'} post.`);
      }
    } catch (err) {
      toast.error('Network error.');
    }
  };

  const handleOpenCreateForm = () => {
    setForm(initialFormState);
    setIsDialogOpen(true);
  };

  const handleSidebarItemClick = (itemId) => {
    if (itemId === "logout") {
      setIsLogoutConfirmOpen(true);
    } else {
      setCurrentPage(itemId);
    }
  };

  const handleLogoutConfirm = () => {
    setIsLogoutConfirmOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleEditPost = (post) => {
    const dateForInput = post.date ? post.date.split('T')[0] : '';
    setForm({ ...post, date: dateForInput });
    setIsDialogOpen(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch("http://localhost:5000/api/posts/" + postId, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          "authorization": 'Bearer ' + localStorage.getItem("token")
        }
      });
      if (response.ok) {
        setPosts(posts.filter(p => p._id !== postId));
        toast.success('Post deleted successfully');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Error during deletion.');
      }
    } catch (err) {
      toast.error('Network error.');
    }
  };

  const renderPlaceholderView = (pageName) => (
    <div className="bg-gray-800 rounded-lg p-6 text-center">
      <h2 className="text-2xl font-bold mb-4 capitalize">{pageName}</h2>
      <p className="text-gray-400">This page is under construction. Coming soon!</p>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "calendar":
        return <CalendarView
          posts={posts}
          events={events}
          handlePostDrop={handlePostDrop}
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          setShowPostDetails={setShowPostDetails}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
        />;
      case "history":
        return <HistoryView
          posts={posts}
          filters={filters}
          setIsHistoryFilterOpen={setIsHistoryFilterOpen}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
        />;
      case "alerts": return <NotificationsPage />;
      case "settings": return renderPlaceholderView("settings");
      case "profile": return <UserProfile />;
      case "chatbot": return <ChatBot />;
      case "scriptgenerator": return <ScriptGenerator />;
      case "CalendarIdeas": return <CalendarIdeas />;
      case "captiongenerator": return <CaptionGenerator />;
      case "strategytips": return <StrategyTips />;
      default: return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className={`${isSidebarExpanded ? "w-60" : "w-20"} bg-gray-800 h-screen flex flex-col justify-between transition-all`}>
        <nav className="w-full flex flex-col items-center space-y-2 mt-4">
          <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="text-white hover:text-blue-400 p-2 rounded transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSidebarItemClick(item.id)}
                className={`flex items-center ${isSidebarExpanded ? "justify-start px-4" : "justify-center"} w-full p-3 rounded-lg transition-colors duration-200 ${isActive ? "bg-gray-700 text-blue-400" : "text-white hover:bg-gray-700 hover:text-blue-300"}`}
              >
                <Icon className="w-5 h-5" />
                {isSidebarExpanded && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="w-full px-3 py-4 bg-gradient-to-r from-yellow-500/20 to-yellow-300/10 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-500/20 p-2 rounded-full">
              <Zap className="text-yellow-400 w-5 h-5" />
            </div>
            {isSidebarExpanded && (
              <div>
                <p className="text-xs text-gray-400">Tokens</p>
                <p className={`text-sm font-bold ${tokenCount <= 5 ? "text-red-500 animate-pulse" : "text-yellow-300"}`}>{tokenCount}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <img src="/Images/Planifya-v2.png" alt="logo" className="h-10 w-auto" />
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Search posts..." className="w-96 px-4 py-2 rounded-full bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleOpenCreateForm} className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg text-sm font-medium">
              + Create Post
            </button>
          </div>
        </header>
        {renderCurrentPage()}
        <PostDetailsModal showPostDetails={showPostDetails} setShowPostDetails={setShowPostDetails} />
        <PostForm isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} form={form} setForm={setForm} handleSavePost={handleSavePost} />
        <HistoryFilterModal isHistoryFilterOpen={isHistoryFilterOpen} setIsHistoryFilterOpen={setIsHistoryFilterOpen} filters={filters} setFilters={setFilters} />
        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-full text-center">
              <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
              <p className="mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={handleLogoutCancel} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors">Cancel</button>
                <button onClick={handleLogoutConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white">Logout</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}