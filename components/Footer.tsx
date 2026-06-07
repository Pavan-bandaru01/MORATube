import Link from "next/link";
import { Globe, Mail, MessageSquare, Video } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black shadow-lg shadow-red-600/30">
                M
              </div>
              <span className="text-xl font-black tracking-tight">
                MORA<span className="text-red-500">Tube</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The video-first awareness platform designed to help you understand money behavior, discover AI tools, and build wealth habits.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-red-500 transition"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-red-500 transition"><Video className="w-5 h-5" /></a>
              <a href="#" className="hover:text-red-500 transition"><MessageSquare className="w-5 h-5" /></a>
              <a href="#" className="hover:text-red-500 transition"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Platform</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-red-400 transition">Home</Link></li>
              <li><Link href="/videos" className="hover:text-red-400 transition">Videos</Link></li>
              <li><Link href="/shorts" className="hover:text-red-400 transition">Shorts</Link></li>
              <li><Link href="/community" className="hover:text-red-400 transition">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Learn</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/finance" className="hover:text-red-400 transition">Finance Hub</Link></li>
              <li><Link href="/ai-tools" className="hover:text-red-400 transition">AI Directory</Link></li>
              <li><Link href="/ai-assistant" className="hover:text-red-400 transition">AI Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-red-400 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Creator Guidelines</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} MORA Tube LLC. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>Built with Next.js & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
