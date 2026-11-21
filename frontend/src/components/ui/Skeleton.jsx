function Bone({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-zinc-200/80 ${className}`} />;
}

export function StatSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <Bone className="h-3 w-16" />
          <Bone className="mt-4 h-8 w-12" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3 p-4" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <Bone key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}
