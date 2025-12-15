import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Loading profile…</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        User not logged in.
      </p>
    );
  }

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.username;

  const isStudent = user.usertype === "student";
  const isStaff = user.usertype === "staff";

  const student = user.student_profile;
  const staff = user.staff_profile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Card */}
      <Card className="p-6 flex items-center gap-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src="/profile.jpg" />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{fullName}</h2>
          <p className="text-sm text-muted-foreground capitalize">
            {user.usertype}
          </p>
        </div>

        <Badge variant="success">Active</Badge>
      </Card>

      {/* Details */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Account Details</h3>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Username" value={user.username} />
          <Info label="Email" value={user.email || "Not Provided"} />

          {isStudent && student && (
            <>
              <Info label="PRN" value={student.prn} />
              <Info label="Department" value={student.department} />
              <Info label="Hostel" value={student.hostel} />
              <Info label="Parent Name" value={student.parents_name || "—"} />
              <Info label="Parent Number" value={student.parents_number || "—"} />
            </>
          )}

          {isStaff && staff && (
            <>
              <Info label="Department" value={staff.department} />
              <Info
                label="Role"
                value={staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
              />
              <Info
                label="Admin Approved"
                value={staff.admin_approved ? "Yes" : "No"}
              />
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

