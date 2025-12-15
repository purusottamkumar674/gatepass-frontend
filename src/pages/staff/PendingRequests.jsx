import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { api } from "@/lib/axios";
import LeaveRequestDetail from "./LeaveRequestDetail";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/leave-requests/?status=Pending");
      // ✅ IMPORTANT FIX (pagination-safe)
      setRequests(Array.isArray(res.data.results) ? res.data.results : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load pending requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

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

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <Card className="p-6">
        <Loader className="min-h-[40vh]" label="Loading pending requests…" />
      </Card>
    );
  }

  /* ---------------- List View ---------------- */
  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Pending Leave Requests
      </h2>

      {/* Error */}
      {error && (
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && requests.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No pending leave requests.
        </div>
      )}

      {/* List */}
      {!error && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col gap-3 rounded-xl border p-4 transition
                         hover:bg-muted/40 sm:flex-row sm:items-center
                         sm:justify-between"
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

