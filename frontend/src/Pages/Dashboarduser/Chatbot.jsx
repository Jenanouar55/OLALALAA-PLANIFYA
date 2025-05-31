import React, { useState, useRef, useEffect } from 'react';
import {
  PlusIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const ChatBot = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Welcome Habibi',
      messages: [{ sender: 'bot', text: 'Hello! How can I help you today?' }],
    },
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Sidebar menu and edit state
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);

  // Profile dropdown open state
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const handleSend = () => {
    if (!input.trim()) return;

    const updated = conversations.map((chat) =>
      chat.id === activeChatId
        ? {
            ...chat,
            messages: [...chat.messages, { sender: 'user', text: input }],
          }
        : chat
    );
    setConversations(updated);
    setInput('');

    setTimeout(() => {
      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { sender: 'bot', text: `You said: "${input}"` },
                ],
              }
            : chat
        )
      );
    }, 600);
  };

  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = {
      id: newId,
      name: `Chat ${conversations.length + 1}`,
      messages: [{ sender: 'bot', text: 'New chat started. Ask anything!' }],
    };
    setConversations([newChat, ...conversations]);
    setActiveChatId(newId);
  };

  const handleRename = (id, newName) => {
    if (!newName.trim()) return;
    setConversations(
      conversations.map((chat) =>
        chat.id === id ? { ...chat, name: newName } : chat
      )
    );
    setEditingChatId(null);
  };

  const handleDelete = (id) => {
    const filtered = conversations.filter((chat) => chat.id !== id);
    setConversations(filtered);
    setMenuOpenId(null);
    if (id === activeChatId && filtered.length > 0) {
      setActiveChatId(filtered[0].id);
    } else if (filtered.length === 0) {
      handleNewChat();
    }
  };

  const handleShare = (id) => {
    const chat = conversations.find((c) => c.id === id);
    alert(`Sharing chat "${chat.name}" (mock action)`);
    setMenuOpenId(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Close menu on outside click for sidebar menu and profile menu
  useEffect(() => {
    const closeMenus = () => {
      setMenuOpenId(null);
      setProfileMenuOpen(false);
    };
    window.addEventListener('click', closeMenus);
    return () => window.removeEventListener('click', closeMenus);
  }, []);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-2 font-semibold text-lg border-b border-slate-700 flex items-center justify-center">
          <img src="/Images/Planifya-v2.png" alt="logo" className="h-8" />
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-indigo-700 transition"
        >
          <PlusIcon className="w-5 h-5 text-indigo-400" />
          New Chat
        </button>
        <div className="flex-1 overflow-y-auto mt-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group relative flex justify-between items-center px-4 py-3 text-sm hover:bg-slate-700 cursor-pointer ${
                conv.id === activeChatId
                  ? 'bg-slate-700 text-indigo-300 font-semibold'
                  : 'text-slate-300'
              }`}
              onClick={() => setActiveChatId(conv.id)}
            >
              {/* Chat title or input */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                {editingChatId === conv.id ? (
                  <input
                    autoFocus
                    type="text"
                    defaultValue={conv.name}
                    onBlur={(e) => handleRename(conv.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRename(conv.id, e.target.value);
                      }
                    }}
                    className="w-full bg-slate-700 text-white px-2 py-1 rounded outline-none"
                  />
                ) : (
                  conv.name
                )}
              </div>

              {/* Dropdown Button */}
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                }}
              >
                <button className="p-1 rounded hover:bg-slate-600">
                  <EllipsisVerticalIcon className="w-5 h-5 text-slate-400" />
                </button>

                {menuOpenId === conv.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-600 rounded shadow z-10 text-sm">
                    <button
                      onClick={() => {
                        setEditingChatId(conv.id);
                        setMenuOpenId(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(conv.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-red-400"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleShare(conv.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200"
                    >
                      Share
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <h1 className="text-xl font-medium">{activeChat?.name}</h1>

          {/* Profile, Settings, Logout */}
          <div
            className="relative"
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen(!profileMenuOpen);
            }}
          >
            <div className="flex items-center cursor-pointer select-none space-x-2">
              <UserCircleIcon className="w-8 h-8 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">
                You
              </span>
            </div>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-600 rounded shadow z-20 text-sm">
                <button
                  onClick={() => {
                    alert('Profile clicked (mock)');
                    setProfileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    alert('Settings clicked (mock)');
                    setProfileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-1"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    alert('Logout clicked (mock)');
                    setProfileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-red-400 flex items-center gap-1"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900">
          {activeChat?.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-xl px-4 py-3 max-w-md text-sm shadow ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-300'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <footer className="p-4 border-t border-slate-700 bg-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            Send
          </button>
        </footer>
      </main>
    </div>
  );
};

export default ChatBot;
