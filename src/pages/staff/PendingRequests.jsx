import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/axios";
import LeaveRequestDetail from "./LeaveRequestDetail";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchPending = async () => {
    const res = await api.get("/api/leave-requests/?status=Pending");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    await api.patch(`/api/leave-requests/${id}/approve/`);
    setSelected(null);
    fetchPending();
  };

  const reject = async (id) => {
    await api.patch(`/api/leave-requests/${id}/reject/`);
    setSelected(null);
    fetchPending();
  };

  // 👉 DETAIL VIEW
  if (selected) {
    return (
      <LeaveRequestDetail
        request={selected}
        onApprove={approve}
        onReject={reject}
        onBack={() => setSelected(null)}
      />
    );
  }

  // 👉 LIST VIEW
  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Pending Leave Requests
      </h2>

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-lg p-4"
          >
            <div>
              <p className="font-medium">{req.subject}</p>
              <p className="text-sm text-muted-foreground">
                {req.user.first_name} {req.user.last_name} • {req.user.prn}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-amber-100 text-amber-700">
                Pending
              </Badge>
              <Button size="sm" onClick={() => setSelected(req)}>
                Open
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

