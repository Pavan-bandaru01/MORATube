"use client";

import { useEffect, useState } from "react";
import { PlaySquare, MonitorPlay, Info } from "lucide-react";
import ChannelHeader from "@/components/ChannelHeader";
import VideoCard from "@/components/VideoCard";

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
  views: number;
  createdAt: string;
}

interface ChannelProfile {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  followers: string[];
  createdAt: string;
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ChannelPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const [profile, setProfile] = useState<ChannelProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("videos");
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setUsername(resolvedParams.username);

        // Fetch current user ID
        const userRes = await fetch("/api/user/role");
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUserId(userData.profile?.id || null);
        }

        // Fetch channel profile
        const profileRes = await fetch(`/api/channels/${resolvedParams.username}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);

          // Fetch videos
          const videosRes = await fetch(`/api/channels/${resolvedParams.username}/videos`);
          if (videosRes.ok) {
            const videosData = await videosRes.json();
            setVideos(videosData.videos || []);
          }

          // Fetch documents
          const docsRes = await fetch(`/api/channels/${resolvedParams.username}/documents`);
          if (docsRes.ok) {
            const docsData = await docsRes.json();
            setDocuments(docsData.documents || []);
          }
        }
      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-[#999999]">Loading channel...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-[#999999]">Channel not found</p>
      </div>
    );
  }

  const isOwnChannel = currentUserId === profile.id;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      <div className="h-48 md:h-64 lg:h-80 w-full bg-gradient-to-br from-red-900 to-black" />

      <ChannelHeader
        channelId={profile.id}
        channelName={profile.displayName}
        channelUsername={profile.username}
        bio={profile.bio || ""}
        subscriberCount={profile.followers.length}
        videoCount={videos.length}
        avatarUrl={profile.avatarUrl}
        isOwnChannel={isOwnChannel}
      />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex border-b border-[#2C2C2C] mb-8 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-6 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === "videos"
                ? "border-[#E53935] text-white"
                : "border-transparent text-[#999999] hover:text-white"
            }`}
          >
            <PlaySquare className="w-4 h-4 inline mr-2" /> Videos
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === "documents"
                ? "border-[#E53935] text-white"
                : "border-transparent text-[#999999] hover:text-white"
            }`}
          >
            <MonitorPlay className="w-4 h-4 inline mr-2" /> Documents
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-6 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === "about"
                ? "border-[#E53935] text-white"
                : "border-transparent text-[#999999] hover:text-white"
            }`}
          >
            <Info className="w-4 h-4 inline mr-2" /> About
          </button>
        </div>

        <div className="pb-16">
          {/* Videos Tab */}
          {activeTab === "videos" && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-white">Videos</h2>
              {videos.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-12 text-center">
                  <p className="text-[#999999]">No videos uploaded yet.</p>
                </div>
              )}
            </section>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-white">Documents</h2>
              {documents.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-12 text-center">
                  <p className="text-[#999999]">No documents uploaded yet.</p>
                </div>
              )}
            </section>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <section className="max-w-2xl">
              <h2 className="text-xl font-bold mb-4 text-white">About</h2>
              <div className="space-y-6">
                <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-[#E53935] mb-2">BIO</h3>
                  <p className="text-[#999999]">{profile.bio || "No bio added yet."}</p>
                </div>
                <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-[#E53935] mb-2">JOINED</h3>
                  <p className="text-[#999999]">
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-[#E53935] mb-2">TOTAL VIEWS</h3>
                  <p className="text-[#999999]">
                    {videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()} views
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
