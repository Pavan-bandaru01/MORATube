"use client";

import { financeLessons, financeSections } from "@/data/finance-lessons";
import { TrendingUp, BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FinancePage() {
  const [activeSection, setActiveSection] = useState(financeSections[0].id);

  const filteredLessons = financeLessons.filter((l) => l.section === activeSection);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-red-900/40 via-zinc-900 to-black border border-white/10 rounded-3xl p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-red-400 text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" /> Finance Learning Hub
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-balance">
            Money is not only earned.<br className="hidden md:block"/> Money is understood.
          </h1>
          <p className="text-gray-300 md:text-lg text-balance leading-relaxed">
            Master the rules of the money era. Learn how money moves, how debt traps work, how habits affect wealth, and how knowledge can create a better financial future.
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col gap-4">
          <div className="glass p-6 rounded-2xl w-full md:w-72 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/20 rounded-bl-full"></div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Progress</p>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-black">0</span>
              <span className="text-gray-500 font-medium mb-1">/ {financeLessons.length} lessons</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-0"></div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">Start learning today to track your progress</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-[250px_1fr] gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <h2 className="font-bold text-lg px-3 mb-4 hidden lg:block">Topics</h2>
          <div className="flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
            {financeSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium whitespace-nowrap w-full text-left ${
                  activeSection === section.id 
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                    : "bg-white/5 hover:bg-white/10 text-gray-300"
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span>{section.name}</span>
                {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto hidden lg:block" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-red-500" /> 
              {financeSections.find(s => s.id === activeSection)?.name}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="glass rounded-2xl p-6 hover:-translate-y-1 transition duration-300 flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition duration-300 border border-white/10">
                    {lesson.icon}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-md font-semibold border ${
                    lesson.level === 'Beginner' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    lesson.level === 'Practical' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    lesson.level === 'Mindset' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                    'bg-orange-500/10 border-orange-500/20 text-orange-400'
                  }`}>
                    {lesson.level}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">{lesson.description}</p>
                
                <div className="space-y-2 mb-6">
                  {lesson.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-300">{topic}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{lesson.duration} read</span>
                  <Link href={`/videos?search=${encodeURIComponent(lesson.title)}`} className="text-sm font-bold text-white hover:text-red-400 transition flex items-center gap-1">
                    Watch Video <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}