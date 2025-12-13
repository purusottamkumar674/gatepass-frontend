import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { AUTH_EVENTS } from "@/lib/authEvents";
import { useNavigate } from "react-router-dom";

export default function SessionExpiredDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setOpen(true);

    window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handler);
    return () =>
      window.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handler);
  }, []);

  const handleConfirm = () => {
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expired</AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired for security reasons.
            Please login again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>
            Go to Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

