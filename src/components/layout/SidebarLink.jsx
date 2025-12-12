import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarLink({ label, to, icon: Icon, collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isRootDashboard = to === "/student" || to === "/staff";

  const active = isRootDashboard
    ? pathname === to
    : pathname === to || pathname.startsWith(to + "/");

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          active
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-700 hover:bg-gray-100"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

