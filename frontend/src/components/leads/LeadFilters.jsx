import { useEffect } from "react";
import { Search, X } from "lucide-react";
import { labelFor, STATUSES } from "../../utils/constants";

export default function LeadFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
  count,
  refreshing,
}) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement?.isContentEditable) {
        return;
      }
      event.preventDefault();
      document.getElementById("lead-search")?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const trimmedSearch = search.trim();
  const active = Boolean(trimmedSearch || status);
  const countLabel = refreshing
    ? "Updating leads"
    : `${count} ${count === 1 ? "lead" : "leads"}`;

  return (
    <div className="border-b border-zinc-100 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-search" className="mb-1.5 block text-sm font-medium text-zinc-800">
              Search by name
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                id="lead-search"
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search leads"
                autoComplete="off"
                className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-9 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="lead-status-filter" className="mb-1.5 block text-sm font-medium text-zinc-800">
              Status
            </label>
            <select
              id="lead-status-filter"
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            >
              <option value="">All statuses</option>
              {STATUSES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-zinc-500 lg:pb-2.5" aria-live="polite">
          {countLabel}
          <span className="ml-3 hidden text-zinc-400 lg:inline">Press / to search</span>
        </p>
      </div>

      {active ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {trimmedSearch ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
            >
              Name: {trimmedSearch}
              <X className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Remove name filter</span>
            </button>
          ) : null}
          {status ? (
            <button
              type="button"
              onClick={() => onStatusChange("")}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
            >
              Status: {labelFor(STATUSES, status)}
              <X className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Remove status filter</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClear}
            className="rounded-full px-2 py-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}
