"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  PlaySquare, 
  MonitorPlay, 
  TrendingUp, 
  Bot, 
  Users, 
  History,
  ThumbsUp,
  Clock,
  Compass,
  LayoutDashboard,
  MessageSquare,
  BookOpen
} from "lucide-react";

const mainLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Videos", href: "/videos", icon: PlaySquare },
  { name: "Shorts", href: "/shorts", icon: MonitorPlay },
];

const exploreLinks = [
  { name: "Finance Hub", href: "/finance-hub", icon: TrendingUp },
  { name: "AI Tools", href: "/ai-tools", icon: Bot },
  { name: "AI Assistant", href: "/ai-assistant", icon: MessageSquare },
  { name: "Book Library", href: "/book-library", icon: BookOpen },
  { name: "Community", href: "/community", icon: Users },
];

const userLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "History", href: "/history", icon: History },
  { name: "Liked Videos", href: "/liked", icon: ThumbsUp },
  { name: "Watch Later", href: "/watch-later", icon: Clock },
];

const subscriptions = [
  "MORA Finance",
  "AI Growth",
  "Wealth Builder",
  "Smart Learner",
];

export default function Sidebar() {
  const pathname = usePathname();

  const renderLinks = (links: typeof mainLinks) => {
    return links.map((link) => {
      const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
      return (
        <Link
          key={link.name}
          href={link.href}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive 
              ? "bg-white/10 text-white font-semibold" 
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <link.icon className={`w-5 h-5 ${isActive ? "text-red-500" : ""}`} />
          <span>{link.name}</span>
        </Link>
      );
    });
  };

  return (
    <aside className="fixed top-16 left-0 bottom-0 hidden md:flex flex-col w-64 bg-[#050505] border-r border-white/10 overflow-y-auto hide-scrollbar z-40">
      <div className="flex-1 py-6 px-3 space-y-8">
        <nav className="space-y-1">
          {renderLinks(mainLinks)}
        </nav>

        <div>
          <h3 className="px-4 text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Explore</h3>
          <nav className="space-y-1">
            {renderLinks(exploreLinks)}
          </nav>
        </div>

        <div>
          <h3 className="px-4 text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">You</h3>
          <nav className="space-y-1">
            {renderLinks(userLinks)}
          </nav>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="px-4 text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Subscriptions</h3>
          <div className="space-y-1">
            {subscriptions.map((sub, i) => (
              <Link
                key={sub}
                href={`/channel/${sub.toLowerCase().replace(" ", "-")}`}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-zinc-800 flex items-center justify-center text-[10px] text-white font-bold">
                  {sub[0]}
                </div>
                <span className="text-sm truncate">{sub}</span>
                {i < 2 && <div className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto"></div>}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/10 text-xs text-gray-600 font-medium">
        <p className="mb-2 hover:text-gray-400 cursor-pointer transition">About • Press • Copyright</p>
        <p className="mb-4 hover:text-gray-400 cursor-pointer transition">Terms • Privacy • Policy</p>
        <p>© 2026 MORA Tube LLC</p>
      </div>
    </aside>
  );
}
