import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, Settings, BarChart2 } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await db.userProfile.findUnique({ where: { id: userId } });
  if (!profile) redirect("/sign-in");

  const myVideos = await db.video.findMany({
    where: { uploadedBy: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalViews = myVideos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = myVideos.reduce((sum, v) => sum + v.likes, 0);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Creator Dashboard</h1>
          <p className="text-gray-400">Welcome back, {profile.displayName}</p>
          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full mt-1 inline-block">
            {profile.role}
          </span>
        </div>
        <div className="flex gap-3">
          {profile.role === "VIEWER" ? (
            <Link href="/dashboard/upgrade"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold transition text-sm">
              Become a Creator
            </Link>
          ) : (
            <Link href="/upload"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold transition flex items-center gap-2 text-sm">
              <Upload className="w-4 h-4" /> Upload
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-gray-400 text-sm">Total Views</p>
          <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-gray-400 text-sm">Total Likes</p>
          <p className="text-2xl font-bold">{totalLikes.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-gray-400 text-sm">Videos Uploaded</p>
          <p className="text-2xl font-bold">{myVideos.length}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-gray-400 text-sm">Role</p>
          <p className="text-2xl font-bold">{profile.role}</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Uploads</h2>
          <Link href="/upload" className="text-sm font-semibold text-red-500 hover:text-red-400">
            + Upload New
          </Link>
        </div>

        {myVideos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-4">No uploads yet</p>
            {profile.role === "VIEWER" ? (
              <Link href="/dashboard/upgrade"
                className="bg-red-600 text-white px-6 py-3 rounded-full font-bold">
                Become a Creator to Upload
              </Link>
            ) : (
              <Link href="/upload"
                className="bg-red-600 text-white px-6 py-3 rounded-full font-bold">
                Upload Your First Video
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {myVideos.map((video) => (
              <div key={video.id}
                className="flex gap-4 p-3 hover:bg-white/5 rounded-2xl transition border border-transparent hover:border-white/10">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-32 aspect-video rounded-xl object-cover bg-gray-800"
                />
                <div className="flex-1 py-1">
                  <h3 className="font-bold text-sm leading-tight mb-1">{video.title}</h3>
                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(video.createdAt).toLocaleDateString()} · {video.visibility}
                  </div>
                  <div className="flex gap-4 text-xs font-medium text-gray-300">
                    <span className="flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" /> {video.views} views
                    </span>
                    <span>👍 {video.likes}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/videos/${video.id}`}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-lg">
                    <Settings className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}