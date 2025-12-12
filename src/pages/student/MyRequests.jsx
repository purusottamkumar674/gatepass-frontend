import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyRequests() {
  // Dummy data for now
  const requests = [
    { id: "REQ-1201", period: "12–14 Feb", reason: "Family function", status: "Pending", updated: "1h ago" },
    { id: "REQ-1190", period: "3–4 Feb", reason: "Medical", status: "Approved", updated: "2d ago" },
    { id: "REQ-1185", period: "28–29 Jan", reason: "Personal", status: "Rejected", updated: "1w ago" },
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
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>

      <div className="divide-y">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between py-3">

            {/* Left Side */}
            <div>
              <p className="font-medium">{req.id} • {req.period}</p>
              <p className="text-sm text-gray-600">{req.reason}</p>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(req.status)}>
                {req.status}
              </Badge>

              <p className="text-xs text-gray-500">{req.updated}</p>
            </div>

          </div>
        ))}
      </div>
    </Card>
  );
}

