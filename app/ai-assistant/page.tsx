import AIChat from "@/components/AIChat";
import { Bot, Info } from "lucide-react";
import { getVideos } from "@/lib/actions";

export default async function AIAssistantPage() {
  const suggestedVideos = await getVideos(undefined, undefined);
  const topVideos = suggestedVideos.slice(0, 4);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3 text-white">
            <Bot className="w-8 h-8 text-[#E53935]" /> MORA Assistant
          </h1>
          <p className="text-[#999999] max-w-2xl">
            Ask questions about finance, debt, AI tools, or money habits. The assistant searches our educational content to give you clear, simple answers and video recommendations.
          </p>
        </div>

        <div className="bg-[#E53935]/10 border border-[#E53935]/20 text-red-300 px-4 py-2 rounded-xl text-xs font-medium flex items-start gap-2 max-w-xs shrink-0">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Educational purpose only. Not financial advice.</p>
        </div>
      </div>

      <AIChat suggestedVideos={topVideos} />
    </div>
  );
}
