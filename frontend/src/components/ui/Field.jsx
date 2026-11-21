export function controlClass(invalid) {
  return [
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400",
    "focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10",
    "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500",
    invalid ? "border-red-400 focus:border-red-700 focus:ring-red-700/10" : "border-zinc-200",
  ].join(" ");
}

export default function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-800">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
