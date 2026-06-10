"use client";

import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

export default function HelpPage() {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const faqSections: FAQSection[] = [
    {
      title: "Getting Started",
      items: [
        {
          question: "How do I create an account?",
          answer: "Click Sign Up and use your email or Google account to create a free account instantly.",
        },
        {
          question: "Is MORATube free?",
          answer:
            "Yes, MORATube is completely free to watch, learn, and explore. All educational content is accessible at no cost.",
        },
        {
          question: "How do I become a Creator?",
          answer:
            "Go to Dashboard → Upgrade to Creator. You'll be able to upload videos, documents, and books to share with the community.",
        },
      ],
    },
    {
      title: "Uploading Content",
      items: [
        {
          question: "How do I upload a video?",
          answer:
            "Go to Upload → Upload Video. You must be a Creator to upload. Select your video file, add title, description, and publish.",
        },
        {
          question: "What video formats are supported?",
          answer:
            "We support MP4, MOV, and WEBM formats. Maximum file size is 2GB. Make sure your video is in landscape orientation for best results.",
        },
        {
          question: "How do I upload a book or document?",
          answer:
            "Go to Upload → Upload Document or Book. Select your PDF or document file, add cover image, title, and publish.",
        },
      ],
    },
    {
      title: "Using Features",
      items: [
        {
          question: "How does the AI Assistant work?",
          answer:
            "Ask any finance question and MORA AI answers instantly. Our AI is trained on financial concepts, market trends, and investment strategies.",
        },
        {
          question: "How do I subscribe to a channel?",
          answer:
            "Visit any creator's channel and click the Subscribe button. You'll get notifications when they upload new content.",
        },
        {
          question: "Where is my watch history?",
          answer:
            "Go to Dashboard → History to see all your previously watched videos and documents. You can clear your history anytime.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Help & Support</h1>
          <p className="text-[#999999] text-lg">Find answers to common questions about MORATube</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQ..."
              className="w-full bg-[#1A1A1A] border border-[#2C2C2C] focus:border-[#E53935]/50 rounded-full px-6 py-3 text-white placeholder-[#666666] outline-none transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999]">🔍</span>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6 mb-12">
          {faqSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => {
                  const uniqueId = `${sectionIdx}-${itemIdx}`;
                  const isExpanded = expandedIndex === uniqueId;

                  return (
                    <div
                      key={itemIdx}
                      className="bg-[#141414] border border-[#2C2C2C] rounded-lg overflow-hidden hover:border-[#E53935]/30 transition"
                    >
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : uniqueId)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#1F1F1F] transition"
                      >
                        <span className="font-semibold text-white flex-1">{item.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#E53935] transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-4 bg-[#0F0F0F] border-t border-[#2C2C2C]">
                          <p className="text-[#999999]">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-[#E53935]/10 to-transparent border border-[#E53935]/20 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Still need help?</h3>
              <p className="text-[#999999]">
                Can't find what you're looking for? Reach out to our support team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@fingrowth.online"
                className="inline-flex items-center justify-center gap-2 bg-[#E53935] hover:bg-[#C62828] text-white font-bold py-3 px-6 rounded-xl transition whitespace-nowrap"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
