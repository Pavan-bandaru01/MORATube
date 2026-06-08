"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Zap,
  FileText,
  Book,
  Pencil,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface UploadCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  specs: string[];
  href: string;
  bgColor: string;
  accentColor: string;
  buttonText: string;
}

export default function UploadHubPage() {
  const router = useRouter();
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    fetch("/api/user/role")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile?.role === "VIEWER") {
          router.replace("/dashboard/upgrade");
        } else {
          setRoleChecked(true);
        }
      })
      .catch(() => router.replace("/sign-in"));
  }, [router]);

  const uploadCards: UploadCard[] = [
    {
      id: "video",
      icon: <Play className="w-8 h-8" />,
      title: "Upload Video",
      description: "Share finance tutorials, investment guides, money tips",
      specs: ["MP4, MOV, WEBM", "Max 2GB"],
      href: "/upload/video",
      bgColor: "#1A0000",
      accentColor: "#E53935",
      buttonText: "Upload Video",
    },
    {
      id: "short",
      icon: <Zap className="w-8 h-8" />,
      title: "Upload Short",
      description: "60-second money tips, daily motivation, quick facts",
      specs: ["MP4, MOV", "Max 60 seconds", "Vertical 9:16"],
      href: "/upload/short",
      bgColor: "#1A0F00",
      accentColor: "#FF6B00",
      buttonText: "Upload Short",
    },
    {
      id: "document",
      icon: <FileText className="w-8 h-8" />,
      title: "Upload Document",
      description: "Research papers, financial reports, investment analysis",
      specs: ["PDF, DOCX, TXT", "Max 50MB"],
      href: "/upload/document",
      bgColor: "#000A1A",
      accentColor: "#1565C0",
      buttonText: "Upload Document",
    },
    {
      id: "book",
      icon: <Book className="w-8 h-8" />,
      title: "Upload Book",
      description: "Finance books, investment guides, wealth building resources",
      specs: ["PDF, EPUB", "Max 100MB"],
      href: "/upload/book",
      bgColor: "#001A00",
      accentColor: "#2E7D32",
      buttonText: "Upload Book",
    },
    {
      id: "notes",
      icon: <Pencil className="w-8 h-8" />,
      title: "Write Notes",
      description: "Share finance tips, investment insights, money lessons",
      specs: ["Text only", "No file needed"],
      href: "/upload/notes",
      bgColor: "#0F001A",
      accentColor: "#6A1B9A",
      buttonText: "Write Notes",
    },
  ];

  if (!roleChecked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E53935]" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-16 px-4 md:px-6 lg:px-8 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            What would you like to share today?
          </h1>
          <p className="text-lg text-gray-400">
            Choose your content type to get started
          </p>
        </div>

        {/* Upload Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {uploadCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group"
            >
              <div
                className="h-full bg-[#141414] border border-[#2C2C2C] rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                style={{
                  boxShadow: `0 0 0 1px rgba(0,0,0,0.5), 0 0 40px -10px ${card.accentColor}00`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 
                    `0 0 0 2px ${card.accentColor}40, 0 0 60px 0px ${card.accentColor}30`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${card.accentColor}60`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 
                    `0 0 0 1px rgba(0,0,0,0.5), 0 0 40px -10px ${card.accentColor}00`;
                  (e.currentTarget as HTMLElement).style.borderColor = `#2C2C2C`;
                }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{ backgroundColor: `${card.accentColor}20` }}
                >
                  <div style={{ color: card.accentColor }}>
                    {card.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {card.description}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {card.specs.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${card.accentColor}15`,
                        color: card.accentColor,
                        border: `1px solid ${card.accentColor}40`,
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-between group/btn text-white"
                  style={{
                    backgroundColor: `${card.accentColor}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  {card.buttonText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-8 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold mb-4">📝 Tips for Success</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex gap-3">
              <span className="text-[#E53935]">•</span>
              <span>Use clear, descriptive titles to help people find your content</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E53935]">•</span>
              <span>Add relevant tags to improve discoverability</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E53935]">•</span>
              <span>Choose the right category so your content reaches the right audience</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E53935]">•</span>
              <span>Public content gets more visibility, private is for personal storage</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
