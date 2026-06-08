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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2C2C2C] flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#999999] hover:text-white transition">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#E53935] flex items-center justify-center text-white text-lg shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-300">
            ▶
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight hidden sm:block">
            <span className="text-white">MORA</span>
            <span className="text-[#E53935]">Tube</span>
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
            className="w-full bg-[#1A1A1A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-l-full px-5 py-2.5 outline-none text-sm text-white transition-colors"
          />
          <button
            type="submit"
            className="bg-[#141414] hover:bg-[#1F1F1F] border border-l-0 border-[#2C2C2C] px-6 rounded-r-full transition-colors flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-[#999999] group-hover:text-white" />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          className="md:hidden p-2 text-[#999999] hover:text-white"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="w-5 h-5" />
        </button>

        {canUpload && (
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-[#141414] hover:bg-[#1F1F1F] border border-[#2C2C2C] px-3 py-2 sm:px-4 rounded-full text-sm font-semibold transition text-white"
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
              className="p-2 text-[#999999] hover:text-white transition relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#E53935] rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1 border-2 border-[#0A0A0A]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#141414] border border-[#2C2C2C] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[60]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2C2C]">
                  <h3 className="font-bold text-sm text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-[#E53935] hover:text-[#C62828] font-semibold transition"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto hide-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-[#999999]">
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
                          className={`flex gap-3 px-4 py-3 hover:bg-[#1F1F1F] transition border-l-2 ${
                            notif.read
                              ? "border-transparent"
                              : "border-[#E53935] bg-[#E53935]/5"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#1A1A1A] text-[#999999]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-tight mb-0.5 truncate text-white">
                              {notif.title}
                            </p>
                            <p className="text-xs text-[#999999] line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-[#666666] mt-1 font-medium">
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
              className="w-9 h-9 rounded-full bg-[#E53935] text-white font-bold flex items-center justify-center hover:bg-[#C62828] transition border border-[#2C2C2C]"
            >
              {user?.firstName?.[0] || "U"}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-64 bg-[#141414] border border-[#2C2C2C] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[60]">
                {/* User Info */}
                <div className="px-4 py-4 border-b border-[#2C2C2C]">
                  <p className="font-bold text-white">{user?.firstName}</p>
                  <p className="text-xs text-[#999999] mt-1">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#1F1F1F] transition"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#1F1F1F] transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  {userRole === "VIEWER" && (
                    <Link
                      href="/dashboard/upgrade"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#1F1F1F] transition"
                    >
                      <Crown className="w-4 h-4 text-yellow-400" />
                      Upgrade to Creator
                    </Link>
                  )}

                  {userRole === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#1F1F1F] transition"
                    >
                      <Shield className="w-4 h-4 text-purple-400" />
                      Admin Panel
                    </Link>
                  )}

                  {/* Divider */}
                  <div className="border-t border-[#2C2C2C] my-2" />

                  {/* Sign Out */}
                  <SignOutButton>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition w-full">
                      <LogOut className="w-4 h-4" />
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
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#0A0A0A] z-[60] flex items-center px-4 gap-3 md:hidden border-b border-[#2C2C2C]">
          <button onClick={() => setIsSearchOpen(false)} className="text-[#999999] hover:text-white transition">
            ✕
          </button>
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search..."
              className="flex-1 bg-[#1A1A1A] border border-[#2C2C2C] rounded-full px-4 py-2 outline-none text-sm text-white"
            />
            <button type="submit" className="bg-[#E53935] p-2 rounded-full hover:bg-[#C62828] transition">
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
