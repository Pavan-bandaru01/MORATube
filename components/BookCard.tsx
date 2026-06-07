import { Star, ExternalLink, BookOpen } from "lucide-react";
import type { Book } from "@/types";

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 transition duration-300 flex flex-col h-full border border-white/10 hover:border-white/20">
      <div className={`aspect-[2/3] w-full bg-gradient-to-br ${book.coverGradient} relative overflow-hidden flex items-center justify-center p-6`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-300" />
        <h3 className="text-2xl font-black text-center leading-tight drop-shadow-xl z-10">{book.title}</h3>
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-sm font-semibold opacity-80 z-10">{book.author}</p>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 font-medium">
            {book.category}
          </span>
          <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            {book.rating}
          </div>
        </div>
        
        <h4 className="font-bold text-lg mb-1 line-clamp-1">{book.title}</h4>
        <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">{book.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <BookOpen className="w-4 h-4" />
            {book.pages} pages
          </div>
          
          {book.purchaseUrl && (
            <a 
              href={book.purchaseUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1"
            >
              Get Book <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
