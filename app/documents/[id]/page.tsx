import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });

  if (!document) return notFound();

  await prisma.document.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  const { userId } = await auth();
  if (userId) {
    await prisma.watchHistory.create({
      data: {
        userId,
        contentId: id,
        contentType: "DOCUMENT",
      },
    }).catch(() => {});
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A0A] text-white p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black mb-2">{document.title}</h1>
        {document.author && (
          <p className="text-[#999999] mb-1">By {document.author}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#999999]">
          <span>{document.views + 1} views</span>
          <span>•</span>
          <span>{document.fileType.toUpperCase()}</span>
          {document.pageCount && (
            <>
              <span>•</span>
              <span>{document.pageCount} pages</span>
            </>
          )}
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
          </span>
        </div>
        {document.description && (
          <p className="text-[#999999] mt-4 leading-relaxed">{document.description}</p>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden border border-[#2C2C2C] bg-[#141414]">
        {document.fileType === "pdf" ? (
          <iframe
            src={document.fileUrl}
            title={document.title}
            className="w-full h-[80vh] bg-white"
          />
        ) : (
          <div className="p-12 text-center">
            <p className="text-[#999999] mb-4">
              Preview not available for this file type.
            </p>
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#E53935] hover:bg-[#C62828] text-white rounded-full px-6 py-2.5 font-bold transition"
            >
              Download Document
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
