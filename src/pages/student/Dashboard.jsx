import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { CalendarDays, FileText } from "lucide-react";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/leave-requests/my/");
      // ✅ FIX: API returns ARRAY
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Stats
     ========================= */

  const stats = useMemo(() => {
    return {
      total: requests.length,
      approved: requests.filter(r => r.final_status === "Approved").length,
      pending: requests.filter(r => r.final_status === "Pending").length,
      rejected: requests.filter(r => r.final_status === "Rejected").length,
    };
  }, [requests]);

  /* =========================
     Recent Requests
     ========================= */

  const recentRequests = useMemo(() => {
    return [...requests]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [requests]);

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Rejected":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* =========================
     Loading
     ========================= */

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== Stats ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={stats.total} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      {/* ===== Recent Requests ===== */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Leave Requests</h3>
        </div>

        {recentRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You haven’t applied for any leave yet.
          </p>
        ) : (
          <div className="space-y-4">
            {recentRequests.map(req => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b last:border-none pb-3"
              >
                {/* LEFT */}
                <div className="space-y-1">
                  <p className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {req.subject}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {req.type} Leave •{" "}
                    {formatDate(req.starting_date)} →{" "}
                    {formatDate(req.ending_date)}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  <Badge className={statusColor(req.final_status)}>
                    {req.final_status}
                  </Badge>

                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(req.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* =========================
   Stat Card
   ========================= */

function StatCard({ label, value }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </Card>
  );
}

/* =========================
   Helpers
   ========================= */

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

