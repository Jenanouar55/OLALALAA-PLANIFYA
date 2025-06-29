import axios from "axios";
import React, { useEffect, useState } from "react";
import { Menu, Zap } from "lucide-react";
import ChatBot from "./Chatbot";
import ScriptGenerator from "./scriptgenerator";
import CalendarIdeas from "./CalendarIdeas";
import CaptionGenerator from "./captiongenearor";
import StrategyTips from "./Stips";
import NotificationsPage from "./alerts";
import {
  initialPosts,
  platformColors,
  sidebarItems
} from "./Constants";
import { CalendarView, HistoryView, PostDetailsModal } from './CalenderandHistory';
import { PostForm, HistoryFilterModal } from './form';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserProfile from "./userprofil";


export default function UserDashboard() {
  const today = new Date();
  const navigate = useNavigate();

  const [tokenCount, setTokenCount] = useState(0); // 🪙 token state
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState("calendar");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryFilterOpen, setIsHistoryFilterOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    date: "",
    title: "",
    content: "",
    platform: "instagram",
    customPlatform: "",
    color: "#E4405F",
  });

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [showPostDetails, setShowPostDetails] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    platform: "all"
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            "authorization": 'Bearer ' + localStorage.getItem("token")
          }
        });

        const data = await response.json();
        if (response.ok) setPosts(data);
        else toast.error(data.message || 'Erreur de fetch.');
      } catch (err) {
        toast.error('Erreur de réseau.');
      }
    };

    const fetchTokens = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile/tokens", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server responded with ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        setTokenCount(data.tokens);
      } catch (err) {
        console.error("Error fetching tokens:", err);
      }
    };




    fetchPosts();
    fetchTokens();
  }, []);

  const handleSidebarItemClick = (itemId) => {
    if (itemId === "logout") {
      setIsLogoutConfirmOpen(true);
      return;
    }
    setCurrentPage(itemId);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutConfirmOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
  };



  const handleLogoutCancel = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleSavePost = async () => {
    if (!form.title || !form.content || !form.date) {
      alert("Please fill in all required fields");
      return;
    }

    const method = selectedPostIndex == null ? 'POST' : "PUT";
    const link = selectedPostIndex == null
      ? 'http://localhost:5000/api/posts'
      : `http://localhost:5000/api/posts/${form._id}`;

    try {
      const response = await fetch(link, {
        method,
        headers: {
          'Content-Type': 'application/json',
          "authorization": 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Form created successfully');
        setTimeout(() => navigate('/userDashboard'), 2000);
      } else {
        toast.error(data.message || 'Erreur lors de creation.');
      }
    } catch (err) {
      toast.error('Erreur de réseau.');
    }

    const postData = {
      ...form,
      color: form.platform === "other" ? form.color : platformColors[form.platform]
    };

    const updatedPosts = [...posts];
    if (selectedPostIndex !== null) updatedPosts[selectedPostIndex] = postData;
    else updatedPosts.push(postData);

    setPosts(updatedPosts);
    setForm({
      date: "",
      title: "",
      content: "",
      platform: "instagram",
      customPlatform: "",
      color: "#E4405F",
      mediaType: "image"
    });
    setIsDialogOpen(false);
    setSelectedPostIndex(null);
  };

  const handleEditPost = (index) => {
    setForm(posts[index]);
    setSelectedPostIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeletePost = async (index) => {
    try {
      const response = await fetch("http://localhost:5000/api/posts/" + index, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          "authorization": 'Bearer ' + localStorage.getItem("token")
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Form deleted successfully');
        setTimeout(() => navigate('/userDashboard'), 2000);
      } else {
        toast.error(data.message || 'Erreur lors de delete.');
      }
    } catch (err) {
      toast.error('Erreur de réseau.');
    }

    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);
    setShowPostDetails(null);
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
        return (
          <CalendarView
            posts={posts}
            currentMonth={currentMonth}
            currentYear={currentYear}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            setShowPostDetails={setShowPostDetails}
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
          />
        );
      case "history":
        return (
          <HistoryView
            posts={posts}
            filters={filters}
            setIsHistoryFilterOpen={setIsHistoryFilterOpen}
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
          />
        );
      case "alerts":
        return <NotificationsPage />;
      case "settings":
        return renderPlaceholderView("settings");
      case "profile":
        return <UserProfile />;
      case "chatbot":
        return <ChatBot />;
      case "scriptgenerator":
        return <ScriptGenerator />;
      case "CalendarIdeas":
        return <CalendarIdeas />;
      case "captiongenerator":
        return <CaptionGenerator />;
      //  case "strategytips":
      // return <StrategyTips />;


      default:
        return (
          <CalendarView
            posts={posts}
            currentMonth={currentMonth}
            currentYear={currentYear}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            setShowPostDetails={setShowPostDetails}
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`${isSidebarExpanded ? 'w-60' : 'w-20'
          } bg-gray-800 h-screen flex flex-col items-center transition-all duration-300 ease-in-out`}
      >
        {/* Toggle Button + Menu Items Container */}
        <nav className="w-full flex-1 flex flex-col items-center space-y-2 mt-4">
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="text-white hover:text-blue-400 p-2 rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Menu Items */}
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSidebarItemClick(item.id)}
                className={`flex items-center ${isSidebarExpanded ? 'justify-start px-4' : 'justify-center'
                  } w-full p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-700 text-blue-400' : 'text-white hover:bg-gray-700 hover:text-blue-300'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {isSidebarExpanded && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>




      {/* Main Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <img src="/Images/Planifya-v2.png" alt="logo" className="h-10 w-auto" />
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-96 px-4 py-2 rounded-full bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg text-sm font-medium"
            >
              + Create Post
            </button>
          </div>
        </header>


        {renderCurrentPage()}


        <PostDetailsModal
          showPostDetails={showPostDetails}
          setShowPostDetails={setShowPostDetails}
        />

        <PostForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          form={form}
          setForm={setForm}
          selectedPostIndex={selectedPostIndex}
          setSelectedPostIndex={setSelectedPostIndex}
          handleSavePost={handleSavePost}
        />

        <HistoryFilterModal
          isHistoryFilterOpen={isHistoryFilterOpen}
          setIsHistoryFilterOpen={setIsHistoryFilterOpen}
          filters={filters}
          setFilters={setFilters}
        />
      </main>

      {/* Logout Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={handleLogoutCancel} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleLogoutConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
