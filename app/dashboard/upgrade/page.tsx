"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Crown, Loader2, Upload, Video } from "lucide-react";
import toast from "react-hot-toast";

export default function UpgradePage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    fetch("/api/user/role")
      .then((res) => res.json())
      .then((data) => {
        setRole(data.profile?.role || "VIEWER");
        if (data.profile?.role && data.profile.role !== "VIEWER") {
          setUpgraded(true);
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/user/request-creator", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upgrade failed");
      setRole("CREATOR");
      setUpgraded(true);
      toast.success("You're now a Creator!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upgrade failed");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
        <Crown className="w-8 h-8 text-red-500" /> Upgrade to Creator
      </h1>
      <p className="text-gray-400 mb-8">
        Current role:{" "}
        <span className="text-white font-semibold">{role}</span>
      </p>

      {upgraded ? (
        <div className="glass rounded-3xl p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">You&apos;re a Creator!</h2>
          <p className="text-gray-400 mb-6">
            You can now upload videos and documents to MORA Tube.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition"
          >
            <Upload className="w-4 h-4" /> Start Uploading
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-4">Creator Benefits</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Video className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Upload Videos</p>
                  <p className="text-sm text-gray-400">
                    Share educational finance and growth content with the community.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Upload className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Share Documents</p>
                  <p className="text-sm text-gray-400">
                    Publish PDFs, guides, and books to the MORA Library.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Creator Dashboard</p>
                  <p className="text-sm text-gray-400">
                    Track your uploads and manage your channel.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white py-4 rounded-full font-bold transition flex items-center justify-center gap-2"
          >
            {upgrading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Upgrading...
              </>
            ) : (
              "Become a Creator"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
