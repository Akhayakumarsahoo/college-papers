import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary">
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to College Papers
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Access previous year questions, notes, and more for your
                  college studies.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button
                  className="w-full sm:w-auto gap-2 hover:scale-105 transition-all duration-300"
                  size="lg"
                  asChild
                >
                  <Link to="/posts">
                    Browse Papers <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  className="w-full sm:w-auto gap-2 hover:scale-105 transition-all duration-300"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <Link to="/posts/create">
                    Upload Paper <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
