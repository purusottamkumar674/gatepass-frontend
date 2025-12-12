import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/leave-requests/my/");
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    total: requests.length,
    approved: requests.filter(r => r.final_status === "Approved").length,
    pending: requests.filter(r => r.final_status === "Pending").length,
    rejected: requests.filter(r => r.final_status === "Rejected").length,
  };

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

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

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={stats.total} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      {/* Recent Requests */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Leave Requests</h3>

        {recentRequests.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No leave requests yet.
          </p>
        )}

        <div className="space-y-3">
          {recentRequests.map(req => (
            <div
              key={req.id}
              className="flex items-center justify-between border-b last:border-none pb-2"
            >
              <div>
                <p className="font-medium">{req.subject}</p>
                <p className="text-sm text-muted-foreground">
                  {req.type}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={statusColor(req.final_status)}>
                  {req.final_status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(req.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </Card>
  );
}

