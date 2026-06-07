interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 flex items-center justify-center">
      <div className="glass rounded-3xl p-10 md:p-16 text-center max-w-lg">
        <h1 className="text-3xl font-black mb-4">{title}</h1>
        <p className="text-gray-400">Coming soon</p>
      </div>
    </div>
  );
}
