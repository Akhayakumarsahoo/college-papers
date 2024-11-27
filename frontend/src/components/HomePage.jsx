import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex">
        <section className="w-full py-32 xl:py-48">
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
              <Button
                className="w-40 gap-6 hover:scale-105 transition-all duration-300"
                asChild
                size="lg"
                variant=""
              >
                <Link to="/posts">
                  Search Papers <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
