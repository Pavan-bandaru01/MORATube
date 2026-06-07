"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Upload,
  Bell,
  Menu,
  User,
  LayoutDashboard,
  LogOut,
  Crown,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

const notifIcons: Record<string, typeof Bell> = {
  LIKE: Bell,
  COMMENT: Bell,
  NEW_VIDEO: Upload,
  NEW_DOCUMENT: Upload,
  NEW_FOLLOWER: User,
  SYSTEM: Bell,
};

export default function Navbar() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Silently fail
    }
  }, [isSignedIn]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const displayName =
    user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "User";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || "";
  const avatarLetter = displayName[0]?.toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-300 hover:text-white transition">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-300">
            M
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight hidden sm:block">
            MORA<span className="text-red-500">Tube</span>
          </h1>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-6">
        <div className="flex w-full group">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos, shorts, AI tools, finance ideas..."
            className="w-full bg-black/40 border border-white/10 focus:border-red-500/50 rounded-l-full px-5 py-2.5 outline-none text-sm transition-colors"
          />
          <button
            type="submit"
            className="bg-white/5 hover:bg-white/10 border border-l-0 border-white/10 px-6 rounded-r-full transition-colors flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="w-5 h-5" />
        </button>

        <Link
          href="/upload"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 sm:px-4 rounded-full text-sm font-semibold transition"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </Link>

        {isSignedIn && (
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
                if (!showNotifications) fetchNotifications();
              }}
              className="p-2 text-gray-300 hover:text-white transition relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1 border-2 border-[#050505]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[60]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold transition"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto hide-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                      <Bell className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm font-medium">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const Icon = notifIcons[notif.type] || Bell;
                      return (
                        <Link
                          key={notif.id}
                          href={notif.link || "/"}
                          onClick={() => setShowNotifications(false)}
                          className={`flex gap-3 px-4 py-3 hover:bg-white/5 transition border-l-2 ${
                            notif.read
                              ? "border-transparent"
                              : "border-red-500 bg-red-500/5"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-white/5 text-gray-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-tight mb-0.5 truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-gray-600 mt-1 font-medium">
                              {timeAgo(notif.createdAt)}
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-bold ml-1 cursor-pointer border border-white/10 hover:border-red-500/50 transition overflow-hidden"
          >
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-72 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[60]">
              {isSignedIn ? (
                <>
                  <div className="px-4 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-lg font-black border border-white/10 overflow-hidden">
                        {user?.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          avatarLetter
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/upgrade"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade to Creator
                    </Link>
                  </div>

                  <div className="border-t border-white/10">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        signOut({ redirectUrl: "/" });
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#050505] z-[60] flex items-center px-4 gap-3 md:hidden">
          <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-white transition">
            ✕
          </button>
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-white/10 rounded-full px-4 py-2 outline-none text-sm"
            />
            <button type="submit" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
