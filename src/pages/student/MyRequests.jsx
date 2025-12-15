import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../lib/axios";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/api/leave-requests/my/");
        setRequests(res.data);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to load requests",
          description: "Unable to fetch your leave requests.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700";
      case "Rejected":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "—";

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">My Leave Requests</h2>
        <p className="text-sm text-muted-foreground">
          Click a request to view full details
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && requests.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No leave requests found.
        </div>
      )}

      {/* List */}
      {!loading && requests.length > 0 && (
        <Accordion type="single" collapsible className="space-y-2">
          {requests.map((req) => (
            <AccordionItem
              key={req.id}
              value={String(req.id)}
              className="border rounded-md px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="font-medium">
                      {req.subject}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {req.type} •{" "}
                      {formatDate(req.starting_date)} →{" "}
                      {formatDate(req.ending_date)}
                    </p>
                  </div>

                  <Badge className={statusColor(req.final_status)}>
                    {req.final_status}
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground mt-1">
                      {req.description}
                    </p>
                  </div>

                  {req.attachment && (
                    <div>
                      <span className="font-medium">Attachment:</span>
                      <a
                        href={req.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary underline mt-1"
                      >
                        View / Download
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-8">
                    <Badge variant="outline">
                      Teacher: {req.approvedby_teacher ? "✔" : "—"}
                    </Badge>
                    <Badge variant="outline">
                      HOD: {req.approvedby_hod ? "✔" : "—"}
                    </Badge>
                    <Badge variant="outline">
                      Dean: {req.approvedby_dean ? "✔" : "—"}
                    </Badge>
                    <Badge variant="outline">
                      Warden: {req.approvedby_warden ? "✔" : "—"}
                    </Badge>
                    <Badge variant="outline">
                      Admin: {req.approvedby_admin ? "✔" : "—"}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created at: {formatDate(req.created_at)}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Card>
  );
}

