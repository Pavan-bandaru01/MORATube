"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/data/categories";

interface CategoryTabsProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ activeCategory, onSelect }: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative flex items-center mb-6">
      {showLeftScroll && (
        <div className="absolute left-0 z-10 h-full flex items-center bg-gradient-to-r from-[#050505] via-[#050505] to-transparent pr-8">
          <button 
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth py-1"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {showRightScroll && (
        <div className="absolute right-0 z-10 h-full flex items-center bg-gradient-to-l from-[#050505] via-[#050505] to-transparent pl-8">
          <button 
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
