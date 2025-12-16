import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { api } from "@/lib/axios";

/* ---------------- constants ---------------- */

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Used: "bg-gray-100 text-gray-700",
  Expired: "bg-red-100 text-red-700",
  Revoked: "bg-yellow-100 text-yellow-700",
};

const STATUSES = ["Active", "Used", "Expired", "Revoked"];

/* ---------------- component ---------------- */

export default function StudentGatePassListPage() {
  const navigate = useNavigate(); // ✅ NEW
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    fetchGatePasses();
  }, [status]);

  const fetchGatePasses = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/leave-requests/student/gate-passes/?status=${status}`
      );
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: open gate pass full page
  const openGatePass = (gatePass) => {
    navigate("/student/gate-pass/view", {
      state: { gatePass },
    });
  };

  if (loading) {
    return <Loader fullPage label="Loading your gate passes…" />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Gate Passes</h1>
          <p className="text-sm text-muted-foreground">
            View and verify your issued gate passes
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? "default" : "outline"}
              onClick={() => setStatus(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <Card className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left">
              <th className="p-4">Gate Pass Code</th>
              <th className="p-4">Validity</th>
              <th className="p-4">Department</th>
              <th className="p-4">Hostel</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.results.map((gp) => (
              <tr
                key={gp.id}
                onClick={() => openGatePass(gp)} // ✅ CLICKABLE
                className="border-b last:border-none hover:bg-muted/30 cursor-pointer"
              >
                <td className="p-4 font-mono font-medium">{gp.code}</td>

                <td className="p-4">
                  <div>
                    {formatDate(gp.valid_from)} →{" "}
                    {formatDate(gp.valid_until)}
                  </div>
                  {!gp.is_valid && (
                    <p className="text-xs text-red-500">
                      Not valid right now
                    </p>
                  )}
                </td>

                <td className="p-4">{gp.department}</td>

                <td className="p-4">
                  {gp.hostel || "—"}{" "}
                  {gp.room_number && `(${gp.room_number})`}
                </td>

                <td className="p-4">
                  <Badge className={STATUS_COLORS[gp.status]}>
                    {gp.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {data.results.map((gp) => (
          <Card
            key={gp.id}
            onClick={() => openGatePass(gp)} // ✅ CLICKABLE
            className="p-4 space-y-3 cursor-pointer hover:bg-muted/30"
          >
            <div className="flex justify-between items-center">
              <p className="font-mono font-semibold">{gp.code}</p>
              <Badge className={STATUS_COLORS[gp.status]}>
                {gp.status}
              </Badge>
            </div>

            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Valid:</span>{" "}
                {formatDate(gp.valid_from)} →{" "}
                {formatDate(gp.valid_until)}
              </p>

              {!gp.is_valid && (
                <p className="text-xs text-red-500">
                  Currently not valid
                </p>
              )}

              <p>
                <span className="text-muted-foreground">Department:</span>{" "}
                {gp.department}
              </p>

              <p>
                <span className="text-muted-foreground">Hostel:</span>{" "}
                {gp.hostel || "—"}{" "}
                {gp.room_number && `(${gp.room_number})`}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* EMPTY STATE */}
      {data.results.length === 0 && (
        <Card className="p-10 text-center text-muted-foreground">
          No gate passes found for this status.
        </Card>
      )}
    </div>
  );
}

/* ---------------- helpers ---------------- */

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

