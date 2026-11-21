import { useState } from "react";
import { LayoutDashboard, Shield, ShieldAlert, UsersRound, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.jsx";
import useMediaQuery from "../../hooks/useMediaQuery.js";

export default function Sidebar() {
  const { user, isManager } = useAuth();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [{ to: "/", label: "Dashboard", icon: LayoutDashboard }];
  if (isManager) {
    navItems.push({
      to: "/employees",
      label: "Employees",
      icon: UsersRound,
    });
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && !isDesktop && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-zinc-950/40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-md">
              LM
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-zinc-900">LeadManager</p>
              <p className="text-xs text-zinc-500">CRM System</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`
                    }
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-indigo-600" : "text-zinc-400"}`} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-zinc-100 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-md">
              {user?.first_name?.[0] || user?.username?.[0] || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">{user?.username}</p>
              <div className="flex items-center gap-1">
                {user?.role === "MANAGER" ? (
                  <Shield className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ShieldAlert className="h-3 w-3 text-zinc-500" />
                )}
                <span className="truncate text-xs text-zinc-500 capitalize">
                  {user?.role?.toLowerCase() || "guest"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
