import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-7xl font-extrabold text-gray-800">404</h1>

      <p className="mt-4 text-lg text-gray-600">
        The page you’re looking for doesn’t exist.
      </p>

      <div className="flex gap-4 mt-6">
        {/* Go Back */}
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>

        {/* Go Home */}
        <Button onClick={() => navigate("/student-dashboard")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}

