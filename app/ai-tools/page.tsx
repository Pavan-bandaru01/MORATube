import ToolCard from "@/components/ToolCard";
import { getAITools } from "@/lib/actions";
import { Bot, Sparkles, Filter } from "lucide-react";

export default async function AIToolsPage() {
  const aiTools = await getAITools();
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-red-400 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> The Future is Here
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 flex items-center gap-3 text-balance">
            <Bot className="w-10 h-10 md:w-12 md:h-12 text-red-500" /> AI Tools Directory
          </h1>
          <p className="text-gray-400 md:text-lg leading-relaxed text-balance">
            Discover the best AI tools that can save you hours of work every week. From writing and research to design and video editing — learn how to use these tools to accelerate your growth.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <select className="appearance-none bg-white/5 border border-white/10 hover:border-white/30 px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold text-white outline-none transition cursor-pointer">
              <option value="all">All Categories</option>
              <option value="assistant">AI Assistants</option>
              <option value="design">Design</option>
              <option value="video">Video Editing</option>
              <option value="research">Research</option>
            </select>
            <Filter className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats/Info Bar */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-gradient-to-br from-[#050505] to-zinc-900 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl font-black">🚀</div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Productivity Boost</p>
            <p className="font-bold text-lg">Save 10+ hrs/week</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#050505] to-zinc-900 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl font-black">💰</div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Cost Effective</p>
            <p className="font-bold text-lg">Mostly Free/Freemium</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#050505] to-zinc-900 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl font-black">🎓</div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Learning Curve</p>
            <p className="font-bold text-lg">Beginner Friendly</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {aiTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}