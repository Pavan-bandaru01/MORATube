"use client";

import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { useState } from "react";

export default function VideoPlayer({ url, gradient }: { url?: string, gradient: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Note: For MVP, we are using a mock player UI over the gradient.
  // In a real app with video URLs, we would use a real <video> element or react-player.

  return (
    <div 
      className="relative w-full aspect-video bg-black overflow-hidden group rounded-xl md:rounded-2xl border border-white/10"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Mock Video Content */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
      
      <div className="absolute inset-0 flex items-center justify-center">
        {!isPlaying && (
          <button 
            onClick={() => setIsPlaying(true)}
            className="w-20 h-20 rounded-full bg-red-600/90 backdrop-blur-md flex items-center justify-center hover:scale-110 transition duration-300 shadow-2xl"
          >
            <Play className="w-10 h-10 text-white ml-2" />
          </button>
        )}
      </div>

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 flex flex-col gap-2 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/progress relative">
          <div className="absolute top-0 left-0 h-full bg-red-600 w-1/3 rounded-full relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full scale-0 group-hover/progress:scale-100 transition-transform"></div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-red-500 transition">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 group/volume">
              <button onClick={() => setIsMuted(!isMuted)} className="hover:text-red-500 transition">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="w-0 overflow-hidden group-hover/volume:w-16 transition-all duration-300 h-1 bg-white/20 rounded-full flex items-center">
                <div className={`h-full bg-white rounded-full ${isMuted ? 'w-0' : 'w-2/3'}`}></div>
              </div>
            </div>
            <span className="text-xs font-medium">3:24 / 8:20</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-red-500 transition">
              <Settings className="w-5 h-5" />
            </button>
            <button className="hover:text-red-500 transition">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
