export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-zinc-950">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
