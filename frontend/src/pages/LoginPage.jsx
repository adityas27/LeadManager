import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../hooks/useAuth.jsx";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username.trim(), password);
    setLoading(false);

    if (result?.ok) {
      navigate("/", { replace: true });
    } else {
      setError(result?.form || "Login failed. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="mx-auto lg:mx-0 flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-xl font-bold text-white shadow-lg">
                LM
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">LeadManager</h1>
                <p className="text-sm text-zinc-600">Sales CRM System</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">Welcome back</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Sign in to your account to manage your leads
            </p>
          </div>

          <div className="bg-white px-8 py-8 rounded-2xl shadow-lg border border-zinc-100">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2" role="alert">
                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-lg">⚠️</span>
                </div>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Field id="username" label="Username">
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-lg border border-zinc-200 py-2.5 pl-10 pr-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm shadow-sm"
                    placeholder="Enter your username"
                    autoComplete="username"
                    disabled={loading}
                    required
                  />
                </div>
              </Field>

              <Field id="password" label="Password">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-zinc-200 py-2.5 pl-10 pr-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm shadow-sm"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                </div>
              </Field>

              <Button type="submit" className="w-full py-2.5 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in to LeadManager"
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-zinc-500">
            &copy; 2026 LeadManager. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative side */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white">
        <div>
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
            <span className="text-2xl font-bold">LM</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">LeadManager</h2>
          <p className="text-indigo-100 text-lg max-w-md">
            A modern CRM system for managing your sales pipeline, tracking leads, and growing your business.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-100">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <span className="text-sm font-medium">Real-time lead tracking</span>
          </div>
          <div className="flex items-center gap-3 text-indigo-100">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <span className="text-sm font-medium">Role-based access control</span>
          </div>
          <div className="flex items-center gap-3 text-indigo-100">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <span className="text-sm font-medium">Secure JWT authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
