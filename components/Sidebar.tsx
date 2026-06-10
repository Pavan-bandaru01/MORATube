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
  LayoutDashboard,
  MessageSquare,
  BookOpen,
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
];

export default function Sidebar() {
  const pathname = usePathname();

  const renderLinks = (links: typeof mainLinks) => {
    return links.map((link) => {
      const isActive =
        pathname === link.href ||
        (pathname.startsWith(link.href) && link.href !== "/");
      return (
        <Link
          key={link.name}
          href={link.href}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-[#16181C] text-white font-semibold"
              : "text-[#71767B] hover:bg-[#16181C] hover:text-white"
          }`}
        >
          <link.icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
          <span>{link.name}</span>
        </Link>
      );
    });
  };

  return (
    <aside className="fixed top-16 left-0 bottom-0 hidden md:flex flex-col w-64 bg-[#000000] border-r border-[#2F3336] overflow-y-auto hide-scrollbar z-40">
      <div className="flex-1 py-6 px-3 space-y-8">
        <nav className="space-y-1">{renderLinks(mainLinks)}</nav>

        <div>
          <h3 className="px-4 text-sm font-semibold text-[#666666] mb-2 uppercase tracking-wider">
            Explore
          </h3>
          <nav className="space-y-1">{renderLinks(exploreLinks)}</nav>
        </div>

        <div>
          <h3 className="px-4 text-sm font-semibold text-[#71767B] mb-2 uppercase tracking-wider">
            You
          </h3>
          <nav className="space-y-1">{renderLinks(userLinks)}</nav>
        </div>
      </div>

      <div className="p-6 border-t border-[#2F3336] text-xs text-[#71767B] font-medium">
        <p className="mb-2 hover:text-white cursor-pointer transition">
          About • Press • Copyright
        </p>
        <p className="mb-4 hover:text-white cursor-pointer transition">
          Terms • Privacy • Policy
        </p>
        <p>© 2026 MORA Tube LLC</p>
      </div>
    </aside>
  );
}
