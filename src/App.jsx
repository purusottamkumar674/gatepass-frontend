import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

// Auth pages
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/NotFound";
import Signup from "@/pages/auth/Signup";

// Student pages
import Dashboard from "@/pages/student/Dashboard";
import ApplyLeave from "@/pages/student/ApplyLeave";
import MyRequests from "@/pages/student/MyRequests";
import Profile from "@/pages/student/Profile";

// Layout
import AppShell from "@/components/layout/AppShell";
import SidebarLink from "@/components/layout/SidebarLink";

// Icons
import { Home, FileText, ListTodo, User } from "lucide-react";

export default function App() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/student-dashboard", icon: Home },
    { label: "Apply Leave", path: "/applyleave", icon: FileText },
    { label: "My Requests", path: "/myrequests", icon: ListTodo },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <AppShell
            title="Dashboard"
            nav={navItems.map(item =>
              SidebarLink({
                label: item.label,
                to: item.path,
                icon: item.icon,
                active: location.pathname === item.path,
              })
            )}
          >
            <Outlet />
          </AppShell>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="student-dashboard" element={<Dashboard />} />
        <Route path="applyleave" element={<ApplyLeave />} />
        <Route path="myrequests" element={<MyRequests />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

