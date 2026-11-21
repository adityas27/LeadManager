import { LayoutDashboard, LogOut, Shield, ShieldAlert, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.jsx";
import Button from "../ui/Button";

export default function Header() {
  const { user, isManager, logout } = useAuth();

  const navItems = [{ to: "/", label: "Leads", icon: LayoutDashboard }];
  if (isManager) {
    navItems.push({ to: "/employees", label: "Employees", icon: UsersRound });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-sm shadow-sm lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <div className="flex h-full items-center gap-5">
          <h1 className="hidden text-lg font-semibold text-zinc-900 sm:block">
            Lead<span className="text-indigo-600">Manager</span>
          </h1>

          <nav aria-label="Primary" className="flex h-full items-stretch gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-2 text-sm font-medium transition-colors sm:px-3 ${
                      isActive
                        ? "text-indigo-700 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-indigo-600"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 mr-2">
          <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
              {user?.first_name?.[0] || user?.username?.[0] || "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-900">{user?.username}</span>
              <div className="flex items-center gap-1">
                {user?.role === "MANAGER" ? (
                  <Shield className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ShieldAlert className="h-3 w-3 text-zinc-500" />
                )}
                <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
                  {user?.role?.toLowerCase() || "guest"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={logout}
          className="h-9 px-3 text-sm"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
        </div>
      </div>
    </header>
  );
}
