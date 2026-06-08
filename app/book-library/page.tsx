import BookCard from "@/components/BookCard";
import { getDocuments } from "@/lib/actions";
import { categories } from "@/data/categories";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { categoryToGradient } from "@/lib/category-map";

export default async function BookLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams.category;
  const documents = await getDocuments(categoryParam);

  const books = documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    author: doc.author || "Unknown",
    description: doc.description || "",
    category: doc.category,
    coverGradient: doc.coverUrl
      ? "from-zinc-800 to-black"
      : categoryToGradient(doc.category),
    coverUrl: doc.coverUrl || undefined,
    purchaseUrl: `/documents/${doc.id}`,
    rating: 0,
    pages: doc.pageCount || 0,
    fileType: doc.fileType,
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#2C2C2C] text-[#E53935] text-sm font-semibold mb-4">
          <BookOpen className="w-4 h-4" /> Book Library
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 text-white text-balance">
          MORA Library
        </h1>
        <p className="text-[#999999] md:text-lg leading-relaxed text-balance">
          Documents and books shared by creators on MORA Tube.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-6 mb-8">
        {categories.map((category) => {
          const enumValue =
            category.id === "all"
              ? "ALL"
              : category.id.toUpperCase().replace(/-/g, "_");
          const href =
            category.id === "all"
              ? "/book-library"
              : `/book-library?category=${enumValue}`;
          const isActive =
            category.id === "all"
              ? !categoryParam || categoryParam === "ALL"
              : categoryParam === enumValue;

          return (
            <Link
              key={category.id}
              href={href}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition border ${
                isActive
                  ? "bg-[#E53935] text-white border-[#E53935]"
                  : "bg-[#141414] hover:bg-[#1F1F1F] border-[#2C2C2C] text-[#999999]"
              }`}
            >
              {category.name}
            </Link>
          );
        })}
      </div>

      {books.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <Link key={book.id} href={`/documents/${book.id}`}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#2C2C2C] rounded-2xl p-12 text-center">
          <p className="text-[#999999]">No documents in the library yet.</p>
        </div>
      )}
    </div>
  );
}
