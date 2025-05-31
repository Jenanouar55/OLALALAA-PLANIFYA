import React, { useState, useRef, useEffect } from 'react';
import {
  PlusIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
} from '@heroicons/react/24/solid';

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

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);

  // Conversation options dropdown (by chat id)
  const [optionsOpenId, setOptionsOpenId] = useState(null);

  const activeChat = conversations.find(c => c.id === activeChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Handle sending message with OpenAI API call
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Add user message locally
    setConversations(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, { sender: 'user', text: userMessage }],
            }
          : chat
      )
    );

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            // Include conversation history
            ...activeChat.messages
              .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
              })),
            { role: 'user', content: userMessage },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const botReply = data.choices[0].message.content;

      // Add bot reply to conversation
      setConversations(prev =>
        prev.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, { sender: 'bot', text: botReply }],
              }
            : chat
        )
      );
    } catch (error) {
      setConversations(prev =>
        prev.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { sender: 'bot', text: `Error: ${error.message}` },
                ],
              }
            : chat
        )
      );
    }
  };

  // New chat
  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = {
      id: newId,
      name: `Chat ${conversations.length + 1}`,
      messages: [{ sender: 'bot', text: 'New chat started. Ask anything!' }],
    };
    setConversations([newChat, ...conversations]);
    setActiveChatId(newId);
    setOptionsOpenId(null);
  };

  // Rename chat
  const handleRenameChat = (id) => {
    const newName = prompt('Enter new chat name:');
    if (newName && newName.trim()) {
      setConversations(prev =>
        prev.map(chat =>
          chat.id === id ? { ...chat, name: newName.trim() } : chat
        )
      );
    }
    setOptionsOpenId(null);
  };

  // Delete chat
  const handleDeleteChat = (id) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      setConversations(prev => prev.filter(chat => chat.id !== id));
      if (activeChatId === id && conversations.length > 1) {
        // Set another chat active if deleted active one
        const otherChats = conversations.filter(chat => chat.id !== id);
        setActiveChatId(otherChats[0].id);
      }
    }
    setOptionsOpenId(null);
  };

  // Share chat (dummy function)
  const handleShareChat = (id) => {
    alert(`Share link for chat ID: ${id} (feature not implemented)`);
    setOptionsOpenId(null);
  };

  // Toggle profile menu
  const toggleProfileMenu = () => setProfileOpen(open => !open);

  // Profile logout (dummy)
  const handleLogout = () => {
    alert('Logged out (not implemented)');
    setProfileOpen(false);
  };

  // Profile settings (dummy)
  const handleSettings = () => {
    alert('Settings (not implemented)');
    setProfileOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-2 font-semibold text-lg border-b border-gray-700 flex items-center gap-2">
          <img src="/Images/Planifya-v2.png" alt="logo" className="h-8" />
          <span>Planifya</span>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5 text-blue-400" />
          New Chat
        </button>
        <div className="flex-1 overflow-y-auto mt-2">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`flex justify-between items-center px-4 py-3 text-sm cursor-pointer hover:bg-blue-700 ${
                conv.id === activeChatId ? 'bg-blue-800 text-blue-300 font-medium' : 'text-gray-300'
              }`}
              onClick={() => setActiveChatId(conv.id)}
            >
              <span className="truncate max-w-[calc(100%-40px)]">{conv.name}</span>
              <div className="relative">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setOptionsOpenId(optionsOpenId === conv.id ? null : conv.id);
                  }}
                  className="p-1 hover:bg-gray-700 rounded"
                  aria-label="Options"
                >
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                </button>
                {optionsOpenId === conv.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                    <button
                      onClick={() => handleRenameChat(conv.id)}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Rename
                    </button>
                    <button
                      onClick={() => handleDeleteChat(conv.id)}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleShareChat(conv.id)}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                    >
                      <ShareIcon className="w-4 h-4" />
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
        <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <h1 className="text-xl font-medium truncate max-w-[70%]">{activeChat?.name}</h1>
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 focus:outline-none"
              aria-label="Profile menu"
            >
              <UserCircleIcon className="w-8 h-8 text-blue-400" />
              <span className="hidden md:block text-sm font-medium text-gray-300">You</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                <button
                  onClick={handleSettings}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {activeChat?.messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xl px-4 py-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-blue-700 self-end text-white' : 'bg-gray-700 self-start text-gray-200'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex border-t border-gray-700 bg-gray-800 p-4"
        >
          <input
            type="text"
            className="flex-1 bg-gray-700 text-gray-200 rounded-l px-4 py-2 focus:outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatBot;
