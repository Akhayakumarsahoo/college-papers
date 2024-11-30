import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Loading resources...
      </p>
    </div>
  );
}
