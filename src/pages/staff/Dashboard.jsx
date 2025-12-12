import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/axios";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/api/leave-requests/");
      const data = res.data;

      setStats({
        total: data.length,
        pending: data.filter(r => r.final_status === "Pending").length,
        approved: data.filter(r => r.final_status === "Approved").length,
        rejected: data.filter(r => r.final_status === "Rejected").length,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label="Total Requests" value={stats.total} />
      <Stat label="Pending" value={stats.pending} />
      <Stat label="Approved" value={stats.approved} />
      <Stat label="Rejected" value={stats.rejected} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  );
}

