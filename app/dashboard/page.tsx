import StatsCard from "@/components/StatsCard";
import VideoCard from "@/components/VideoCard";
import { videos } from "@/data/videos";
import { Upload, Settings, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const myVideos = videos.slice(0, 3); // Mocking "my videos"

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Creator Dashboard</h1>
          <p className="text-gray-400">Manage your channel, check analytics, and upload content.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/upload" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold transition flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" /> Upload
          </Link>
          <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-bold transition flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard stat={{ label: "Total Views", value: "24.5K", change: "+12.5%", trend: "up", icon: "Eye" }} />
        <StatsCard stat={{ label: "Subscribers", value: "1,240", change: "+45", trend: "up", icon: "Users" }} />
        <StatsCard stat={{ label: "Watch Time (hrs)", value: "856", change: "-2.4%", trend: "down", icon: "Clock" }} />
        <StatsCard stat={{ label: "Avg. Duration", value: "4:20", change: "0%", trend: "neutral", icon: "Activity" }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Content */}
          <section className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Uploads</h2>
              <Link href="/dashboard/content" className="text-sm font-semibold text-red-500 hover:text-red-400 transition">View All</Link>
            </div>
            
            <div className="space-y-4">
              {myVideos.map((video) => (
                <div key={video.id} className="flex gap-4 p-3 hover:bg-white/5 rounded-2xl transition border border-transparent hover:border-white/10 group">
                  <div className={`w-32 md:w-40 aspect-video rounded-xl bg-gradient-to-br ${video.thumbnailGradient} relative overflow-hidden shrink-0`}>
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-white">{video.duration}</div>
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="font-bold text-sm md:text-base leading-tight mb-1 line-clamp-2">{video.title}</h3>
                    <div className="text-xs text-gray-400 mb-2 flex gap-2">
                      <span>{video.uploadDate}</span>
                      <span>•</span>
                      <span>{video.visibility || 'Public'}</span>
                    </div>
                    <div className="flex gap-4 text-xs font-medium text-gray-300">
                      <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3 text-gray-500" /> {video.views}</span>
                      <span>👍 {video.likes}</span>
                      <span>💬 {video.comments.length}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                     <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg"><Settings className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <section className="glass rounded-3xl p-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl text-sm font-medium transition text-left flex justify-between items-center">
                Create a Short <span>+</span>
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl text-sm font-medium transition text-left flex justify-between items-center">
                Write Community Post <span>+</span>
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl text-sm font-medium transition text-left flex justify-between items-center">
                Go Live <span>+</span>
              </button>
            </div>
          </section>

          {/* Ideas panel */}
          <section className="bg-gradient-to-br from-red-900/40 to-black border border-red-500/20 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Growth Ideas</h2>
            <p className="text-sm text-red-200/80 mb-4">Based on your recent content, AI suggests you cover:</p>
            <ul className="space-y-2 text-sm text-white">
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> 5 hidden AI tools for finance</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> How to break the EMI cycle faster</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> The 50/30/20 rule explained simply</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
