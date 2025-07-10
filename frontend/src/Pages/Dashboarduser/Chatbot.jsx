import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { chatStrategy, clearGeneratedContent } from '../../features/aiSlice';

const ChatBot = () => {
  const dispatch = useDispatch();
  const { generatedContent, loading, error } = useSelector((state) => state.ai);

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const activeChat = conversations.find((c) => c.id === activeChatId);

  // Fetch conversation history on component mount
  useEffect(() => {
    fetchConversationHistory();
  }, []);

  const fetchConversationHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem('token');
      
      // Fetch conversations list
      const conversationsResponse = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (conversationsResponse.ok) {
        const conversationsData = await conversationsResponse.json();
        
        // Format conversations for the UI
        const formattedConversations = await Promise.all(
          conversationsData.conversations.map(async (conv) => {
            try {
              // Fetch messages for each conversation
              const messagesResponse = await fetch(`/api/conversations/${conv._id}/messages`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (messagesResponse.ok) {
                const messagesData = await messagesResponse.json();
                return {
                  id: conv._id,
                  name: conv.title,
                  messages: messagesData.messages.map(msg => ({
                    sender: msg.role === 'user' ? 'user' : 'bot',
                    text: msg.message,
                    timestamp: msg.timestamp
                  })),
                  createdAt: conv.createdAt,
                  isLocal: false
                };
              }
              return null;
            } catch (error) {
              console.error('Error fetching messages for conversation:', conv._id, error);
              return null;
            }
          })
        );

        // Filter out null conversations and sort by creation date
        const validConversations = formattedConversations
          .filter(conv => conv !== null)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setConversations(validConversations);
        
        // Set the most recent conversation as active if exists
        if (validConversations.length > 0) {
          setActiveChatId(validConversations[0].id);
          setCurrentConversationId(validConversations[0].id);
        } else {
          // Create a welcome conversation if no history exists
          handleNewChat();
        }
      } else {
        throw new Error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      toast.error('Failed to load conversation history');
      // Fallback to default welcome chat
      handleNewChat();
    } finally {
      setLoadingHistory(false);
    }
  };

  // Handle AI response from Redux
  useEffect(() => {
    if (generatedContent) {
      // Add AI response to current conversation
      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { 
                ...chat, 
                messages: [...chat.messages, { 
                  sender: 'bot', 
                  text: generatedContent.result || generatedContent,
                  timestamp: new Date().toISOString()
                }] 
              }
            : chat
        )
      );
      
      // Update conversation ID if it's a new conversation
      if (generatedContent.conversationId && !currentConversationId) {
        setCurrentConversationId(generatedContent.conversationId);
        // Update the conversation ID in the conversations list
        setConversations((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, id: generatedContent.conversationId, isLocal: false }
              : chat
          )
        );
        setActiveChatId(generatedContent.conversationId);
      }
      
      dispatch(clearGeneratedContent());
    }
  }, [generatedContent, activeChatId, dispatch, currentConversationId]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  useEffect(() => {
    const closeMenus = () => setMenuOpenId(null);
    window.addEventListener('click', closeMenus);
    return () => window.removeEventListener('click', closeMenus);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      sender: 'user', 
      text: input,
      timestamp: new Date().toISOString()
    };
    
    // Add user message to UI immediately
    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    // Send to backend via Redux action
    const messageData = {
      message: input,
      conversationId: currentConversationId || (activeChat?.isLocal ? null : activeChatId)
    };

    dispatch(chatStrategy(messageData));
    setInput('');
  };

  const handleNewChat = () => {
    const newId = 'new-chat-' + Date.now();
    const newChat = {
      id: newId,
      name: 'New Chat',
      messages: [{ 
        sender: 'bot', 
        text: 'Hello! How can I help you with your content strategy today?',
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      isLocal: true
    };
    
    setConversations([newChat, ...conversations]);
    setActiveChatId(newId);
    setCurrentConversationId(null);
  };

  const handleDelete = async (idToDelete) => {
    const chatToDelete = conversations.find(c => c.id === idToDelete);
    
    if (chatToDelete?.isLocal) {
      // For local conversations, just remove from state
      setConversations(prev => prev.filter(c => c.id !== idToDelete));
      if (activeChatId === idToDelete) {
        const remainingChats = conversations.filter(c => c.id !== idToDelete);
        if (remainingChats.length > 0) {
          setActiveChatId(remainingChats[0].id);
          setCurrentConversationId(remainingChats[0].isLocal ? null : remainingChats[0].id);
        } else {
          handleNewChat();
        }
      }
      toast.success('Chat deleted');
      return;
    }

    // For backend conversations, delete from server
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversations/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== idToDelete));
        if (activeChatId === idToDelete) {
          const remainingChats = conversations.filter(c => c.id !== idToDelete);
          if (remainingChats.length > 0) {
            setActiveChatId(remainingChats[0].id);
            setCurrentConversationId(remainingChats[0].isLocal ? null : remainingChats[0].id);
          } else {
            handleNewChat();
          }
        }
        toast.success('Chat deleted');
      } else {
        throw new Error('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
    }
  };

  const handleRename = async (idToRename, newName) => {
    if (!newName.trim()) {
      setEditingChatId(null);
      return;
    }

    const chatToRename = conversations.find(c => c.id === idToRename);
    
    if (chatToRename?.isLocal) {
      // For local conversations, just update locally
      setConversations(prev =>
        prev.map(c => (c.id === idToRename ? { ...c, name: newName } : c))
      );
      setEditingChatId(null);
      toast.success('Chat renamed');
      return;
    }

    // For backend conversations, update on server
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversations/${idToRename}/title`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newName }),
      });

      if (response.ok) {
        setConversations(prev =>
          prev.map(c => (c.id === idToRename ? { ...c, name: newName } : c))
        );
        setEditingChatId(null);
        toast.success('Chat renamed');
      } else {
        throw new Error('Failed to rename conversation');
      }
    } catch (error) {
      console.error('Error renaming conversation:', error);
      toast.error('Failed to rename conversation');
    }
  };

  const handleShare = (idToShare) => {
    const chatToShare = conversations.find(c => c.id === idToShare);
    if (!chatToShare) return;
    
    const shareText = chatToShare.messages
      .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');
    
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('Chat content copied to clipboard!');
    });
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    const selectedChat = conversations.find(c => c.id === chatId);
    setCurrentConversationId(selectedChat?.isLocal ? null : chatId);
  };

  // Enhanced bot message formatting with better styling
  const formatBotMessage = (text) => {
    // Split text into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph is a list item
      if (paragraph.includes('\n-') || paragraph.includes('\n•')) {
        const lines = paragraph.split('\n');
        const title = lines[0];
        const listItems = lines.slice(1).filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
        
        return (
          <div key={index} className="mb-4">
            {title && <p className="font-semibold text-slate-100 mb-3 text-sm">{title}</p>}
            <ul className="space-y-2 ml-1">
              {listItems.map((item, i) => (
                <li key={i} className="text-slate-200 flex items-start text-sm leading-relaxed">
                  <span className="text-emerald-400 mr-3 mt-1 text-xs">▶</span>
                  <span>{item.replace(/^[-•]\s*/, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }
      
      // Check if paragraph contains code blocks
      if (paragraph.includes('```') || paragraph.includes('`')) {
        const codeRegex = /```([\s\S]*?)```|`([^`]+)`/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        while ((match = codeRegex.exec(paragraph)) !== null) {
          // Add text before code block
          if (match.index > lastIndex) {
            parts.push(paragraph.slice(lastIndex, match.index));
          }
          
          // Add code block
          const isBlock = match[1] !== undefined;
          const code = match[1] || match[2];
          
          if (isBlock) {
            parts.push(
              <div key={match.index} className="bg-slate-900 border border-slate-600 rounded-lg p-3 my-2 font-mono text-sm">
                <pre className="text-emerald-300 whitespace-pre-wrap">{code}</pre>
              </div>
            );
          } else {
            parts.push(
              <code key={match.index} className="bg-slate-700 px-2 py-1 rounded text-emerald-300 font-mono text-sm">
                {code}
              </code>
            );
          }
          
          lastIndex = codeRegex.lastIndex;
        }
        
        // Add remaining text
        if (lastIndex < paragraph.length) {
          parts.push(paragraph.slice(lastIndex));
        }
        
        return (
          <div key={index} className="mb-4">
            {parts.map((part, i) => 
              typeof part === 'string' ? (
                <span key={i} className="text-slate-200 text-sm leading-relaxed">{part}</span>
              ) : part
            )}
          </div>
        );
      }
      
      // Check if paragraph is a heading
      if (paragraph.startsWith('# ') || paragraph.startsWith('## ') || paragraph.startsWith('### ')) {
        const level = paragraph.match(/^#+/)[0].length;
        const text = paragraph.replace(/^#+\s*/, '');
        const headingClass = {
          1: 'text-lg font-bold text-slate-100 mb-3',
          2: 'text-base font-semibold text-slate-100 mb-2',
          3: 'text-sm font-medium text-slate-200 mb-2'
        }[level] || 'text-sm font-medium text-slate-200 mb-2';
        
        return (
          <h3 key={index} className={headingClass}>
            {text}
          </h3>
        );
      }
      
      // Regular paragraph with enhanced styling
      return (
        <p key={index} className="text-slate-200 leading-relaxed mb-3 last:mb-0 text-sm">
          {paragraph}
        </p>
      );
    });
  };

  if (loadingHistory) {
    return (
      <div className="flex h-screen bg-slate-900 text-slate-300 font-sans overflow-hidden items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading conversation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-300 font-sans overflow-hidden">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <button 
          onClick={handleNewChat} 
          className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-indigo-700 transition"
        >
          <PlusIcon className="w-5 h-5 text-indigo-400" /> New Chat
        </button>
        
        <div className="flex-1 overflow-y-auto mt-2 space-y-1">
          {conversations.map((conv) => (
            <div 
              key={conv.id} 
              className={`group relative flex justify-between items-center px-4 py-3 text-sm hover:bg-slate-700 cursor-pointer ${
                conv.id === activeChatId ? 'bg-slate-700 text-indigo-300 font-semibold' : 'text-slate-300'
              }`} 
              onClick={() => handleChatSelect(conv.id)}
            >
              <div onClick={(e) => e.stopPropagation()} className="flex-1 truncate">
                {editingChatId === conv.id ? (
                  <input 
                    autoFocus 
                    type="text" 
                    defaultValue={conv.name} 
                    onBlur={(e) => handleRename(conv.id, e.target.value)} 
                    onKeyDown={(e) => { 
                      if (e.key === 'Enter') handleRename(conv.id, e.target.value); 
                      if (e.key === 'Escape') setEditingChatId(null);
                    }} 
                    className="w-full bg-slate-700 text-white px-2 py-1 rounded outline-none" 
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="truncate">{conv.name}</span>
                    {conv.isLocal && (
                      <span className="text-xs text-indigo-400" title="New conversation">●</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="relative" onClick={(e) => { 
                e.stopPropagation(); 
                setMenuOpenId(menuOpenId === conv.id ? null : conv.id); 
              }}>
                <button className="p-1 rounded hover:bg-slate-600">
                  <EllipsisVerticalIcon className="w-5 h-5 text-slate-400" />
                </button>
                
                {menuOpenId === conv.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-600 rounded shadow-lg z-10 text-sm">
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
                      onClick={() => {
                        handleDelete(conv.id);
                        setMenuOpenId(null);
                      }} 
                      className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-red-400"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => {
                        handleShare(conv.id);
                        setMenuOpenId(null);
                      }} 
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

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <h1 className="text-xl font-medium truncate">
            {activeChat?.name || 'Select a chat'}
          </h1>
          {activeChat?.isLocal && (
            <span className="text-sm text-indigo-400">New Chat</span>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900">
          {activeChat?.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'user' ? (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl px-4 py-3 max-w-2xl text-sm shadow-xl">
                  {msg.text}
                </div>
              ) : (
                <div className="flex items-start gap-4 max-w-4xl">
                  {/* Enhanced Bot Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-emerald-400/20">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 21H5V3H13V9H19V21Z" />
                    </svg>
                  </div>
                  
                  {/* Enhanced Bot Message Container */}
                  <div className="relative">
                    {/* Message bubble with glassmorphism effect */}
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-600/50 rounded-2xl rounded-tl-md shadow-2xl overflow-hidden">
                      {/* Top accent bar */}
                      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                      
                      {/* Message content */}
                      <div className="p-5">
                        <div className="prose prose-sm max-w-none">
                          {formatBotMessage(msg.text)}
                        </div>
                      </div>
                      
                      {/* Bottom section with timestamp */}
                      <div className="px-5 py-3 bg-slate-800/50 border-t border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-slate-400 font-medium">AI Assistant</span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Message tail */}
                    <div className="absolute top-6 -left-2 w-4 h-4 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-l border-t border-slate-600/50 rounded-tl-md transform rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-4 max-w-4xl">
                {/* Bot Avatar */}
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-emerald-400/20">
                  <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                  </svg>
                </div>
                
                {/* Enhanced Loading Message */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-600/50 rounded-2xl rounded-tl-md shadow-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                    <div className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-slate-300 text-sm font-medium">AI is generating response...</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-6 -left-2 w-4 h-4 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-l border-t border-slate-600/50 rounded-tl-md transform rotate-45"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-slate-700 bg-slate-800 flex items-center gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Type a message..." 
            disabled={loading || !activeChat} 
            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white disabled:opacity-50" 
          />
          <button 
            onClick={handleSend} 
            disabled={loading || !activeChat} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:bg-indigo-800 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </footer>
      </main>
    </div>
  );
};

export default ChatBot;