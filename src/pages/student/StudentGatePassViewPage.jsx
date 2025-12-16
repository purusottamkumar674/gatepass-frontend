import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Used: "bg-gray-100 text-gray-700",
  Expired: "bg-red-100 text-red-700",
  Revoked: "bg-yellow-100 text-yellow-700",
};

export default function StudentGatePassViewPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const gatePass = state?.gatePass;

  // Safety fallback
  if (!gatePass) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Gate pass data not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-xl font-semibold">Gate Pass</h1>
          <p className="text-sm text-muted-foreground">
            Show this at the gate
          </p>
        </div>

        {/* MAIN CARD */}
        <Card className="p-6 space-y-6">
          {/* CODE + STATUS */}
          <div className="flex justify-between items-center">
            <p className="font-mono text-lg font-semibold">
              {gatePass.code}
            </p>
            <Badge className={STATUS_COLORS[gatePass.status]}>
              {gatePass.status}
            </Badge>
          </div>

          {/* VALIDITY */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Validity</p>
            <p className="font-medium">
              {formatDate(gatePass.valid_from)} →{" "}
              {formatDate(gatePass.valid_until)}
            </p>

            {gatePass.is_valid ? (
              <p className="text-xs text-green-600">
                Valid right now
              </p>
            ) : (
              <p className="text-xs text-red-500">
                Not valid at this time
              </p>
            )}
          </div>

          {/* STUDENT INFO */}
          <div className="border-t pt-4 space-y-2">
            <InfoRow label="Student" value={gatePass.student_name} />
            <InfoRow label="PRN" value={gatePass.prn} />
            <InfoRow label="Department" value={gatePass.department} />
            <InfoRow
              label="Hostel"
              value={
                gatePass.hostel
                  ? `${gatePass.hostel}${
                      gatePass.room_number
                        ? ` (${gatePass.room_number})`
                        : ""
                    }`
                  : "—"
              }
            />
          </div>

          {/* APPROVAL */}
          <div className="border-t pt-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              Approval Status
            </p>
            <p className="font-medium text-green-600">
              Approved by Authority
            </p>
            <p className="text-xs text-muted-foreground">
              Issued on {formatDate(gatePass.issued_at)}
            </p>
          </div>
        </Card>

        {/* ACTION */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString();
}

