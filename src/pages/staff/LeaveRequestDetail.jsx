import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle } from "lucide-react";

export default function LeaveRequestDetail({
  request,
  onApprove,
  onReject,
  onBack,
}) {
  const { user } = request;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold mt-2">
            Leave Application
          </h1>
        </div>

        <Badge className="bg-amber-100 text-amber-700 w-fit">
          {request.final_status}
        </Badge>
      </div>

      {/* STUDENT INFO */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Student Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Info label="Name" value={`${user.first_name} ${user.last_name}`} />
          <Info label="Username" value={user.username} />
          <Info label="PRN" value={user.prn} />
          <Info label="Branch" value={user.branch} />
          <Info label="Hostel" value={user.hostel} />
          <Info label="Parent Name" value={user.parents_name} />
        </div>

        {user.parents_number && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <a href={`tel:${user.parents_number}`}>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Parent
              </Button>
            </a>

            <a
              href={`https://wa.me/${user.parents_number}?text=${encodeURIComponent(
                `Hello ${user.parents_name}, this is regarding ${user.first_name}'s leave request (${request.subject}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        )}
      </Card>

      {/* LEAVE DETAILS */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Leave Details</h2>

        <div className="space-y-3 text-sm">
          <Info label="Type" value={request.type} />
          <Info label="Subject" value={request.subject} />
          <Info
            label="Duration"
            value={`${formatDate(request.starting_date)} → ${formatDate(
              request.ending_date
            )}`}
          />

          <div>
            <p className="text-muted-foreground">Description</p>
            <p className="mt-1 whitespace-pre-wrap">
              {request.description}
            </p>
          </div>
        </div>
      </Card>

      {/* ATTACHMENT INLINE */}
      {request.attachment && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Attachment</h2>

          {request.attachment.endsWith(".pdf") ? (
            <iframe
              src={request.attachment}
              className="w-full h-[500px] border rounded"
            />
          ) : (
            <img
              src={request.attachment}
              alt="Attachment"
              className="max-h-[500px] mx-auto rounded border"
            />
          )}
        </Card>
      )}

      {/* ACTIONS */}
      <div className="flex gap-4 pb-10">
        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => onReject(request.id)}
        >
          Reject
        </Button>
        <Button
          className="flex-1"
          onClick={() => onApprove(request.id)}
        >
          Approve
        </Button>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : "—";
}

