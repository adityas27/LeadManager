import { labelFor, STATUSES } from "../../utils/constants";

const STYLES = {
  NEW: "bg-sky-50 text-sky-800 ring-sky-100",
  CONTACTED: "bg-amber-50 text-amber-900 ring-amber-100",
  QUALIFIED: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  LOST: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        STYLES[status] || STYLES.LOST
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {labelFor(STATUSES, status)}
    </span>
  );
}
