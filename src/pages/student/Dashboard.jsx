import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const stats = [
    { label: "Total Requests", value: 24, color: "bg-indigo-600" },
    { label: "Approved", value: 18, color: "bg-emerald-600" },
    { label: "Pending", value: 4, color: "bg-amber-500" },
    { label: "Rejected", value: 2, color: "bg-rose-600" },
  ];

  const recentRequests = [
    { id: "REQ-1201", reason: "Family function", status: "Pending", updated: "1h ago" },
    { id: "REQ-1190", reason: "Medical", status: "Approved", updated: "2d ago" },
    { id: "REQ-1185", reason: "Personal", status: "Rejected", updated: "1w ago" },
  ];

  const getStatusColor = (status) => {
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

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <Card key={item.label} className="p-4">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-2xl font-semibold mt-1">{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent Requests */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Leave Requests</h3>

        <div className="space-y-3">
          {recentRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between py-2 border-b last:border-none"
            >
              <div>
                <p className="font-medium">{req.id}</p>
                <p className="text-sm text-gray-600">{req.reason}</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                <p className="text-xs text-gray-500">{req.updated}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

