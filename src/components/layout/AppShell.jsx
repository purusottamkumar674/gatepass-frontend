import { useState } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AppShell({ title, nav, children }) {
  const [collapsed, setCollapsed] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside
        className={`h-screen bg-white border-r transition-all duration-300
        ${collapsed ? "w-16" : "w-60"}`}
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
                  <p className="text-xs text-gray-500">Campus Access</p>
                </div>
              </div>
            )}

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-1 flex-1">
            {nav.map((item, index) =>
              item
                ? (
                  <div key={index}>
                    {React.cloneElement(item, { collapsed })}
                  </div>
                )
                : null
            )}
          </nav>

          {/* PROFILE + LOGOUT */}
          <div className="mt-auto space-y-2">
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
              title={collapsed ? "Logout" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${
                  collapsed
                    ? "justify-center text-gray-700 hover:bg-red-50 hover:text-red-600"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          <Input placeholder="Search…" className="w-64 hidden md:block" />
        </div>

        {children}
      </main>
    </div>
  );
}

