import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <img
            src="/placeholder.svg?height=200&width=300"
            alt="404 Illustration"
            className="mx-auto mb-8 rounded-lg"
          />
          <p className="mb-8">
            It seems you've ventured into uncharted academic territory. Let's
            get you back to your studies!
          </p>
          <Button asChild>
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Homepage
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
