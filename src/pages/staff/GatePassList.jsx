import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {Loader} from "@/components/ui/loader";
import { api } from "@/lib/axios";

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Used: "bg-gray-100 text-gray-700",
  Expired: "bg-red-100 text-red-700",
  Revoked: "bg-yellow-100 text-yellow-700",
};

export default function GatePassListPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    fetchGatepasses();
  }, [status]);

  const fetchGatepasses = async () => {
    setLoading(true);
    const res = await api.get(
      `/api/leave-requests/gatepasses/?status=${status}`,
    );
    setData(res.data);
    setLoading(false);
  };

  if (loading) {
    return <Loader fullPage label="Loading gatepasses…" />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Gate Passes</h1>

        <div className="flex gap-2">
          {["Active", "Used", "Expired", "Revoked"].map((s) => (
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
              <th className="p-4">Code</th>
              <th className="p-4">Student</th>
              <th className="p-4">Department</th>
              <th className="p-4">Hostel</th>
              <th className="p-4">Validity</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((gp) => (
              <tr key={gp.id} className="border-b last:border-none">
                <td className="p-4 font-mono font-medium">{gp.code}</td>
                <td className="p-4">
                  <div className="font-medium">{gp.student_name}</div>
                  <div className="text-muted-foreground text-xs">
                    PRN: {gp.prn}
                  </div>
                </td>
                <td className="p-4">{gp.department}</td>
                <td className="p-4">
                  {gp.hostel || "—"} {gp.room_number && `(${gp.room_number})`}
                </td>
                <td className="p-4">
                  <div>
                    {formatDate(gp.valid_from)} → {formatDate(gp.valid_until)}
                  </div>
                  {!gp.is_valid && (
                    <p className="text-xs text-red-500">Not valid now</p>
                  )}
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
          <Card key={gp.id} className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-mono font-semibold">{gp.code}</p>
              <Badge className={STATUS_COLORS[gp.status]}>{gp.status}</Badge>
            </div>

            <div>
              <p className="font-medium">{gp.student_name}</p>
              <p className="text-sm text-muted-foreground">
                {gp.prn} • {gp.department}
              </p>
            </div>

            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">Hostel:</span>{" "}
                {gp.hostel || "—"} {gp.room_number && `(${gp.room_number})`}
              </p>
              <p>
                <span className="text-muted-foreground">Valid:</span>{" "}
                {formatDate(gp.valid_from)} → {formatDate(gp.valid_until)}
              </p>
              {!gp.is_valid && (
                <p className="text-xs text-red-500 mt-1">Currently not valid</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* PAGINATION PLACEHOLDER */}
      {data.count > data.results.length && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------------- helpers ---------------- */

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}
