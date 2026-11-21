import { Pencil, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";
import { labelFor, SOURCES } from "../../utils/constants";
import { formatDate } from "../../utils/format";

function Actions({ lead, onEdit, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        className="h-9 w-9 px-0"
        aria-label={`Edit ${lead.name}`}
        onClick={() => onEdit(lead)}
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        className="h-9 w-9 px-0 text-red-700 hover:bg-red-50 hover:text-red-800"
        aria-label={`Delete ${lead.name}`}
        onClick={() => onDelete(lead)}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

export default function LeadTable({ leads, onEdit, onDelete }) {
  return (
    <>
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <caption className="sr-only">Leads</caption>
            <thead>
              <tr className="border-b border-zinc-100 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <th scope="col" className="px-5 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Email</th>
                <th scope="col" className="px-4 py-3 font-medium">Phone</th>
                <th scope="col" className="px-4 py-3 font-medium">Company</th>
                <th scope="col" className="px-4 py-3 font-medium">Source</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Created</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80">
                  <td className="px-5 py-3.5 text-sm font-medium text-zinc-950">{lead.name}</td>
                  <td className="max-w-[14rem] truncate px-4 py-3.5 text-sm text-zinc-700" title={lead.email}>
                    {lead.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-zinc-700">{lead.phone}</td>
                  <td className="max-w-[12rem] truncate px-4 py-3.5 text-sm text-zinc-700" title={lead.company}>
                    {lead.company}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-zinc-700">
                    {labelFor(SOURCES, lead.source)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-zinc-600">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-4 py-2">
                    <Actions lead={lead} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="divide-y divide-zinc-100 md:hidden">
        {leads.map((lead) => (
          <li key={lead.id} className="space-y-3 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-950">{lead.name}</p>
                <p className="mt-0.5 text-sm text-zinc-600">{lead.company}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div className="col-span-2">
                <dt className="text-xs text-zinc-500">Email</dt>
                <dd className="break-all text-zinc-800">{lead.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Phone</dt>
                <dd className="text-zinc-800">{lead.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Source</dt>
                <dd className="text-zinc-800">{labelFor(SOURCES, lead.source)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-zinc-500">Created</dt>
                <dd className="text-zinc-800">{formatDate(lead.created_at)}</dd>
              </div>
            </dl>
            <Actions lead={lead} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  );
}
