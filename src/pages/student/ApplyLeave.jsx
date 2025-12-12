import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function ApplyLeave() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log("LEAVE REQUEST DATA:", Object.fromEntries(data.entries()));
    // Here you will call Django API later
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div className="space-y-1">
          <Label>Name</Label>
          <Input name="name" placeholder="Student Name" required />
        </div>

        {/* Roll */}
        <div className="space-y-1">
          <Label>Roll Number</Label>
          <Input name="roll" placeholder="21CSE001" required />
        </div>

        {/* Department */}
        <div className="space-y-1">
          <Label>Department</Label>
          <Input name="department" placeholder="CSE" required />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>From</Label>
            <Input type="date" name="from" required />
          </div>

          <div className="space-y-1">
            <Label>To</Label>
            <Input type="date" name="to" required />
          </div>
        </div>

        {/* Approver */}
        <div className="space-y-1">
          <Label>Approving Authority</Label>

          <Select name="approver">
            <SelectTrigger>
              <SelectValue placeholder="Select Authority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="teacher">Class Teacher</SelectItem>
              <SelectItem value="warden">Warden</SelectItem>
              <SelectItem value="admin">Admin (Final)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reason */}
        <div className="space-y-1">
          <Label>Reason</Label>
          <Textarea
            name="reason"
            placeholder="Family function / Medical / Personal…"
            required
          />
        </div>

        {/* File Upload */}
        <div className="space-y-1">
          <Label>Attachment (optional)</Label>
          <Input type="file" name="attachment" />
        </div>

        <Button className="w-full mt-4" type="submit">
          Submit Leave Request
        </Button>
      </form>
    </Card>
  );
}

