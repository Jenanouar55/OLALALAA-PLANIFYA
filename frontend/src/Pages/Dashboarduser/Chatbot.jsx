import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PlusIcon, EllipsisVerticalIcon, Loader2 } from 'lucide-react';
import { chatStrategy } from '../../features/aiSlice';
import {
  fetchConversations,
  fetchMessages,
  setActiveConversation,
  deleteConversation,
  renameConversation
} from '../../features/chatSlice';

const ChatBot = () => {
  const dispatch = useDispatch();

  const {
    conversations,
    activeConversationMessages,
    activeConversationId,
    loading: chatLoading,
    error: chatError
  } = useSelector((state) => state.chat);

  const {
    loading: messageSending,
    error: aiError
  } = useSelector((state) => state.ai);

  const [input, setInput] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchConversations()).unwrap().then((fetchedConversations) => {
      if (fetchedConversations.length > 0 && !activeConversationId) {
        dispatch(fetchMessages(fetchedConversations[0]._id));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const anyError = chatError || aiError;
    if (anyError) {
      toast.error(`Error: ${anyError}`);
    }
  }, [chatError, aiError]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationMessages]);

  useEffect(() => {
    const closeMenus = () => setMenuOpenId(null);
    window.addEventListener('click', closeMenus);
    return () => window.removeEventListener('click', closeMenus);
  }, []);

  const handleSelectChat = (conversationId) => {
    if (conversationId === activeConversationId) return;
    dispatch(fetchMessages(conversationId));
  };

  const handleNewChat = () => {
    dispatch(setActiveConversation(null));
  };

  const handleSend = () => {
    if (!input.trim() || messageSending) return;
    dispatch(chatStrategy({ message: input, conversationId: activeConversationId }));
    setInput('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      dispatch(deleteConversation(id)).unwrap()
        .then(() => toast.success("Chat deleted successfully"))
        .catch((err) => toast.error(err.message || "Failed to delete chat"));
    }
  };

  const handleStartRename = (conv) => {
    setEditingChatId(conv._id);
    setRenameValue(conv.title);
    setMenuOpenId(null);
  };

  const handleConfirmRename = (e) => {
    e.preventDefault();
    if (!renameValue.trim() || !editingChatId) {
      setEditingChatId(null);
      return;
    }
    dispatch(renameConversation({ conversationId: editingChatId, title: renameValue })).unwrap()
      .then(() => {
        toast.success("Chat renamed");
        setEditingChatId(null);
      })
      .catch((err) => toast.error(err.message || "Failed to rename chat"));
  };

  const handleShare = (id) => {
    const chatToShare = conversations.find(c => c._id === id);
    if (!chatToShare) return;
    navigator.clipboard.writeText(JSON.stringify(chatToShare, null, 2)).then(() => {
      toast.success('Chat data copied to clipboard!');
    });
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-300 font-sans overflow-hidden">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <button onClick={handleNewChat} className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-indigo-700 transition">
          <PlusIcon className="w-5 h-5 text-indigo-400" /> New Chat
        </button>
        <div className="flex-1 overflow-y-auto mt-2 space-y-1">
          {chatLoading.conversations ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
          ) : (
            conversations.map((conv) => (
              <div key={conv._id} className={`group relative flex justify-between items-center px-4 py-3 text-sm hover:bg-slate-700 cursor-pointer ${conv._id === activeConversationId ? 'bg-slate-700 text-indigo-300 font-semibold' : 'text-slate-300'}`} onClick={() => handleSelectChat(conv._id)}>
                {editingChatId === conv._id ? (
                  <form onSubmit={handleConfirmRename} className="flex-1">
                    <input autoFocus type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={handleConfirmRename} className="w-full bg-slate-700 text-white px-2 py-1 rounded outline-none" />
                  </form>
                ) : (
                  <span className="truncate">{conv.title}</span>
                )}
                {editingChatId !== conv._id && (
                  <div className="relative" onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === conv._id ? null : conv._id); }}>
                    <button className="p-1 rounded hover:bg-slate-600"><EllipsisVerticalIcon className="w-5 h-5 text-slate-400" /></button>
                    {menuOpenId === conv._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-600 rounded shadow-lg z-10 text-sm">
                        <button onClick={(e) => { e.stopPropagation(); handleStartRename(conv); }} className="block w-full text-left px-4 py-2 hover:bg-slate-700">Rename</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(conv._id); }} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-red-400">Delete</button>
                        <button onClick={(e) => { e.stopPropagation(); handleShare(conv._id); }} className="block w-full text-left px-4 py-2 hover:bg-slate-700">Share</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <h1 className="text-xl font-medium truncate">{conversations.find(c => c._id === activeConversationId)?.title || 'New Chat'}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900">
          {chatLoading.messages ? (
            <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin w-8 h-8 text-indigo-400" /></div>
          ) : (
            activeConversationMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-xl px-4 py-3 max-w-2xl text-sm shadow ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>
                  {msg.message}
                </div>
              </div>
            ))
          )}
          {messageSending && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-3 bg-slate-800 border border-slate-700 text-slate-300">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <footer className="p-4 border-t border-slate-700 bg-slate-800 flex items-center gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." disabled={messageSending} className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white disabled:opacity-50" />
          <button onClick={handleSend} disabled={messageSending || !input} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:bg-indigo-800 disabled:cursor-not-allowed">
            {messageSending ? 'Sending...' : 'Send'}
          </button>
        </footer>
      </main>
    </div>
  );
};

export default ChatBot;
