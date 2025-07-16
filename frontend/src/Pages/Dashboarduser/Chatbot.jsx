import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Plus, MoreVertical, Loader2, Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
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

  const conversations = useSelector((state) => state.chat.conversations);
  const activeConversationId = useSelector((state) => state.chat.activeConversationId);
  const activeConversationMessages = useSelector(
    (state) => state.chat.activeConversationMessages);
  const chatError = useSelector((state) => state.chat.error);
  const chatLoading = useSelector((state) => state.chat.loading); // Added missing chatLoading selector

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

    dispatch(chatStrategy({ message: input, conversationId: activeConversationId }))
      .unwrap()
      .then(() => {
        console.log("Message sent and assistant replied");
      })
      .catch((err) => {
        console.error("Chat strategy failed", err);
      });

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

  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message).then(() => {
      toast.success('Message copied to clipboard!');
    });
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 px-6 py-4">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 font-sans overflow-hidden">
      <aside className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
        <button onClick={handleNewChat} className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 rounded-lg mx-2 mt-2">
          <Plus className="w-5 h-5 text-indigo-400" /> New Chat
        </button>
        <div className="flex-1 overflow-y-auto mt-2 space-y-1 px-2">
          {chatLoading?.conversations ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
          ) : (
            conversations.map((conv) => (
              <div key={conv._id} className={`group relative flex justify-between items-center px-4 py-3 text-sm hover:bg-slate-700/50 cursor-pointer rounded-lg transition-all duration-200 ${conv._id === activeConversationId ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-slate-300'}`} onClick={() => handleSelectChat(conv._id)}>
                {editingChatId === conv._id ? (
                  <div className="flex-1">
                    <input autoFocus type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={handleConfirmRename} onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename(e)} className="w-full bg-slate-700/50 text-white px-2 py-1 rounded outline-none backdrop-blur-sm" />
                  </div>
                ) : (
                  <span className="truncate">{conv.title}</span>
                )}
                {editingChatId !== conv._id && (
                  <div className="relative" onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === conv._id ? null : conv._id); }}>
                    <button className="p-1 rounded hover:bg-slate-600/50"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
                    {menuOpenId === conv._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-xl z-10 text-sm">
                        <button onClick={(e) => { e.stopPropagation(); handleStartRename(conv); }} className="block w-full text-left px-4 py-2 hover:bg-slate-700/50 rounded-t-lg">Rename</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(conv._id); }} className="block w-full text-left px-4 py-2 hover:bg-slate-700/50 text-red-400">Delete</button>
                        <button onClick={(e) => { e.stopPropagation(); handleShare(conv._id); }} className="block w-full text-left px-4 py-2 hover:bg-slate-700/50 rounded-b-lg">Share</button>
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
        <header className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
          <h1 className="text-xl font-medium truncate bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {conversations.find(c => c._id === activeConversationId)?.title || 'New Chat'}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {chatLoading?.messages ? (
            <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin w-8 h-8 text-indigo-400" /></div>
          ) : (
            activeConversationMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-4xl ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-500 to-blue-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`group relative rounded-2xl px-5 py-4 text-sm shadow-xl border transition-all duration-200 hover:shadow-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-500/30' : 'bg-white/10 backdrop-blur-sm border-white/20 text-slate-100'}`}>
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.message}</div>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => handleCopyMessage(msg.message)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                          title="Copy message"
                        >
                          <Copy className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                        </button>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                          title="Good response"
                        >
                          <ThumbsUp className="w-4 h-4 text-slate-400 hover:text-green-400" />
                        </button>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                          title="Bad response"
                        >
                          <ThumbsDown className="w-4 h-4 text-slate-400 hover:text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {messageSending && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        <footer className="p-4 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="Type your message..." 
              disabled={messageSending} 
              className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 disabled:opacity-50 transition-all duration-200" 
            />
            <button 
              onClick={handleSend} 
              disabled={messageSending || !input.trim()} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
            >
              {messageSending ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ChatBot;