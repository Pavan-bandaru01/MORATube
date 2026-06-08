"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
}

export default function EditProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const { profile } = await res.json();
          setDisplayName(profile.displayName || "");
          setUsername(profile.username || "");
          setBio(profile.bio || "");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isSignedIn, isLoaded, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!displayName.trim() || !username.trim()) {
      setError("Display name and username are required");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          username,
          bio,
        }),
      });

      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#E53935] hover:text-[#C62828] font-semibold mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 md:p-8">
          <h1 className="text-3xl font-black mb-8 text-white">Edit Profile</h1>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl p-3 text-white outline-none transition"
                placeholder="Your display name"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl p-3 text-white outline-none transition"
                placeholder="Your username"
              />
              <p className="text-xs text-[#999999] mt-1">Unique identifier for your profile</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full bg-[#0A0A0A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl p-3 text-white outline-none transition resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-[#999999] mt-1">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#E53935] hover:bg-[#C62828] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white px-6 py-3 rounded-xl font-bold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
