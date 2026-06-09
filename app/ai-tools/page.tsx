"use client";

import { useState, useMemo } from "react";
import { Bot, Sparkles, Search, ExternalLink } from "lucide-react";

const AI_TOOLS = [
  // Finance Tools
  {
    id: "1",
    name: "Zerodha Kite",
    category: "Finance",
    description: "Portfolio management and stock trading platform",
    pricing: "Free",
    url: "https://zerodha.com",
    icon: "💹",
  },
  {
    id: "2",
    name: "Groww",
    category: "Finance",
    description: "Mutual fund investing and stocks made simple",
    pricing: "Free",
    url: "https://groww.in",
    icon: "📈",
  },
  {
    id: "3",
    name: "ET Money",
    category: "Finance",
    description: "SIP tracker and expense manager",
    pricing: "Free",
    url: "https://etmoney.com",
    icon: "💰",
  },
  {
    id: "4",
    name: "INDmoney",
    category: "Finance",
    description: "All-in-one wealth tracker and planner",
    pricing: "Free",
    url: "https://indmoney.com",
    icon: "🏦",
  },
  {
    id: "5",
    name: "Fisdom",
    category: "Finance",
    description: "Robo-advisory and goal-based planning",
    pricing: "Free",
    url: "https://fisdom.com",
    icon: "🎯",
  },
  // AI Productivity Tools
  {
    id: "6",
    name: "ChatGPT",
    category: "AI",
    description: "Financial Q&A, planning and research help",
    pricing: "Freemium",
    url: "https://chat.openai.com",
    icon: "🤖",
  },
  {
    id: "7",
    name: "Claude",
    category: "AI",
    description: "Deep research, analysis and writing",
    pricing: "Freemium",
    url: "https://claude.ai",
    icon: "✨",
  },
  {
    id: "8",
    name: "Perplexity",
    category: "AI",
    description: "AI-powered financial research and news",
    pricing: "Free",
    url: "https://perplexity.ai",
    icon: "🔮",
  },
  {
    id: "9",
    name: "Notion AI",
    category: "Productivity",
    description: "Smart notes and financial planning workspace",
    pricing: "Freemium",
    url: "https://notion.so",
    icon: "📝",
  },
  {
    id: "10",
    name: "Google Bard",
    category: "AI",
    description: "Market research and financial Q&A",
    pricing: "Free",
    url: "https://bard.google.com",
    icon: "🧠",
  },
  // Investing Tools
  {
    id: "11",
    name: "Screener.in",
    category: "Investing",
    description: "Deep stock analysis and financial data",
    pricing: "Free",
    url: "https://screener.in",
    icon: "🔍",
  },
  {
    id: "12",
    name: "Tijori Finance",
    category: "Investing",
    description: "Deep fundamental research platform",
    pricing: "Paid",
    url: "https://tijorifinance.com",
    icon: "🏛️",
  },
  {
    id: "13",
    name: "TradingView",
    category: "Investing",
    description: "Professional charts and technical analysis",
    pricing: "Freemium",
    url: "https://tradingview.com",
    icon: "📊",
  },
  {
    id: "14",
    name: "Smallcase",
    category: "Investing",
    description: "Thematic investing in stock baskets",
    pricing: "Free",
    url: "https://smallcase.com",
    icon: "🧺",
  },
  {
    id: "15",
    name: "Moneycontrol",
    category: "Investing",
    description: "Market news and portfolio tracker",
    pricing: "Free",
    url: "https://moneycontrol.com",
    icon: "📰",
  },
];

const CATEGORIES = ["All", "Finance", "AI", "Investing", "Productivity"];

export default function AIToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return AI_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "Free":
        return "bg-green-500/10 border border-green-500/20 text-green-400";
      case "Freemium":
        return "bg-blue-500/10 border border-blue-500/20 text-blue-400";
      case "Paid":
        return "bg-purple-500/10 border border-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/10 border border-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#2C2C2C] text-[#E53935] text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4" /> Discover Tools
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3 text-white">
          <Bot className="w-10 h-10 text-[#E53935]" /> AI Tools Directory
        </h1>
        <p className="text-[#999999] text-lg max-w-3xl">
          Discover the best AI and investing tools for financial growth. Free, freemium, and premium options for every need.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-full pl-12 pr-4 py-3 text-white placeholder-[#666666] outline-none transition"
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-lg">🛠️</div>
          <div>
            <p className="text-[#999999] text-xs font-semibold">Total Tools</p>
            <p className="text-xl font-black text-white">{AI_TOOLS.length} Tools</p>
          </div>
        </div>
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-lg">💰</div>
          <div>
            <p className="text-[#999999] text-xs font-semibold">Pricing</p>
            <p className="text-xl font-black text-white">Free & Paid</p>
          </div>
        </div>
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-lg">🇮🇳</div>
          <div>
            <p className="text-[#999999] text-xs font-semibold">Focus</p>
            <p className="text-xl font-black text-white">India Focused</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-[#E53935] text-white"
                : "bg-[#141414] border border-[#2C2C2C] text-[#999999] hover:border-[#E53935]/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-gradient-to-br from-[#141414] to-[#0F0F0F] border border-[#2C2C2C] rounded-2xl p-6 hover:border-[#E53935]/50 transition duration-300 flex flex-col shadow-lg hover:shadow-lg hover:shadow-[#E53935]/10"
          >
            {/* Icon */}
            <div className="text-6xl mb-4">{tool.icon}</div>

            {/* Title */}
            <h3 className="text-lg font-black text-white mb-3">{tool.name}</h3>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#2C2C2C] text-[#E53935] font-semibold">
                {tool.category}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getPricingColor(tool.pricing)}`}>
                {tool.pricing}
              </span>
            </div>

            {/* Description */}
            <p className="text-[#999999] text-sm mb-6 flex-1 leading-relaxed">{tool.description}</p>

            {/* Button */}
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#E53935] hover:bg-[#C62828] text-white py-3 rounded-xl font-bold transition duration-300"
            >
              Visit Tool
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bot className="w-16 h-16 text-[#333333] mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No tools found</h3>
          <p className="text-[#999999]">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}