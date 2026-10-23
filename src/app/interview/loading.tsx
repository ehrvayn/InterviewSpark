export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080c12] flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-96">
        <div className="h-4 bg-slate-700/30 rounded" />
        <div className="h-4 bg-slate-700/30 rounded w-5/6" />
        <div className="h-4 bg-slate-700/30 rounded w-4/6" />
        <div className="h-24 bg-slate-700/30 rounded" />
      </div>
    </div>
  );
}