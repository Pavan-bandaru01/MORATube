"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import type { Video } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "What is SIP?",
  "How to invest ₹5000?",
  "Explain mutual funds",
  "What is compound interest?",
];

function formatAIText(text: string) {
  // Convert **bold** to <strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Convert bullet points
  formatted = formatted.replace(/^[\s]*[-•]\s+/gm, "• ");
  
  return formatted;
}

export default function AIChat({ suggestedVideos }: { suggestedVideos?: Video[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, isLoading]);

  // Typewriter effect
  useEffect(() => {
    if (!isLoading && displayedText) {
      scrollToBottom();
    }
  }, [displayedText, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setDisplayedText("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let charIndex = 0;

      // Read the stream
      const readStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          fullText += text;
        }
      };

      await readStream();

      // Typewriter effect
      const typewriter = () => {
        if (charIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, charIndex + 1));
          charIndex++;
          typingIntervalRef.current = setTimeout(typewriter, 15); // Adjust speed here
        } else {
          setIsLoading(false);
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: fullText,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setDisplayedText("");
        }
      };

      typewriter();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please make sure you are signed in.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Cleanup typewriter on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearTimeout(typingIntervalRef.current);
      }
    };
  }, []);

  const hasMessages = messages.length > 0 || isLoading || displayedText;

  return (
    <div className="w-full h-[calc(100vh-12rem)] flex flex-col bg-gradient-to-b from-[#0F0F0F] to-[#000000] rounded-3xl border border-[#2F3336] overflow-hidden">
      {!hasMessages ? (
        // Empty state
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6">
            <Bot className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 text-center">
            Hi! I'm MORA Assistant
          </h2>
          <p className="text-[#71767B] text-center max-w-md mb-8">
            Ask me anything about money, investing, finance concepts, or AI tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-4 py-3 bg-[#0F0F0F] border border-[#2F3336] rounded-2xl text-white text-sm font-medium hover:bg-[#16181C] hover:border-white/30 transition duration-300 text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4 animate-fade-in">
                {msg.role === "assistant" ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-black" />
                    </div>
                    <div className="flex-1 max-w-4xl">
                      <div className="bg-[#0F0F0F] border border-[#2F3336] rounded-2xl rounded-tl-sm p-4 text-[#E0E0E0] leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: formatAIText(msg.content) }} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 max-w-4xl flex justify-end">
                      <div className="bg-[#16181C] border border-[#2F3336] rounded-2xl rounded-tr-sm p-4 text-white leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  </>
                )}
              </div>
            ))}

            {isLoading && displayedText && (
              <div className="flex gap-4 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1 max-w-4xl">
                  <div className="bg-[#0F0F0F] border border-[#2F3336] rounded-2xl rounded-tl-sm p-4 text-[#E0E0E0] leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: formatAIText(displayedText) }} />
                    <span className="inline-block w-2 h-5 bg-white ml-1 animate-blink"></span>
                  </div>
                </div>
              </div>
            )}

            {isLoading && !displayedText && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#0F0F0F] border border-[#2F3336] rounded-2xl rounded-tl-sm p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area - fixed at bottom with padding */}
          <div className="px-6 py-4 border-t border-[#2F3336] bg-[#000000]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="max-w-4xl mx-auto flex gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                disabled={isLoading}
                className="flex-1 bg-[#16181C] border border-[#2F3336] focus:border-white rounded-full px-6 py-3 text-white placeholder-[#71767B] outline-none transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-white hover:bg-[#E0E0E0] disabled:bg-[#2F3336] disabled:text-[#71767B] text-black p-3 rounded-full transition disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-center text-xs text-[#71767B] mt-2">Press Enter to send</p>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
}
