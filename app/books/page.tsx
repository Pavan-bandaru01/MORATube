import BookCard from "@/components/BookCard";
import { getBooks } from "@/lib/actions";
import { BookOpen } from "lucide-react";

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-red-400 text-sm font-semibold mb-4">
          <BookOpen className="w-4 h-4" /> Essential Reading
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 text-balance">
          MORA Library
        </h1>
        <p className="text-gray-400 md:text-lg leading-relaxed text-balance">
          A curated collection of the most powerful books on money psychology, wealth building, productivity, and habits. Reading these will change your mental models.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
