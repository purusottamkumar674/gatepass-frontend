import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AppShell from "@/components/layout/AppShell";
import SidebarLink from "@/components/layout/SidebarLink";

// Auth
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

import NotFound from "@/pages/NotFound";
import CoreInfoPage from "@/pages/CoreInfoPage";

// Student
import StudentDashboard from "@/pages/student/Dashboard";
import ApplyLeave from "@/pages/student/ApplyLeave";
import MyRequests from "@/pages/student/MyRequests";
import Profile from "@/pages/student/Profile";

// Staff
import StaffDashboard from "@/pages/staff/Dashboard";
import PendingRequests from "@/pages/staff/PendingRequests";

// Icons
import { Home, FileText, ListTodo, User, CheckSquare, Building } from "lucide-react";
import LeaveRequestDetail from "./pages/staff/LeaveRequestDetail";
import SessionExpiredDialog from "./components/SessionExpiredDialog";
import GatePassListPage from "./pages/staff/GatePassList";
import { Ticket } from "lucide-react";
import StudentGatePassListPage from "./pages/student/StudentGatePassListPage";
import StudentGatePassViewPage from "./pages/student/StudentGatePassViewPage";

export default function App() {
  const location = useLocation();

  const studentNav = [
    { label: "Dashboard", path: "/student", icon: Home },
    { label: "Apply Leave", path: "/student/apply-leave", icon: FileText },
    { label: "My Requests", path: "/student/my-requests", icon: ListTodo },
    { label: "GatePass", path: "/student/gatepasses", icon: Ticket},
    { label: "Campus", path: "/student/core-info", icon: Building },
    { label: "Profile", path: "/student/profile", icon: User },
  ];

  const staffNav = [
    { label: "Dashboard", path: "/staff", icon: Home },
    { label: "Pending Requests", path: "/staff/pending", icon: CheckSquare },
    { label: "GatePass", path: "/staff/gatepasses", icon: Ticket},
    { label: "Campus", path: "/staff/core-info", icon: Building },
    { label: "Profile", path: "/staff/profile", icon: User },
  ];

  return (
    <>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student */}
        <Route
          path="/student"
          element={
            <AppShell
              title="Student Dashboard"
              nav={studentNav.map((item) => (
                <SidebarLink
                  key={item.path}
                  label={item.label}
                  to={item.path}
                  icon={item.icon}
                />
              ))}
            >
              <Outlet />
            </AppShell>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="gatepasses" element={<StudentGatePassListPage/>} />
          <Route path="core-info" element={<CoreInfoPage/>} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="/student/gate-pass/view"
            element={<StudentGatePassViewPage />}
          />

        </Route>

        {/* Staff */}
        <Route
          path="/staff"
          element={
            <AppShell
              title="Staff Dashboard"
              nav={staffNav.map((item) => (
                <SidebarLink
                  key={item.path}
                  label={item.label}
                  to={item.path}
                  icon={item.icon}
                />
              ))}

            >
              <Outlet />
            </AppShell>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="pending" element={<PendingRequests />} />
          <Route path="profile" element={<Profile />} />
          <Route path="gatepasses" element={<GatePassListPage/>} />
          <Route path="core-info" element={<CoreInfoPage/>} />
          <Route
            path="/staff/leave-requests/:id"
            element={<LeaveRequestDetail />}
          />

        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
      <SessionExpiredDialog />
    </>
  );
}


