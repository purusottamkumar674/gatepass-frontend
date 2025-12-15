import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/axios";
import LeaveRequestDetail from "./LeaveRequestDetail";
import { Loader2 } from "lucide-react";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/leave-requests/?status=Pending");
      setRequests(res.data);
      setError(null);
    } catch (err) {
      setError("Unable to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    await api.post(`/api/leave-requests/${id}/approve/`);
    setSelected(null);
    fetchPending();
  };

  const reject = async (id) => {
    await api.post(`/api/leave-requests/${id}/reject/`);
    setSelected(null);
    fetchPending();
  };

  /* ---------------- Detail View ---------------- */
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

  /* ---------------- List View ---------------- */
  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Pending Leave Requests
      </h2>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Loading requests…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && requests.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No pending leave requests.
        </div>
      )}

      {/* List */}
      {!loading && !error && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col gap-3 rounded-xl border p-4 transition hover:bg-muted/40
                         sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {req.subject}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {req.user.first_name} {req.user.last_name} • {req.user.prn}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <Badge className="bg-amber-100 text-amber-700">
                  Pending
                </Badge>
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setSelected(req)}
                >
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

