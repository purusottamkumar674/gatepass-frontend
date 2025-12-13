import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { api } from "../../lib/axios";

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "Please login again.",
      });
      return;
    }

    const user = JSON.parse(storedUser);

    const form = new FormData();
    form.append("user", Number(user.id));
    form.append("type", leaveType);
    form.append("subject", e.target.subject.value);
    form.append("description", e.target.description.value);
    form.append("starting_date", e.target.starting_date.value);

    if (e.target.ending_date.value) {
      form.append("ending_date", e.target.ending_date.value);
    }

    const fileInput = e.target.attachment;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      form.append("attachment", fileInput.files[0]);
    }

    try {
      setLoading(true);
      console.log(form)

      const res = await api.post("/api/leave-requests/", form);

      toast({
        title: "Leave request submitted",
        description: "Your request has been sent for approval.",
      });

      e.target.reset();
      setLeaveType("");
    } catch (err) {
      console.error(err.response?.data || err);

      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Check form data or server validation.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Apply for Leave</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                name="subject"
                placeholder="Short title for your leave"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                placeholder="Explain the reason for leave clearly"
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" name="starting_date" required />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" name="ending_date" />
              </div>
            </div>

            {/* Attachment */}
            <div className="space-y-2">
              <Label>Attachment (optional)</Label>
              <Input type="file" name="attachment" />
              <p className="text-sm text-muted-foreground">
                Medical certificate or supporting document
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !leaveType}
            >
              {loading ? "Submitting..." : "Submit Leave Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
