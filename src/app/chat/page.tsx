'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Send, Bot, User, Plane, MessageSquare, Sparkles, Trash2 } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  'What are the best hidden gems in Tokyo?',
  'Suggest a 3-day Paris itinerary under $500',
  'What should I pack for a beach trip to Bali?',
  'Find family-friendly restaurants in Rome',
  'Best time to visit Santorini?',
  'Budget tips for traveling in Southeast Asia',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm **TripMind AI**, your intelligent travel assistant powered by Gemini.\n\nI can help you:\n- 🗺️ Plan and optimize itineraries\n- 💡 Discover hidden gems\n- 💰 Find budget-friendly options\n- 🌍 Answer any travel questions\n\nWhere would you like to go?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: generateId(), role: 'user', content: userText, timestamp: new Date().toISOString(),
    };
    const aiMsg: ChatMessage = {
      id: generateId(), role: 'assistant', content: '', timestamp: new Date().toISOString(), isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) throw new Error('Chat failed');
      const data = await res.json();

      setMessages(prev => prev.map(m => m.id === aiMsg.id
        ? { ...m, content: data.response, isStreaming: false }
        : m
      ));
    } catch {
      setMessages(prev => prev.map(m => m.id === aiMsg.id
        ? { ...m, content: '❌ Sorry, I encountered an error. Please check your API configuration and try again.', isStreaming: false }
        : m
      ));
      toast.error('Chat error — check API key');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome', role: 'assistant',
      content: "Chat cleared! 🧹 How can I help you plan your next adventure?",
      timestamp: new Date().toISOString(),
    }]);
    toast.success('Chat cleared');
  };

  return (
    <main className="min-h-screen animated-gradient flex flex-col">
      {/* Header */}
      <header className="glass-card border-b border-white/5 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-white/50 hover:text-white transition-colors" aria-label="Back">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00d4ff] flex items-center justify-center">
            <Bot size={20} className="text-[#020408]" />
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-lg gradient-text">TripMind AI Chat</h1>
            <div className="flex items-center gap-2">
              <div className="pulse-dot" />
              <span className="text-white/50 text-xs">Powered by Gemini · Online</span>
            </div>
          </div>
          <button onClick={clearChat} className="text-white/30 hover:text-white/60 transition-colors p-2 rounded-lg hover:bg-white/5"
            aria-label="Clear chat">
            <Trash2 size={18} />
          </button>
          <Link href="/planner" className="btn-neon text-xs py-2 px-4 flex items-center gap-1 hidden sm:flex">
            <Plane size={12} className="rotate-45" /> Plan Trip
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6" role="log" aria-label="Chat messages" aria-live="polite">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-[#00ff87] to-[#00d4ff]'
                  : 'bg-gradient-to-br from-[#8b5cf6] to-[#00d4ff]'
              }`}>
                {msg.role === 'assistant'
                  ? <Bot size={14} className="text-[#020408]" />
                  : <User size={14} className="text-white" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#8b5cf6]/20 to-[#00d4ff]/20 border border-[#8b5cf6]/30 rounded-tr-sm'
                  : 'glass-card border border-white/8 rounded-tl-sm'
              }`}>
                {msg.isStreaming ? (
                  <div className="typing-dots py-1">
                    <span /><span /><span />
                  </div>
                ) : msg.role === 'assistant' ? (
                  <div className="prose-ai text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-white text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
                <span className="text-white/20 text-xs mt-2 block">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <p className="text-white/30 text-xs mb-2 flex items-center gap-1">
              <Sparkles size={10} /> Try asking...
            </p>
            <div className="flex gap-2 flex-wrap">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="glass-card border border-white/10 text-white/60 text-xs px-3 py-2 rounded-full hover:border-[#00ff87]/30 hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass-card border-t border-white/5 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about destinations, itineraries, budgets..."
              rows={1}
              disabled={loading}
              className="input-dark resize-none min-h-[48px] max-h-32 py-3 pr-4 overflow-y-auto"
              style={{ height: 'auto' }}
              aria-label="Chat message input"
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 128) + 'px';
              }}
            />
          </div>
          <button
            id="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-neon w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed p-0"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-white/20 text-xs text-center mt-2">
          <MessageSquare size={10} className="inline mr-1" />
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </main>
  );
}
