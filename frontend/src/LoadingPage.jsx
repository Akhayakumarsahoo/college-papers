import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Loading...
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please wait while we fetch your content.
        </p>
      </div>
    </div>
  );
}
