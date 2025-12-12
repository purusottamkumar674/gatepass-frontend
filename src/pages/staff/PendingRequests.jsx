import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/axios";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);

  const fetchPending = async () => {
    const res = await api.get("api/leave-requests/?status=Pending");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    await api.patch(`/api/leave-requests/${id}/approve/`);
    fetchPending();
  };

  const reject = async (id) => {
    await api.patch(`/api/leave-requests/${id}/reject/`);
    fetchPending();
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>

      <div className="space-y-4">
        {requests.map(req => (
          <div
            key={req.id}
            className="flex justify-between items-center border p-4 rounded-md"
          >
            <div>
              <p className="font-medium">{req.subject}</p>
              <p className="text-sm text-muted-foreground">
                Student ID: {req.user}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
              <Button size="sm" onClick={() => approve(req.id)}>
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => reject(req.id)}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

