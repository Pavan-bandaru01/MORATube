"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Upload,
  Bell,
  Menu,
  LayoutDashboard,
  Crown,
  LogOut,
  User,
  Settings,
  Shield,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";

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
  NEW_FOLLOWER: Bell,
  SYSTEM: Bell,
};

export default function Navbar() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const fetchRole = useCallback(async () => {
    if (!isSignedIn) {
      setUserRole(null);
      return;
    }
    try {
      const res = await fetch("/api/user/role");
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.profile?.role || "VIEWER");
      }
    } catch {
      setUserRole("VIEWER");
    }
  }, [isSignedIn]);

  useEffect(() => {
    fetchNotifications();
    fetchRole();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchRole]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
      }
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

  const canUpload = userRole === "CREATOR" || userRole === "ADMIN";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#000000]/90 backdrop-blur-md border-b border-[#2F3336] flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#71767B] hover:text-white transition">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-2 group">
          <h1 className="text-xl md:text-2xl font-black tracking-tight hidden sm:block">
            <span className="text-white">MORA</span>
            <span className="text-[#71767B]">Tube</span>
          </h1>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-6">
        <div className="flex w-full group">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search videos, documents, finance ideas..."
            className="w-full bg-[#16181C] border border-[#2F3336] focus:border-white rounded-l-full px-5 py-2.5 outline-none text-sm text-white transition-colors"
          />
          <button
            type="submit"
            className="bg-[#0F0F0F] hover:bg-[#16181C] border border-l-0 border-[#2F3336] px-6 rounded-r-full transition-colors flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-[#71767B] group-hover:text-white" />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          className="md:hidden p-2 text-[#71767B] hover:text-white"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="w-5 h-5" />
        </button>

        {canUpload && (
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-[#0F0F0F] hover:bg-[#16181C] border border-[#2F3336] px-3 py-2 sm:px-4 rounded-full text-sm font-semibold transition text-white"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </Link>
        )}

        {isSignedIn && (
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) fetchNotifications();
              }}
              className="p-2 text-[#71767B] hover:text-white transition relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-white text-black rounded-full text-[10px] font-bold flex items-center justify-center px-1 border-2 border-[#000000]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#000000] border border-[#2F3336] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[60]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2F3336]">
                  <h3 className="font-bold text-sm text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-white hover:text-[#71767B] font-semibold transition"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto hide-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-[#71767B]">
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
                          className={`flex gap-3 px-4 py-3 hover:bg-[#16181C] transition border-l-2 ${
                            notif.read
                              ? "border-transparent"
                              : "border-white bg-white/5"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#0F0F0F] text-[#71767B]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-tight mb-0.5 truncate text-white">
                              {notif.title}
                            </p>
                            <p className="text-xs text-[#71767B] line-clamp-2 leading-relaxed\">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-[#71767B] mt-1 font-medium">
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

        {/* User Menu */}
        {isSignedIn && (
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-full bg-white text-black font-bold flex items-center justify-center hover:bg-[#E0E0E0] transition border border-[#2F3336]"
            >
              {user?.firstName?.[0] || "U"}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-80 bg-[#000000] border border-[#2F3336] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[60]">
                {/* Header - User Info */}
                <div className="px-4 py-4 border-b border-[#2F3336] bg-[#0F0F0F]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white text-black font-bold flex items-center justify-center text-lg">
                      {user?.firstName?.[0] || "U"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-xs text-[#71767B] mt-0.5">{user?.emailAddresses[0]?.emailAddress}</p>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full mt-1.5 ${
                          userRole === "ADMIN"
                            ? "bg-transparent border border-white text-white"
                            : userRole === "CREATOR"
                            ? "bg-transparent border border-white text-white"
                            : "bg-transparent border border-white text-white"
                        }`}
                      >
                        {userRole || "VIEWER"}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/channel/${user?.username}`}
                    onClick={() => setShowUserMenu(false)}
                    className="block mt-3 text-center text-xs font-bold text-white hover:text-[#71767B] transition"
                  >
                    View Channel →
                  </Link>
                </div>

                {/* Creator Section */}
                {(userRole === "CREATOR" || userRole === "ADMIN") && (
                  <>
                    <div className="py-2 px-2 border-b border-[#2F3336]">
                      <p className="text-[10px] text-[#71767B] font-bold uppercase px-2 py-1.5">Creator</p>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition"
                      >
                        <span>🎬</span>
                        Creator Studio
                      </Link>
                      <Link
                        href="/upload"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition"
                      >
                        <span>📤</span>
                        Upload Content
                      </Link>
                    </div>
                  </>
                )}

                {/* Account Section */}
                <div className="py-2 px-2 border-b border-[#2F3336]">
                  <p className="text-[10px] text-[#71767B] font-bold uppercase px-2 py-1.5">Account</p>
                  <Link
                    href="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition"
                  >
                    <span>👤</span>
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition w-full text-left relative"
                  >
                    <span>🔔</span>
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto text-xs bg-white text-black px-2 py-1 rounded-full font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <Link
                    href="/history"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition"
                  >
                    <span>📚</span>
                    My Library
                  </Link>
                </div>

                {/* Settings Section */}
                <div className="py-2 px-2 border-b border-[#2F3336]">
                  <p className="text-[10px] text-[#71767B] font-bold uppercase px-2 py-1.5">Settings</p>
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition"
                  >
                    <span>⚙️</span>
                    Account Settings
                  </Link>
                  <div className="flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition cursor-not-allowed opacity-60">
                    <div className="flex items-center gap-3">
                      <span>🎨</span>
                      Appearance
                    </div>
                    <span className="text-xs text-[#71767B]">Coming soon</span>
                  </div>
                </div>

                {/* Support Section */}
                <div className="py-2 px-2 border-b border-[#2F3336]">
                  <p className="text-[10px] text-[#71767B] font-bold uppercase px-2 py-1.5">Support</p>
                  <a
                    href="mailto:help@fingrowth.online"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition"
                  >
                    <span>❓</span>
                    Help & Support
                  </a>
                  <a
                    href="https://fingrowth.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-[#16181C] rounded-lg transition"
                  >
                    <span>ℹ️</span>
                    About MORATube
                  </a>
                </div>

                {/* Sign Out */}
                <div className="py-2 px-2">
                  <SignOutButton>
                    <button className="flex items-center justify-center gap-3 w-full px-3 py-2.5 text-sm text-white bg-white/10 border border-white/20 hover:bg-white/20 rounded-lg transition font-semibold">
                      <span>🚪</span>
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isSearchOpen && (
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#000000] z-[60] flex items-center px-4 gap-3 md:hidden border-b border-[#2F3336]">
          <button onClick={() => setIsSearchOpen(false)} className="text-[#71767B] hover:text-white transition">
            ✕
          </button>
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search..."
              className="flex-1 bg-[#16181C] border border-[#2F3336] rounded-full px-4 py-2 outline-none text-sm text-white"
            />
            <button type="submit" className="bg-white text-black p-2 rounded-full hover:bg-[#E0E0E0] transition">
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
