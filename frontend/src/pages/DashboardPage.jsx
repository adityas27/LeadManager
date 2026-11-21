import { useEffect, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Inbox,
  Phone,
  Plus,
  Search,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import LeadFilters from "../components/leads/LeadFilters";
import LeadTable from "../components/leads/LeadTable";
import LeadFormModal from "../components/leads/LeadFormModal";
import DeleteLeadDialog from "../components/leads/DeleteLeadDialog";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { StatSkeleton, TableSkeleton } from "../components/ui/Skeleton";
import useLeadManager from "../hooks/useLeadManager";

const STATUS_CARDS = [
  { key: "NEW", label: "New", icon: Inbox },
  { key: "CONTACTED", label: "Contacted", icon: Phone },
  { key: "QUALIFIED", label: "Qualified", icon: BadgeCheck },
  { key: "LOST", label: "Lost", icon: UserX },
];

export default function DashboardPage() {
  const manager = useLeadManager();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    document.title = "Leads · Lead Manager";
  }, []);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(lead) {
    setEditing(lead);
    setFormOpen(true);
  }

  async function handleSubmit(values) {
    const result = editing
      ? await manager.updateLead(editing.id, values)
      : await manager.createLead(values);
    if (result?.ok) setFormOpen(false);
    return result;
  }

  function selectStatus(next) {
    manager.setStatus((current) => (current === next ? "" : next));
  }

  const showEmpty =
    !manager.loading &&
    !manager.refreshing &&
    !manager.error &&
    manager.leads.length === 0 &&
    !manager.hasActiveFilters;
  const showNoResults =
    !manager.loading &&
    !manager.refreshing &&
    !manager.error &&
    manager.leads.length === 0 &&
    manager.hasActiveFilters;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Dashboard</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Leads</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            Manage your sales pipeline and track leads from first contact to conversion.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add lead
        </Button>
      </header>

      {manager.statsLoading ? (
        <StatSkeleton />
      ) : (
        <section aria-label="Lead statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total"
            value={manager.stats.total}
            icon={Users}
            pressed={manager.status === ""}
            onClick={() => manager.setStatus("")}
          />
          {STATUS_CARDS.map((card) => (
            <StatCard
              key={card.key}
              label={card.label}
              value={manager.stats.by_status[card.key]}
              icon={card.icon}
              pressed={manager.status === card.key}
              onClick={() => selectStatus(card.key)}
            />
          ))}
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm" aria-busy={manager.refreshing || undefined}>
        <LeadFilters
          search={manager.search}
          status={manager.status}
          onSearchChange={manager.setSearch}
          onStatusChange={manager.setStatus}
          onClear={manager.clearFilters}
          count={manager.leads.length}
          refreshing={manager.loading || manager.refreshing}
        />

        {manager.error ? (
          <div className="flex flex-col gap-3 border-b border-red-100 bg-red-50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm text-red-800" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {manager.error}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                manager.refreshLeads();
                manager.refreshStats();
              }}
            >
              Try again
            </Button>
          </div>
        ) : null}

        {manager.loading || (manager.refreshing && manager.leads.length === 0) ? (
          <TableSkeleton />
        ) : showEmpty ? (
          <EmptyState
            icon={UserPlus}
            title="No leads yet"
            description="Add the first person you want to follow up with. You can search and filter once a few leads are in the list."
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add lead
              </Button>
            }
          />
        ) : showNoResults ? (
          <EmptyState
            icon={Search}
            title="No matching leads"
            description="Nothing matches the current name search and status filter. Clear them to see the full list."
            action={
              <Button variant="secondary" onClick={manager.clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : manager.leads.length > 0 ? (
          <div className={manager.refreshing ? "opacity-70" : undefined}>
            <LeadTable leads={manager.leads} onEdit={openEdit} onDelete={setDeleting} />
          </div>
        ) : null}
      </section>

      <LeadFormModal
        open={formOpen}
        lead={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <DeleteLeadDialog
        key={deleting?.id ?? "closed"}
        lead={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={manager.removeLead}
      />
    </div>
  );
}