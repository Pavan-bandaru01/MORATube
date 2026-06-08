import ShortCard from "@/components/ShortCard";
import { getShorts } from "@/lib/actions";

export default async function ShortsPage() {
  const shorts = await getShorts();

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#0A0A0A] overflow-y-auto snap-y snap-mandatory hide-scrollbar">
      {shorts.length > 0 ? (
        shorts.map((short) => <ShortCard key={short.id} short={short} />)
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-[#999999]">No shorts available yet.</p>
        </div>
      )}
    </div>
  );
}
