import Link from "next/link";
import { PlayCircle, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl mb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-[#050505] to-black z-0"></div>
      
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-900/20 rounded-full blur-3xl opacity-50 z-0"></div>

      <div className="relative z-10 p-8 md:p-16 lg:p-20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-red-400 text-sm font-semibold">
            <Sparkles className="w-4 h-4" /> Welcome to the Money Era
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-balance">
            Watch Ideas That Change How People Think
          </h1>
          
          <p className="text-gray-400 text-lg max-w-xl text-balance">
            MORA Tube is a video-first awareness platform for finance, AI tools, wealth habits, technology, and real-life growth.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              href="/videos" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold transition flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" /> Start Watching
            </Link>
            <Link 
              href="/shorts" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-3.5 rounded-full font-bold transition"
            >
              Watch Shorts
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full relative">
          <div className="relative aspect-video rounded-2xl overflow-hidden glass box-glow transform md:rotate-2 hover:rotate-0 transition duration-500 animate-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-900/60 to-zinc-900/60"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-xl">
                <PlayCircle className="w-8 h-8 text-white ml-1" />
              </div>
              <p className="font-bold text-xl">The Psychology of Money</p>
              <p className="text-red-300 text-sm mt-1">MORA Finance • 120K views</p>
            </div>
            
            {/* UI Mock elements */}
            <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
