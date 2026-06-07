import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StatsData } from "@/types";
import { createElement } from "react";
import * as LucideIcons from "lucide-react";

export default function StatsCard({ stat }: { stat: StatsData }) {
  // @ts-ignore
  const Icon = LucideIcons[stat.icon] || LucideIcons.Activity;

  return (
    <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
          stat.trend === "up" ? "text-emerald-400 bg-emerald-400/10" :
          stat.trend === "down" ? "text-red-400 bg-red-400/10" :
          "text-gray-400 bg-white/10"
        }`}>
          {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
          {stat.trend === "down" && <TrendingDown className="w-3 h-3" />}
          {stat.trend === "neutral" && <Minus className="w-3 h-3" />}
          {stat.change}
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-black mb-1">{stat.value}</p>
        <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
      </div>
    </div>
  );
}
