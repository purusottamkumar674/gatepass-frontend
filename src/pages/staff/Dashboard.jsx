import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { api } from "@/lib/axios";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function StaffDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/api/leave-requests/");
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to load leave requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // ===== stats =====
  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.final_status === "Pending").length,
      approved: requests.filter(r => r.final_status === "Approved").length,
      rejected: requests.filter(r => r.final_status === "Rejected").length,
    };
  }, [requests]);

  // ===== filtered list =====
  const filteredRequests = useMemo(() => {
    if (activeStatus === "All") return requests;
    return requests.filter(r => r.final_status === activeStatus);
  }, [requests, activeStatus]);

  return (
    <div className="space-y-6">
      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Requests" value={stats.total} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="Approved" value={stats.approved} />
        <Stat label="Rejected" value={stats.rejected} />
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(status => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-1.5 rounded-full text-sm border transition
              ${
                activeStatus === status
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ===== LIST ===== */}
      <div className="space-y-4">
        {loading && <Loader className="min-h-[60vh]" label="Loading…" />}


        {!loading && filteredRequests.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No leave requests found.
          </p>
        )}

        {filteredRequests.map(req => (
          <LeaveRow key={req.id} request={req} />
        ))}
      </div>
    </div>
  );
}

/* =========================
   Leave Row Card
   ========================= */

function LeaveRow({ request }) {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <Card className="p-4 space-y-4">
      {/* ===== TOP ROW ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left */}
        <div className="space-y-1">
          <p className="font-medium">{request.subject}</p>
          <p className="text-sm text-muted-foreground">
            {request.user?.username ?? "—"}
            {request.user?.prn && ` • PRN: ${request.user.prn}`}
            {" • "}
            {formatDate(request.created_at)}
          </p>
        </div>

        {/* Final Status */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
            statusStyles[request.final_status]
          }`}
        >
          {request.final_status}
        </span>
      </div>

      {/* ===== APPROVAL STATUS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
        <ApprovalStatus
          label="HOD"
          approved={request.approvedby_hod}
          time={request.approvedby_hod_at}
        />
        <ApprovalStatus
          label="Dean"
          approved={request.approvedby_dean}
          time={request.approvedby_dean_at}
        />
        <ApprovalStatus
          label="Warden"
          approved={request.approvedby_warden}
          time={request.approvedby_warden_at}
        />
        <ApprovalStatus
          label="Admin"
          approved={request.approvedby_admin}
          time={request.approvedby_admin_at}
        />
      </div>
    </Card>
  );
}

/* =========================
   Approval Status Box
   ========================= */

function ApprovalStatus({ label, approved, time }) {
  return (
    <div className="flex flex-col items-center justify-between border rounded px-3 py-2">
      <span className="text-muted-foreground">{label}</span>

      {approved ? (
        <span className="text-green-600 text-xs">
          Approved • {formatDateTime(time)}
        </span>
      ) : (
        <span className="text-yellow-600 text-xs">Pending</span>
      )}
    </div>
  );
}

/* =========================
   Small Components
   ========================= */

function Stat({ label, value }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

function formatDateTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString();
}

