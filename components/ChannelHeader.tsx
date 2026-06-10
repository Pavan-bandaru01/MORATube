"use client";

import { useEffect, useState } from "react";
import { BellRing, Edit2, Upload } from "lucide-react";
import Link from "next/link";

interface ChannelHeaderProps {
  channelId: string;
  channelName: string;
  channelUsername: string;
  bio: string;
  subscriberCount: number;
  videoCount: number;
  avatarUrl?: string;
  isOwnChannel: boolean;
}

export default function ChannelHeader({
  channelId,
  channelName,
  channelUsername,
  bio,
  subscriberCount,
  videoCount,
  avatarUrl,
  isOwnChannel,
}: ChannelHeaderProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(subscriberCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await fetch(`/api/channels/${channelUsername}/subscribe`);
        if (res.ok) {
          const data = await res.json();
          setSubscribed(data.subscribed);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    if (!isOwnChannel) {
      checkSubscription();
    }
  }, [channelUsername, isOwnChannel]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/channels/${channelUsername}/subscribe`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setSubscribed(data.subscribed);
        setSubscribers(data.subscriberCount);
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16 mb-8 relative z-10">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0A0A0A] bg-[#141414] flex items-center justify-center text-4xl md:text-5xl font-black text-white shrink-0 shadow-xl overflow-hidden">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            channelName[0]
          )}
        </div>

        <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
          <h1 className="text-3xl font-black text-white">{channelName}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-1 text-[#999999]">
            <span className="font-semibold text-white">@{channelUsername}</span>
            <span>{subscribers} subscribers</span>
            <span>{videoCount} videos</span>
          </div>
          <p className="mt-3 text-sm text-[#999999] max-w-2xl">{bio}</p>
        </div>

        <div className="flex gap-3 mb-2 md:mb-4">
          {isOwnChannel ? (
            <>
              <Link
                href="/upload"
                className="bg-[#E53935] hover:bg-[#C62828] text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload
              </Link>
              <Link
                href="/profile/edit"
                className="bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Link>
            </>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className={`${
                subscribed
                  ? "bg-[#2C2C2C] hover:bg-[#3C3C3C]"
                  : "bg-[#E53935] hover:bg-[#C62828]"
              } text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2 disabled:opacity-60`}
            >
              {subscribed ? "Subscribed ✓" : "Subscribe"} <BellRing className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
