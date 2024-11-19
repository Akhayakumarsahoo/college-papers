import { Button } from "@/components/ui/button";

("use client");

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";

const departments = [
  {
    value: "physics",
    label: "Physics",
  },
  {
    value: "chemestry",
    label: "Chemestry",
  },
  {
    value: "math",
    label: "Math",
  },
  {
    value: "cs",
    label: "CS",
  },
  {
    value: "itm",
    label: "ITM",
  },
];

export default function HomePage() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to College Papers
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Access previous year questions, notes, and more for your
                  college studies.
                </p>
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[220px] justify-between"
                  >
                    Select Your Department...
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search Department..." />
                    <CommandList>
                      <CommandEmpty>No Department found.</CommandEmpty>
                      <CommandGroup>
                        {departments.map((department) => (
                          <Link
                            to={`/posts/${department.value}`}
                            key={department.value}
                            value={department.value}
                          >
                            <CommandItem>{department.label}</CommandItem>
                          </Link>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
