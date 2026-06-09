"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings, Bell, Moon, AlertTriangle, Save } from "lucide-react";

interface UserProfile {
  displayName: string;
  username: string;
  bio: string;
}

export default function SettingsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    username: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newFollowers: true,
    comments: true,
    uploads: true,
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const { profile } = await res.json();
          setProfile({
            displayName: profile.displayName || "",
            username: profile.username || "",
            bio: profile.bio || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [isSignedIn, isLoaded, router]);

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("idle");
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName,
          username: profile.username,
          bio: profile.bio,
        }),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-[#E53935]" />
            <h1 className="text-4xl md:text-5xl font-black text-white">Settings</h1>
          </div>
          <p className="text-[#999999] text-lg">Manage your account preferences and settings</p>
        </div>

        {/* Profile Settings */}
        <section className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            👤 Profile Settings
          </h2>

          <div className="space-y-5">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Display Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => handleProfileChange("displayName", e.target.value)}
                placeholder="Your display name"
                className="w-full bg-[#1A1A1A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl px-4 py-3 text-white placeholder-[#666666] outline-none transition"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => handleProfileChange("username", e.target.value)}
                placeholder="Your username"
                className="w-full bg-[#1A1A1A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl px-4 py-3 text-white placeholder-[#666666] outline-none transition"
              />
              <p className="text-xs text-[#666666] mt-1">Your unique profile URL: /channel/{profile.username}</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
                maxLength={500}
                className="w-full bg-[#1A1A1A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-xl px-4 py-3 text-white placeholder-[#666666] outline-none transition resize-none"
              />
              <p className="text-xs text-[#666666] mt-1">{profile.bio.length}/500 characters</p>
            </div>

            {/* Save Status */}
            {saveStatus === "success" && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm font-medium">
                ✓ Profile saved successfully!
              </div>
            )}
            {saveStatus === "error" && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm font-medium">
                ✗ Error saving profile. Please try again.
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-[#E53935] hover:bg-[#C62828] disabled:bg-[#666666] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </section>

        {/* Account Section */}
        <section className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">🔐 Account</h2>

          <div className="space-y-4">
            {/* Email (Read Only) */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <input
                type="email"
                value={user?.emailAddresses[0]?.emailAddress || ""}
                disabled
                className="w-full bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl px-4 py-3 text-[#666666] cursor-not-allowed opacity-60"
              />
              <p className="text-xs text-[#666666] mt-1">Your email cannot be changed in settings</p>
            </div>

            {/* Password Management */}
            <div className="pt-4">
              <a
                href="https://dashboard.clerk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#1A1A1A] hover:bg-[#252525] border border-[#2C2C2C] text-white font-semibold py-3 px-6 rounded-xl transition"
              >
                Manage Password in Clerk Account
              </a>
              <p className="text-xs text-[#666666] mt-2">Passwords are managed through your Clerk account portal</p>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications
          </h2>

          <div className="space-y-4">
            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#2C2C2C]">
              <div>
                <p className="text-white font-semibold">Email Notifications</p>
                <p className="text-xs text-[#666666] mt-1">Receive email updates about your activity</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      emailNotifications: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2C2C2C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E53935]"></div>
              </label>
            </div>

            {/* New Followers */}
            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#2C2C2C]">
              <div>
                <p className="text-white font-semibold">New Followers</p>
                <p className="text-xs text-[#666666] mt-1">Notify when someone follows you</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.newFollowers}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      newFollowers: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2C2C2C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E53935]"></div>
              </label>
            </div>

            {/* Comments & Replies */}
            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#2C2C2C]">
              <div>
                <p className="text-white font-semibold">Comments & Replies</p>
                <p className="text-xs text-[#666666] mt-1">Notify about comments on your content</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.comments}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      comments: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2C2C2C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E53935]"></div>
              </label>
            </div>

            {/* New Content */}
            <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#2C2C2C]">
              <div>
                <p className="text-white font-semibold">New Content from Creators</p>
                <p className="text-xs text-[#666666] mt-1">Notify when creators you follow upload new content</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.uploads}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      uploads: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2C2C2C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E53935]"></div>
              </label>
            </div>

            <p className="text-xs text-[#666666] mt-4 italic">Note: Notification settings UI is ready. In-app notification system will be implemented in the next phase.</p>
          </div>
        </section>

        {/* Theme Section */}
        <section className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Moon className="w-6 h-6" />
            Theme
          </h2>

          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#2C2C2C] flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Dark Mode</p>
              <p className="text-xs text-[#666666] mt-1">Current theme</p>
            </div>
            <div className="text-2xl">🌙</div>
          </div>

          <p className="text-xs text-[#666666] mt-4">
            MORATube is optimized for dark mode. Additional themes coming soon!
          </p>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Danger Zone
          </h2>

          <div className="space-y-4">
            {/* Delete Account */}
            <div className="p-4 bg-[#1A1A1A] border border-red-500/20 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Delete Account</p>
                <p className="text-xs text-[#999999] mt-1">Permanently delete your account and all associated data</p>
              </div>
              <button
                onClick={() => {
                  alert(
                    "To delete your account, please contact support@fingrowth.online with your request. We will process your deletion request within 7 days."
                  );
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition whitespace-nowrap ml-4"
              >
                Delete Account
              </button>
            </div>

            <p className="text-xs text-red-400 italic">
              ⚠️ This action cannot be undone. For account deletion requests, please contact:{" "}
              <a href="mailto:support@fingrowth.online" className="underline hover:text-red-300">
                support@fingrowth.online
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
