"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit2, Upload, FileText } from "lucide-react";
import VideoCard from "@/components/VideoCard";

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  role: string;
  followers: string[];
  following: string[];
}

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  likes: number;
  duration: string;
  uploadDate: string;
  tags: string[];
  isShort: boolean;
  visibility: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
    title: string;
    subscribers: string;
    bio: string;
    bannerGradient: string;
  };
  comments: any[];
}

interface Document {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  fileUrl: string;
  category: string;
  views: number;
  uploadedBy: string;
  channelName: string;
  createdAt: string;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "CREATOR":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch profile
        const profileRes = await fetch("/api/user/profile");
        if (profileRes.ok) {
          const { profile } = await profileRes.json();
          setProfile(profile);
        }

        // Fetch user's videos
        if (user?.id) {
          const videosRes = await fetch(`/api/user/${user.id}/videos`);
          if (videosRes.ok) {
            const { videos } = await videosRes.json();
            setVideos(videos || []);
          }

          // Fetch user's documents
          const docsRes = await fetch(`/api/user/${user.id}/documents`);
          if (docsRes.ok) {
            const { documents } = await docsRes.json();
            setDocuments(documents || []);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, isLoaded, user, router]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      {/* Banner */}
      <div className="h-48 md:h-64 lg:h-80 w-full bg-gradient-to-br from-red-900 to-black" />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16 mb-8 relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0A0A0A] bg-[#141414] flex items-center justify-center text-4xl md:text-5xl font-black text-white shrink-0 shadow-xl overflow-hidden">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              profile.displayName[0] || "U"
            )}
          </div>

          <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
            <h1 className="text-3xl font-black text-white">{profile.displayName}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-2 text-[#999999]">
              <span className="font-semibold text-white">@{profile.username}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(profile.role)}`}>
                {profile.role}
              </span>
            </div>
            {profile.bio && (
              <p className="mt-3 text-sm text-[#999999] max-w-2xl">{profile.bio}</p>
            )}
          </div>

          <div className="mb-2 md:mb-4">
            <Link
              href="/profile/edit"
              className="bg-[#E53935] hover:bg-[#C62828] text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{videos.length}</p>
            <p className="text-sm text-[#999999] mt-1">Videos</p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}
            </p>
            <p className="text-sm text-[#999999] mt-1">Total Views</p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{documents.length}</p>
            <p className="text-sm text-[#999999] mt-1">Documents</p>
          </div>
        </div>

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-6 h-6 text-[#E53935]" />
              <h2 className="text-2xl font-bold text-white">My Videos</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Documents Section */}
        {documents.length > 0 && (
          <section className="mb-12 pb-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-[#E53935]" />
              <h2 className="text-2xl font-bold text-white">My Documents</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Link
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-4 hover:border-[#E53935] transition group"
                >
                  {doc.coverUrl && (
                    <div className="w-full h-32 bg-gradient-to-br from-red-900 to-black rounded-xl mb-4 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.coverUrl}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-white line-clamp-2">{doc.title}</h3>
                  <p className="text-xs text-[#999999] mt-2">{doc.views} views</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {videos.length === 0 && documents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#999999]">You haven't uploaded anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
