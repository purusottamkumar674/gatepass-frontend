import { useState } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AppShell({ title, nav, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-gray-50">
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50 h-full
          bg-white border-r transition-all duration-300
          ${collapsed ? "w-16" : "w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Card className="h-full rounded-none p-4 flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <img
                  src="/sandip_university.png"
                  alt="Logo"
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <p className="font-semibold">GatePass</p>
                  <p className="text-xs text-gray-500">
                    Campus Access
                  </p>
                </div>
              </div>
            )}

            {/* DESKTOP COLLAPSE */}
            <Button
              size="icon"
              variant="ghost"
              className="hidden md:inline-flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>

            {/* MOBILE CLOSE */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* NAV */}
          <nav className="space-y-1 flex-1 overflow-y-auto">
            {nav.map((item, index) =>
              item
                ? React.cloneElement(item, {
                    collapsed,
                    onClick: () => setMobileOpen(false),
                  })
                : null
            )}
          </nav>

          {/* PROFILE + LOGOUT */}
          <div className="mt-4 space-y-2">
            {!collapsed && user && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                <img
                  src="/profile.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">
                    {user.first_name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.usertype}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                         text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            >
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 012 2v3" />
                <path d="M21 16v3a2 2 0 01-2 2h-4" />
                <path d="M10 7l-5 5 5 5" />
                <path d="M3 12h12" />
              </svg>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </Card>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto md:ml-0">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* MOBILE MENU BUTTON */}
              <Button
                size="icon"
                variant="ghost"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                {title}
              </h1>
            </div>

            <Input
              placeholder="Search…"
              className="w-64 hidden md:block"
            />
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

