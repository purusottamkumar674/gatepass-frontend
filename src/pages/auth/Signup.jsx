import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";

export default function Signup() {
  const navigate = useNavigate();

  const [usertype, setUsertype] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());

    payload.usertype = usertype; // ensure correct role is sent

    setLoading(true);
    try {
      const res = await api.post("/accounts/signup/", payload);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USERNAME */}
          <div className="space-y-1">
            <Label>Username</Label>
            <Input name="username" required />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" name="password" required />
          </div>

          {/* FIRST NAME */}
          <div className="space-y-1">
            <Label>First Name</Label>
            <Input name="first_name" required />
          </div>

          {/* LAST NAME */}
          <div className="space-y-1">
            <Label>Last Name</Label>
            <Input name="last_name" required />
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" name="email" required />
          </div>

          {/* SELECT USER TYPE */}
          <div className="space-y-1">
            <Label>User Type</Label>
            <Select onValueChange={setUsertype} value={usertype}>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* STUDENT FIELDS */}
          {usertype === "student" && (
            <>
              <div className="space-y-1">
                <Label>PRN</Label>
                <Input name="prn" required />
              </div>

              <div className="space-y-1">
                <Label>Branch</Label>
                <Input name="branch" required />
              </div>

              <div className="space-y-1">
                <Label>Hostel</Label>
                <Input name="hostel" required />
              </div>
            </>
          )}

          {/* STAFF FIELDS */}
          {usertype === "staff" && (
            <>
              <div className="space-y-1">
                <Label>Department</Label>
                <Input name="department" required />
              </div>

              <div className="space-y-1">
                <Label>Role</Label>
                <Select name="role">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="hod">Head of Department</SelectItem>
                    <SelectItem value="warden">Warden</SelectItem>
                    <SelectItem value="dean">Principal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </Card>
    </div>
  );
}

