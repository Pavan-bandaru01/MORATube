import { ExternalLink, CheckCircle2 } from "lucide-react";
import type { AITool } from "@/types";
import Link from "next/link";

export default function ToolCard({ tool }: { tool: AITool }) {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full hover:-translate-y-1 transition duration-300">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${tool.iconBg} ${tool.iconColor}`}>
            {tool.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight mb-1">{tool.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
              {tool.category}
            </span>
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded-md font-semibold border ${
          tool.pricing === 'Free' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          tool.pricing === 'Freemium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
          'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {tool.pricing}
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
        {tool.description}
      </p>

      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Key Use Cases</p>
        {tool.useCases.slice(0, 3).map((useCase, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">{useCase}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
        <Link 
          href={`/videos?search=${tool.name}`}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-center text-sm font-semibold transition"
        >
          Watch Tutorial
        </Link>
        <a 
          href={tool.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-semibold transition"
        >
          Try Tool <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
