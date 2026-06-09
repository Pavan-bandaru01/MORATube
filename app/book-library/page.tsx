import BookCard from "@/components/BookCard";
import { BookOpen, Upload } from "lucide-react";
import Link from "next/link";
import { categoryToGradient } from "@/lib/category-map";
import { Visibility } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const FILE_TYPES = [
  { id: "all", label: "All" },
  { id: "pdf", label: "PDFs" },
  { id: "epub", label: "Books" },
  { id: "docx", label: "Notes" },
  { id: "doc", label: "Documents" },
];

export default async function BookLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filetype?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams.category;
  const filetypeParam = resolvedParams.filetype;

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    visibility: Visibility.PUBLIC,
  };

  if (categoryParam) {
    whereClause.category = categoryParam.toUpperCase();
  }

  // Fetch documents with category filter
  let documents = await prisma.document.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  // Filter by file type in JavaScript
  if (filetypeParam && filetypeParam !== "all") {
    documents = documents.filter(
      (doc) => doc.fileType.toLowerCase() === filetypeParam.toLowerCase()
    );
  }

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
    views: doc.views,
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#2C2C2C] text-[#E53935] text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" /> Book Library
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 text-white">
            Book Library
          </h1>
          <p className="text-[#999999] md:text-lg">
            Explore documents and books shared by creators
          </p>
        </div>
        <Link
          href="/upload/document"
          className="flex items-center gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-6 py-3 rounded-full font-bold transition whitespace-nowrap"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </Link>
      </div>

      {/* File Type Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-6 mb-8">
        {FILE_TYPES.map((type) => (
          <Link
            key={type.id}
            href={
              type.id === "all"
                ? `/book-library${categoryParam ? `?category=${categoryParam}` : ""}`
                : `/book-library?filetype=${type.id}${categoryParam ? `&category=${categoryParam}` : ""}`
            }
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
              (type.id === "all" && !filetypeParam) || filetypeParam === type.id
                ? "bg-[#E53935] text-white"
                : "bg-[#141414] border border-[#2C2C2C] text-[#999999] hover:border-[#E53935]/50"
            }`}
          >
            {type.label}
          </Link>
        ))}
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="relative">
              <BookCard book={book} />
              {/* File type badge */}
              <div className="absolute top-3 right-3 bg-[#E53935] text-white text-xs px-2 py-1 rounded-lg font-semibold">
                {book.fileType?.toUpperCase() || "DOC"}
              </div>
              {/* Views count */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                {book.views} views
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="w-16 h-16 text-[#333333] mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No books yet</h2>
          <p className="text-[#999999] mb-6">Be the first to upload a document!</p>
          <Link
            href="/upload/document"
            className="bg-[#E53935] hover:bg-[#C62828] text-white px-6 py-3 rounded-full font-bold transition"
          >
            <Upload className="w-4 h-4 inline mr-2" /> Upload Document
          </Link>
        </div>
      )}
    </div>
  );
}
