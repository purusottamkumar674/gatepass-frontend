import { useNavigate } from "react-router-dom";

export default function SidebarLink({ label, to, active, icon: Icon }) {
  const navigate = useNavigate();

  const full = (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
      ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  const iconOnly = (
    <button
      onClick={() => navigate(to)}
      className={`p-2 rounded-lg grid place-items-center transition
      ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );

  return { full, iconOnly };
}


