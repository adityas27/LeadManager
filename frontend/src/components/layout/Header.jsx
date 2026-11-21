import { LogOut, Menu, Shield, ShieldAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.jsx";
import Button from "../ui/Button";

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-sm shadow-sm lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-md">
            LM
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-zinc-900 leading-none">
              Lead<span className="text-indigo-600">Manager</span>
            </h1>
            <p className="text-xs text-zinc-500">CRM System</p>
          </div>
        </div>
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
    </header>
  );
}
