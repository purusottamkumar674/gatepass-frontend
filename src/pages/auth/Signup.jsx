import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { useCoreData } from "@/context/CoreDataContext";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { departments, hostels, loading: coreLoading } = useCoreData();

  const [usertype, setUsertype] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());

    payload.usertype = usertype;
    payload.department_id = Number(payload.department_id);
    if (payload.hostel_id) {
      payload.hostel_id = Number(payload.hostel_id);
    }

    try {
      setLoading(true);
      await api.post("/accounts/signup/", payload);

      toast({
        title: "Account created",
        description: "You can now login.",
      });

      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      const message =
        typeof data === "string"
          ? data
          : Object.values(data || {})[0]?.[0] ||
            "Signup failed";

      toast({
        variant: "destructive",
        title: "Signup failed",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (coreLoading) {
    return <p className="text-center mt-10">Loading…</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Username" name="username" />
          <Field label="Password" name="password" type="password" />
          <Field label="First Name" name="first_name" />
          <Field label="Last Name" name="last_name" />
          <Field label="Email" name="email" type="email" />

          {/* User Type */}
          <div className="space-y-1">
            <Label>User Type</Label>
            <Select value={usertype} onValueChange={setUsertype}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <Label>Department</Label>
            <Select name="department_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {usertype === "student" && (
            <>
              <Field label="PRN" name="prn" />
              <div className="space-y-1">
                <Label>Hostel</Label>
                <Select name="hostel_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Select hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map((h) => (
                      <SelectItem key={h.id} value={String(h.id)}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Field label="Room Number" name="room_number" />
              <Field label="Parents Name" name="parents_name" />
              <Field label="Parents Number" name="parents_number" />
            </>
          )}

          {usertype === "staff" && (
            <div className="space-y-1">
              <Label>Role</Label>
              <Select name="role" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="hod">HOD</SelectItem>
                  <SelectItem value="warden">Warden</SelectItem>
                  <SelectItem value="dean">Dean</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input {...props} required />
    </div>
  );
}

