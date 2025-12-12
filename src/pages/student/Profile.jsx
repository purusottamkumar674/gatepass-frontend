import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user)
    return <p className="text-center mt-10 text-red-500">User not logged in.</p>;

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  // Flags
  const isStudent = user.usertype === "student";
  const isStaff = user.usertype === "staff";

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Top Profile Card */}
      <Card className="p-6 flex items-center gap-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src="/profile.jpg" />
          <AvatarFallback>
            {user.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold">
            {fullName || user.username}
          </h2>

          {/* SHOW USERTYPE CLEANLY */}
          <p className="text-sm text-muted-foreground capitalize">
            {user.usertype === "student" ? "Student" : "Staff"}
          </p>
        </div>

        <Badge className="text-sm" variant="success">
          Active
        </Badge>
      </Card>

      {/* Details Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Account Details</h3>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Username" value={user.username} />
          <Info label="Email" value={user.email || "Not Provided"} />

          {/* Student Fields */}
          {isStudent && (
            <>
              <Info label="PRN" value={user.prn || "Not Provided"} />
              <Info label="Branch" value={user.branch || "Not Provided"} />
              <Info label="Hostel" value={user.hostel || "Not Provided"} />
            </>
          )}

          {/* Staff Fields */}
          {isStaff && (
            <>
              <Info label="Department" value={user.department || "Not Provided"} />
              <Info
                label="Role"
                value={
                  user.role
                    ? user.role.replace("_", " ").replace(/^\w/, c => c.toUpperCase())
                    : "Not Provided"
                }
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

