import { BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import LoginPage from "../UserAuth/LoginPage";

export default function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 z-50 bg-background ">
      <Link to="/" className="flex items-center justify-center">
        <BookOpen className="h-6 w-6" />
        <span className="ml-2 sm:text-sm lg:text-lg font-bold">
          College Papers
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link to="/signup">
          <Button variant="outline" size="sm">
            Sign Up
          </Button>
        </Link>
        <LoginPage />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Open profile menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
