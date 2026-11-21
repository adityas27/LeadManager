import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-sm font-medium text-zinc-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">Page not found</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        That address is not part of Lead Manager.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
