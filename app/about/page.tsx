"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, BookOpen, Users, Brain } from "lucide-react";

export default function AboutPage() {
  const [stats, setStats] = useState({
    videos: 0,
    books: 0,
    users: 0,
    conversations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            videos: data.totalVideos || 0,
            books: data.totalDocuments || 0,
            users: data.totalUsers || 0,
            conversations: data.aiConversations || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      {/* Hero Section */}
      <div className="px-4 md:px-8 py-20 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
          Your Money Works Like An Employee
        </h1>
        <p className="text-xl text-[#999999] max-w-2xl mx-auto">
          Learn to make your money work for you, without the complexity.
        </p>
      </div>

      {/* Mission Section */}
      <div className="px-4 md:px-8 py-16 max-w-4xl mx-auto">
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-[#999999] text-lg leading-relaxed">
            MORATube exists to make financial literacy accessible to every Indian. We believe everyone deserves to
            understand how money can work for them. From stock market basics to wealth building strategies, we break
            down complex financial concepts into simple, actionable lessons. Our community learns together, grows
            together, and builds wealth together.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">By The Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 text-center hover:border-[#E53935]/30 transition">
            <Play className="w-8 h-8 text-[#E53935] mx-auto mb-4" />
            <p className="text-3xl font-black text-white">{isLoading ? "—" : stats.videos.toLocaleString()}</p>
            <p className="text-sm text-[#999999] mt-2">Videos Created</p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 text-center hover:border-[#E53935]/30 transition">
            <BookOpen className="w-8 h-8 text-[#E53935] mx-auto mb-4" />
            <p className="text-3xl font-black text-white">{isLoading ? "—" : stats.books.toLocaleString()}</p>
            <p className="text-sm text-[#999999] mt-2">Books & Documents</p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 text-center hover:border-[#E53935]/30 transition">
            <Users className="w-8 h-8 text-[#E53935] mx-auto mb-4" />
            <p className="text-3xl font-black text-white">{isLoading ? "—" : stats.users.toLocaleString()}</p>
            <p className="text-sm text-[#999999] mt-2">Active Learners</p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 text-center hover:border-[#E53935]/30 transition">
            <Brain className="w-8 h-8 text-[#E53935] mx-auto mb-4" />
            <p className="text-3xl font-black text-white">{isLoading ? "—" : stats.conversations.toLocaleString()}</p>
            <p className="text-sm text-[#999999] mt-2">AI Conversations</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 md:px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8">
            <div className="text-4xl font-black text-[#E53935] mb-4">1</div>
            <h3 className="text-xl font-bold text-white mb-3">Watch & Learn</h3>
            <p className="text-[#999999]">
              Explore our library of finance videos made simple. From investing 101 to advanced strategies, learn at
              your pace.
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8">
            <div className="text-4xl font-black text-[#E53935] mb-4">2</div>
            <h3 className="text-xl font-bold text-white mb-3">Read & Understand</h3>
            <p className="text-[#999999]">
              Access our books and documents library. Deep dive into topics with curated resources from industry experts.
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8">
            <div className="text-4xl font-black text-[#E53935] mb-4">3</div>
            <h3 className="text-xl font-bold text-white mb-3">Ask & Grow</h3>
            <p className="text-[#999999]">
              Use MORA AI Assistant to ask any finance question. Get instant answers powered by AI and expert knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="px-4 md:px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Values</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#E53935] mb-2">💚 Free Forever</h3>
            <p className="text-[#999999]">
              All core features of MORATube will always be completely free. No hidden costs, no paywalls.
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#E53935] mb-2">🇮🇳 India Focused</h3>
            <p className="text-[#999999]">
              Designed for Indian investors. Relevant to Indian markets, taxes, and financial goals.
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#E53935] mb-2">🤖 AI Powered</h3>
            <p className="text-[#999999]">
              Leverage AI to get instant answers and personalized recommendations for your financial journey.
            </p>
          </div>
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#E53935] mb-2">👥 Community Driven</h3>
            <p className="text-[#999999]">
              Learn from creators and educators. Share knowledge. Build wealth together as a community.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-4 md:px-8 py-12 max-w-5xl mx-auto border-t border-[#2C2C2C]">
        <div className="text-center text-[#999999] space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-[#E53935] transition">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-[#E53935] transition">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="mailto:support@fingrowth.online" className="hover:text-[#E53935] transition">
              Contact
            </a>
          </div>
          <p className="text-xs">© 2024 MORATube. All rights reserved. Made with 💜 for Indian learners.</p>
        </div>
      </div>
    </div>
  );
}
