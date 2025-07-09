import React, { useState, useRef, useEffect } from 'react';
import {
  PlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import apiClient from '../../lib/axios';
const ChatBot = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Welcome ',
      messages: [{ sender: 'bot', text: 'Hello! How can I help you today?' }],
    },
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const handleSend = async () => {
    if (!input.trim()) return;
    conversations.push(input);
    setConversations(conversations);
    try {
      const response = await apiClient.post("/ai/strategy-chat", {
        message: input
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data && response.data.result) {
      const updatedBotResponse = updatedUserMessage.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, { sender: 'bot', text: response.data.result }],
            }
          : chat
      );
      setConversations(updatedBotResponse);
    } else {
      console.log("Failed to generate script. The response was empty.");
    }
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


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeChatId]);

  useEffect(() => {
    const closeMenus = () => {
      setMenuOpenId(null);
    };
    window.addEventListener('click', closeMenus);
    return () => window.removeEventListener('click', closeMenus);
  }, []);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-300 font-sans overflow-hidden">
      {/* Sidebar */}
      {/* <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
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
              className={`group relative flex justify-between items-center px-4 py-3 text-sm hover:bg-slate-700 cursor-pointer ${conv.id === activeChatId
                ? 'bg-slate-700 text-indigo-300 font-semibold'
                : 'text-slate-300'
                }`}
              onClick={() => setActiveChatId(conv.id)}
            >
              <div onClick={(e) => e.stopPropagation()} className="flex-1">
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
      </aside> */}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <h1 className="text-xl font-medium truncate">{activeChat?.name}</h1>
          {/* Profile icon and dropdown removed */}
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900">
          {activeChat?.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`rounded-xl px-4 py-3 max-w-md text-sm shadow ${msg.sender === 'user'
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
};

export default ChatBot;
