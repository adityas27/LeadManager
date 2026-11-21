import { formatNumber } from "../../utils/format";

export default function StatCard({ label, value, icon: Icon, pressed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
        pressed ? "border-zinc-900" : "border-zinc-200"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</span>
        <Icon className="h-4 w-4 text-zinc-400" aria-hidden="true" />
      </span>
      <span className="mt-3 block text-2xl font-semibold tracking-tight text-zinc-950">
        {formatNumber(value)}
      </span>
    </button>
  );
}
