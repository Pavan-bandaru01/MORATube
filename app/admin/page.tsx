"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/StatsCard";
import { Users, Video } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalDocuments: number;
  totalViews: number;
  topSearches?: { query: string; count: number }[];
  recentUploads: {
    id: string;
    title: string;
    channelName: string;
    views: number;
    createdAt: string;
    type: string;
  }[];
  recentUsers: {
    id: string;
    username: string;
    displayName: string;
    role: string;
    createdAt: string;
  }[];
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const roleRes = await fetch("/api/user/role");
        if (!roleRes.ok) {
          router.replace("/");
          return;
        }
        const roleData = await roleRes.json();
        if (roleData.profile?.role !== "ADMIN") {
          router.replace("/");
          return;
        }

        const statsRes = await fetch("/api/admin/stats");
        if (!statsRes.ok) {
          setError("Failed to load admin stats");
          return;
        }
        const data = await statsRes.json();
        setStats(data);
      } catch {
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-8 flex items-center justify-center">
        <p className="text-gray-400">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-8 flex items-center justify-center">
        <p className="text-red-400">{error || "Access denied"}</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard
          stat={{
            label: "Total Users",
            value: stats.totalUsers.toString(),
            change: "",
            trend: "neutral",
            icon: "Users",
          }}
        />
        <StatsCard
          stat={{
            label: "Total Videos",
            value: stats.totalVideos.toString(),
            change: "",
            trend: "neutral",
            icon: "Activity",
          }}
        />
        <StatsCard
          stat={{
            label: "Total Documents",
            value: stats.totalDocuments.toString(),
            change: "",
            trend: "neutral",
            icon: "Eye",
          }}
        />
        <StatsCard
          stat={{
            label: "Total Views",
            value: stats.totalViews.toLocaleString(),
            change: "",
            trend: "neutral",
            icon: "Eye",
          }}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {stats.topSearches && stats.topSearches.length > 0 && (
          <section className="glass rounded-3xl p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-white">Top Searches</h2>
            <div className="flex flex-wrap gap-2">
              {stats.topSearches.map((s) => (
                <span
                  key={s.query}
                  className="px-4 py-2 rounded-full bg-[#141414] border border-[#2C2C2C] text-sm text-[#999999]"
                >
                  {s.query} ({s.count})
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" /> Recent Uploads
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-white/10">
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Uploader</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Views</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUploads.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-medium line-clamp-1 max-w-[160px]">
                      {item.title}
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{item.channelName}</td>
                    <td className="py-3 pr-4 text-gray-400">{item.type}</td>
                    <td className="py-3 pr-4 text-gray-400">{item.views}</td>
                    <td className="py-3 text-gray-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" /> Recent Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-white/10">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Username</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-medium">{user.displayName}</td>
                    <td className="py-3 pr-4 text-gray-400">@{user.username}</td>
                    <td className="py-3 pr-4 text-gray-400">{user.role}</td>
                    <td className="py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
