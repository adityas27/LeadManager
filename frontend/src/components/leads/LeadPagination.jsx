import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

export default function LeadPagination({
  page,
  pageSize,
  count,
  refreshing,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  if (count <= pageSize) return null;

  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, count);

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm text-zinc-500" aria-live="polite">
        Showing {firstItem}-{lastItem} of {count} leads
      </p>
      <nav className="flex items-center gap-2" aria-label="Leads pagination">
        <Button
          variant="secondary"
          className="h-9 px-2.5"
          disabled={page <= 1 || refreshing}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <span className="px-1 text-sm font-medium text-zinc-700">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          className="h-9 px-2.5"
          disabled={page >= totalPages || refreshing}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}
