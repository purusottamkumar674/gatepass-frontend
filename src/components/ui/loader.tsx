import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-muted-foreground",
        className
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

