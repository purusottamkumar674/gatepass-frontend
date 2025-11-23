import React, { useMemo, useState } from "react";

/**
 * Gate Pass Management – React + Tailwind UI Kit (Single-file)
 * ------------------------------------------------------------
 * - No external deps required (pure React + Tailwind classes)
 * - Contains reusable UI primitives + pages for Student/Teacher/Admin
 * - Demo state router at bottom to preview all components quickly
 *
 * How to use:
 * 1) Drop this file into a Vite/Next/CRA project with Tailwind configured.
 * 2) Import and render <GatePassApp /> in your root.
 * 3) Replace mock data + wire to your API/auth.
 */

// ===============\n// Primitives\n// ===============
const cn = (...c) => c.filter(Boolean).join(" ");

const Card = ({ className = "", children }) => (
  <div className={cn("bg-white rounded-2xl shadow-sm ring-1 ring-black/5", className)}>
    {children}
  </div>
);

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500",
    ghost: "bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-300",
    outline: "border border-gray-200 hover:bg-gray-50 text-gray-700",
    danger: "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ color = "gray", children, className = "" }) => {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    yellow: "bg-amber-100 text-amber-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", map[color], className)}>
      {children}
    </span>
  );
};

const Input = ({ label, hint, className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
    <input
      className={cn(
        "w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm",
        "px-3 py-2",
        className
      )}
      {...props}
    />
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </label>
);

const Textarea = ({ label, hint, className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
    <textarea
      className={cn(
        "w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm",
        "px-3 py-2 min-h-[100px]",
        className
      )}
      {...props}
    />
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </label>
);

const Select = ({ label, options = [], className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
    <select
      className={cn(
        "w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm",
        "px-3 py-2 bg-white",
        className
      )}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

const Table = ({ columns, rows }) => (
  <div className="overflow-hidden rounded-2xl ring-1 ring-black/5 bg-white">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-left text-gray-600">
        <tr>
          {columns.map((c) => (
            <th key={c.key} className="px-4 py-3 font-medium">
              {c.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            {columns.map((c) => (
              <td key={c.key} className="px-4 py-3 text-gray-800">
                {typeof c.render === "function" ? c.render(r[c.key], r) : r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// =====================\n// Layout: App Shell\n// =====================
const SidebarLink = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left rounded-xl px-3 py-2 text-sm font-medium",
      active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
    )}
  >
    {label}
  </button>
);

const AppShell = ({ nav, title, children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="grid grid-cols-12">
      <aside className="col-span-12 md:col-span-2 xl:col-span-2 p-3 md:p-4">
        <Card className="h-full p-3">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-600" />
            <div>
              <p className="text-sm font-semibold">GatePass</p>
              <p className="text-xs text-gray-500">Campus Access</p>
            </div>
          </div>
          <nav className="space-y-1">{nav}</nav>
        </Card>
      </aside>
      <main className="col-span-12 md:col-span-10 xl:col-span-10 p-3 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h1>
          <div className="flex items-center gap-3">
            <Input placeholder="Search…" className="w-40 md:w-64" />
            <div className="h-9 w-9 rounded-full bg-gray-200" />
          </div>
        </div>
        {children}
      </main>
    </div>
  </div>
);

// =====================\n// Auth Pages\n// =====================
export const LoginPage = ({ onSubmit, goRegister, goReset }) => (
  <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
    <Card className="grid max-w-5xl grid-cols-1 md:grid-cols-2 overflow-hidden">
      <div className="p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-600">Sign in to manage your gate passes</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.({ email: e.target.email.value });
          }}
          className="mt-6 space-y-4"
        >
          <Input name="email" label="Email" type="email" placeholder="you@college.edu" required />
          <Input name="password" label="Password" type="password" placeholder="••••••••" required />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" /> Remember me
            </label>
            <button type="button" onClick={goReset} className="text-sm text-indigo-600 hover:underline">Forgot password?</button>
          </div>
          <Button className="w-full" type="submit">Sign in</Button>
          <p className="text-center text-sm text-gray-600">
            No account?{" "}
            <button type="button" className="text-indigo-600 hover:underline" onClick={goRegister}>Create one</button>
          </p>
        </form>
      </div>
      <div className="hidden md:block bg-gray-100">
        <div className="h-full w-full grid place-items-center p-10">
          <div className="aspect-[4/5] w-full max-w-sm rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500" />
        </div>
      </div>
    </Card>
  </div>
);

export const RegisterPage = ({ goLogin }) => (
  <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
    <Card className="w-full max-w-lg p-8">
      <h2 className="text-2xl font-semibold">Create account</h2>
      <p className="text-sm text-gray-600">Join your campus gate pass system</p>
      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Full name" placeholder="Student Name" />
        <Input label="Email" type="email" placeholder="you@college.edu" />
        <Select label="Role" options={[{ value: "student", label: "Student" }, { value: "teacher", label: "Teacher/Warden" }, { value: "admin", label: "Admin" }]} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Password" type="password" placeholder="••••••••" />
          <Input label="Confirm Password" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full">Create account</Button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button type="button" className="text-indigo-600 hover:underline" onClick={goLogin}>Sign in</button>
        </p>
      </form>
    </Card>
  </div>
);

export const ResetPasswordPage = ({ goLogin }) => (
  <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
    <Card className="w-full max-w-md p-8">
      <h2 className="text-2xl font-semibold">Reset password</h2>
      <p className="text-sm text-gray-600">We will email you a reset link</p>
      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email" type="email" placeholder="you@college.edu" />
        <Button className="w-full">Send reset link</Button>
        <Button variant="ghost" className="w-full" onClick={goLogin}>Back to sign in</Button>
      </form>
    </Card>
  </div>
);

// =====================\n// Student: Dashboard + Profile + Leave\n// =====================
const StatCard = ({ label, value, trend }) => (
  <Card className="p-5">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="mt-1 text-2xl font-semibold">{value}</p>
    {trend && <p className="mt-2 text-xs text-gray-500">{trend}</p>}
  </Card>
);

export const ProfileCard = ({ user }) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-2xl bg-indigo-200" />
      <div>
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-gray-600">{user.roll} • {user.department}</p>
      </div>
      <div className="ml-auto">
        <Badge color="green">Active</Badge>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
      <div><p className="text-gray-500">Email</p><p className="font-medium">{user.email}</p></div>
      <div><p className="text-gray-500">Phone</p><p className="font-medium">{user.phone}</p></div>
      <div><p className="text-gray-500">Hostel</p><p className="font-medium">{user.hostel}</p></div>
      <div><p className="text-gray-500">Room</p><p className="font-medium">{user.room}</p></div>
    </div>
  </Card>
);

export const LeaveApplyForm = ({ onSubmit }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold">Apply for Leave</h3>
    <form
      className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const data = Object.fromEntries(f.entries());
        onSubmit?.(data);
      }}
    >
      <Input name="name" label="Name" placeholder="Student Name" />
      <Input name="roll" label="Roll Number" placeholder="21CSE001" />
      <Input name="department" label="Department" placeholder="CSE" />
      <Input name="from" label="From" type="date" />
      <Input name="to" label="To" type="date" />
      <Select name="approver" label="Approving Authority" options={[{ value: "teacher", label: "Class Teacher" }, { value: "warden", label: "Warden" }, { value: "admin", label: "Admin (final)" }]} />
      <Input name="attachment" label="Attachment" type="file" className="file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2" />
      <div className="md:col-span-2">
        <Textarea name="reason" label="Reason" placeholder="Family function / medical / personal…" />
      </div>
      <div className="md:col-span-2 flex gap-3">
        <Button type="submit">Submit Request</Button>
        <Button variant="ghost" type="reset">Reset</Button>
      </div>
    </form>
  </Card>
);

export const LeaveRequestsTable = ({ data = [] }) => {
  const columns = [
    { key: "id", title: "ID" },
    { key: "period", title: "Period" },
    { key: "reason", title: "Reason" },
    { key: "status", title: "Status", render: (v) => (
      <Badge color={v === "Approved" ? "green" : v === "Rejected" ? "red" : "yellow"}>{v}</Badge>
    ) },
    { key: "updatedAt", title: "Updated" },
    { key: "actions", title: "Actions", render: (_, r) => (
      <div className="flex gap-2">
        <Button variant="outline">View</Button>
        <Button variant="ghost">Download</Button>
      </div>
    ) },
  ];
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Leave Requests</h3>
        <div className="flex items-center gap-2">
          <Select options={[{ value: "all", label: "All" }, { value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }]} />
          <Input placeholder="Search…" />
        </div>
      </div>
      <Table columns={columns} rows={data} />
    </Card>
  );
};

export const ApprovalTimeline = ({ steps }) => (
  <ol className="relative border-l border-gray-200 ml-3">
    {steps.map((s, i) => (
      <li key={i} className="mb-6 ml-4">
        <span className={cn(
          "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full",
          s.status === "approved" && "bg-emerald-500",
          s.status === "pending" && "bg-amber-500",
          s.status === "rejected" && "bg-rose-500"
        )} />
        <h4 className="text-sm font-semibold text-gray-800">{s.label}</h4>
        <p className="text-xs text-gray-600">{s.by} • {s.time}</p>
        {s.note && <p className="mt-1 text-sm text-gray-800">{s.note}</p>}
      </li>
    ))}
  </ol>
);

export const ApprovalQueue = ({ data = [] }) => {
  const columns = [
    { key: "student", title: "Student" },
    { key: "period", title: "Period" },
    { key: "reason", title: "Reason" },
    { key: "submitted", title: "Submitted" },
    { key: "status", title: "Status", render: (v) => (
      <Badge color={v === "Pending" ? "yellow" : v === "Approved" ? "green" : "red"}>{v}</Badge>
    ) },
    { key: "actions", title: "Actions", render: (_, r) => (
      <div className="flex gap-2">
        <Button variant="success">Approve</Button>
        <Button variant="danger">Reject</Button>
      </div>
    ) },
  ];
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Approval Requests</h3>
        <div className="flex items-center gap-2">
          <Select options={[{ value: "today", label: "Today" }, { value: "week", label: "This week" }, { value: "month", label: "This month" }]} />
          <Input placeholder="Search…" />
        </div>
      </div>
      <Table columns={columns} rows={data} />
    </Card>
  );
};

// =====================\n// Calendar & Reports (lightweight)\n// =====================
export const CalendarPage = ({ year, month, events = [] }) => {
  const days = useMemo(() => {
    const d = new Date(year, month, 1);
    const out = [];
    const start = d.getDay();
    const total = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < start; i++) out.push(null);
    for (let i = 1; i <= total; i++) out.push(i);
    return out;
  }, [year, month]);

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Calendar</h3>
        <div className="flex gap-2">
          <Button variant="outline">Prev</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <div key={i} className={cn("min-h-[80px] rounded-xl border border-gray-100 p-2", d && "bg-white")}> 
            <div className="text-xs text-gray-500">{d ?? ""}</div>
            {d && events.filter(e => e.day === d).slice(0,2).map((e, idx) => (
              <Badge key={idx} color={e.type === "leave" ? "purple" : "blue"} className="mt-1 inline-block">
                {e.title}
              </Badge>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

export const ReportsPage = ({ stats }) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <Card className="p-6 col-span-1 xl:col-span-2">
      <h3 className="text-lg font-semibold mb-4">Leave Activity</h3>
      {/* Simple bar chart replacement */}
      <div className="grid grid-cols-12 gap-2 items-end h-48">
        {stats.bars.map((v, i) => (
          <div key={i} className="bg-indigo-200 rounded-t-xl" style={{ height: `${v}%` }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-12 text-center text-xs text-gray-600">
        {stats.labels.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </Card>
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Status Split</h3>
      {/* Simple donut using CSS only */}
      <div className="mx-auto grid place-items-center">
        <div className="relative h-40 w-40 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-400">
          <div className="absolute inset-4 rounded-full bg-white" />
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-400" /> Approved</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-400" /> Pending</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-400" /> Rejected</div>
      </div>
    </Card>
  </div>
);

// =====================\n// Admin: Users Table\n// =====================
export const UsersTable = ({ rows = [] }) => {
  const columns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role", render: (v) => <Badge color={v === "Admin" ? "purple" : v === "Teacher" ? "blue" : "gray"}>{v}</Badge> },
    { key: "status", title: "Status", render: (v) => <Badge color={v === "Active" ? "green" : "red"}>{v}</Badge> },
    { key: "actions", title: "Actions", render: () => (
      <div className="flex gap-2">
        <Button variant="outline">Edit</Button>
        <Button variant="danger">Delete</Button>
      </div>
    ) },
  ];
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Button>Add user</Button>
      </div>
      <Table columns={columns} rows={rows} />
    </Card>
  );
};

// =====================\n// Demo App (switch pages like your mockups)\n// =====================
export default function GatePassApp() {
  const [page, setPage] = useState("Student Dashboard");

  const navItems = [
    "Student Dashboard",
    "Apply Leave",
    "My Requests",
    "Approval Queue",
    "Calendar",
    "Users",
    "Reports",
    "Login",
    "Register",
    "Reset Password",
  ];

  const mockUser = {
    name: "Purusottam Kumar",
    roll: "21CSE001",
    department: "CSE",
    email: "pkumar@college.edu",
    phone: "+91 98765 43210",
    hostel: "BH-3",
    room: "302",
  };

  const myRequests = [
    { id: "REQ-1201", period: "12–14 Feb", reason: "Family function", status: "Pending", updatedAt: "1h ago" },
    { id: "REQ-1190", period: "3–4 Feb", reason: "Medical", status: "Approved", updatedAt: "2d ago" },
    { id: "REQ-1185", period: "28–29 Jan", reason: "Personal", status: "Rejected", updatedAt: "1w ago" },
  ];

  const approvals = [
    { student: "Ananya (21CSE045)", period: "Today", reason: "Medical", submitted: "10:45 AM", status: "Pending" },
    { student: "Ravi (21EEE022)", period: "12–13 Feb", reason: "Family", submitted: "Yesterday", status: "Pending" },
  ];

  const users = [
    { name: "Admin User", email: "admin@campus.edu", role: "Admin", status: "Active" },
    { name: "Prof. Sharma", email: "sharma@campus.edu", role: "Teacher", status: "Active" },
    { name: "Warden Rao", email: "rao@campus.edu", role: "Teacher", status: "Active" },
    { name: "Student A", email: "a@campus.edu", role: "Student", status: "Active" },
  ];

  const events = [
    { day: 4, title: "Leave: Ravi", type: "leave" },
    { day: 12, title: "Warden meet", type: "event" },
    { day: 14, title: "Leave: Ananya", type: "leave" },
  ];

  const timeline = [
    { label: "Submitted", by: "Student", time: "10:41 AM", status: "approved" },
    { label: "Class Teacher", by: "Prof. Sharma", time: "11:05 AM", status: "approved", note: "Approved. Return by Monday." },
    { label: "Warden", by: "Warden Rao", time: "—", status: "pending" },
    { label: "Admin (Final)", by: "Admin User", time: "—", status: "pending" },
  ];

  const stats = { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"], bars: [20,45,30,60,35,25,40,22,50,34,55,28,18,46] };

  // Render different pages based on nav selection
  const renderPage = () => {
    switch (page) {
      case "Student Dashboard":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Requests" value="24" trend="+3 this month" />
                <StatCard label="Approved" value="18" />
                <StatCard label="Pending" value="4" />
                <StatCard label="Rejected" value="2" />
              </div>
              <LeaveRequestsTable data={myRequests} />
            </div>
            <div className="space-y-6">
              <ProfileCard user={mockUser} />
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Current Request</h3>
                <ApprovalTimeline steps={timeline} />
              </Card>
            </div>
          </div>
        );
      case "Apply Leave":
        return <LeaveApplyForm onSubmit={(d) => alert("Submitted: " + JSON.stringify(d, null, 2))} />;
      case "My Requests":
        return <LeaveRequestsTable data={myRequests} />;
      case "Approval Queue":
        return <ApprovalQueue data={approvals} />;
      case "Calendar":
        return <CalendarPage year={2025} month={1} events={events} />; // 0-index month
      case "Users":
        return <UsersTable rows={users} />;
      case "Reports":
        return <ReportsPage stats={stats} />;
      case "Login":
        return <LoginPage onSubmit={() => setPage("Student Dashboard")} goRegister={() => setPage("Register")} goReset={() => setPage("Reset Password")} />;
      case "Register":
        return <RegisterPage goLogin={() => setPage("Login")} />;
      case "Reset Password":
        return <ResetPasswordPage goLogin={() => setPage("Login")} />;
      default:
        return null;
    }
  };

  return (
    <AppShell
      title={page}
      nav={navItems.map((n) => (
        <SidebarLink key={n} label={n} active={page === n} onClick={() => setPage(n)} />
      ))}
    >
      {renderPage()}
    </AppShell>
  );
}
