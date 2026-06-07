import ShortCard from "@/components/ShortCard";
import { getShorts } from "@/lib/actions";

export default async function ShortsPage() {
  const shorts = await getShorts();

  return (
    <div className="h-[calc(100vh-4rem)] bg-black overflow-y-auto snap-y snap-mandatory hide-scrollbar">
      <div className="flex flex-col items-center py-4 space-y-4">
        {shorts.map((short: any) => (
          <ShortCard key={short.id} short={short} />
        ))}
      </div>
    </div>
  );
}
