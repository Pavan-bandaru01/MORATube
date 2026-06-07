"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import VideoCard from "./VideoCard";
import type { Video } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  relatedVideos?: Video[];
}

const suggestedPrompts = [
  "How can I stop impulse spending?",
  "What is the 50/30/20 budget rule?",
  "Explain mutual funds to a beginner",
  "How can I use AI to learn coding?",
];

export default function AIChat({ suggestedVideos }: { suggestedVideos?: Video[] }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm the MORA AI Assistant. I can help you understand money behavior, explain finance concepts simply, suggest AI tools, or recommend videos based on your goals. What would you like to learn today?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        relatedVideos: suggestedVideos?.slice(0, 2), // We still mock related videos for MVP
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error connecting to my brain. Please make sure you are signed in and have configured the OpenAI API key.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] glass rounded-3xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold">MORA Assistant</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
            </p>
          </div>
        </div>
        <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition text-gray-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> New Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-zinc-800' : 'bg-red-600'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            
            <div className="space-y-4 w-full">
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 text-white rounded-tr-sm' 
                  : 'glass text-gray-200 rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              
              {msg.relatedVideos && msg.relatedVideos.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {msg.relatedVideos.map(video => (
                    <div key={video.id} className="scale-95 origin-left">
                      <VideoCard video={video} layout="grid" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4 max-w-3xl">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin text-red-500" /> 
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 border-t border-white/10">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {suggestedPrompts.map(prompt => (
              <button 
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs text-gray-300 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="max-w-4xl mx-auto relative flex items-center"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about money, AI, or growth..."
            className="w-full bg-zinc-900 border border-white/10 focus:border-red-500/50 rounded-full pl-6 pr-14 py-4 outline-none transition"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-gray-500 text-white p-2.5 rounded-full transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-500 mt-3">
          MORA AI can make mistakes. Remember this is for educational awareness, not financial advice.
        </p>
      </div>
    </div>
  );
}
