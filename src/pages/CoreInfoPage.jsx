import { useCoreData } from "@/context/CoreDataContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, GraduationCap, Users } from "lucide-react";

export default function CoreInfoPage() {
  const { departments, hostels } = useCoreData();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Campus Information</h1>
        <p className="text-sm text-muted-foreground">
          Departments and residential facilities available on campus
        </p>
      </div>

      {/* DEPARTMENTS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Departments</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{dept.name}</h3>
                {dept.is_active && (
                  <Badge variant="secondary">Active</Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                Code: <span className="font-mono">{dept.code}</span>
              </p>

              <p className="text-xs text-muted-foreground">
                Created on{" "}
                {new Date(dept.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* HOSTELS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Hostels</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostels.map((hostel) => (
            <Card key={hostel.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{hostel.name}</h3>
                <Badge variant="outline" className="capitalize">
                  {hostel.hostel_type}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Capacity: {hostel.total_capacity}
              </div>

              <div className="flex flex-wrap gap-2">
                {hostel.is_active && (
                  <Badge variant="secondary">Active</Badge>
                )}
                {hostel.warden && (
                  <Badge>{hostel.warden_name}</Badge>
                )}
                {!hostel.warden && (
                  <Badge variant="outline">No Warden</Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Created on{" "}
                {new Date(hostel.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

