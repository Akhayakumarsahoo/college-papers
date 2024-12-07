import { BookOpen, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, NavLink } from "react-router-dom";
import LoginPage from "../UserAuth/LoginPage";
import LogoutPage from "../UserAuth/LogoutPage";
import useValues from "@/hooks/useValues";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Navbar() {
  const { user } = useValues();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 z-50 bg-background ">
      <Link to="/" className="flex items-center justify-center">
        <BookOpen className="h-6 w-6" />
        <span className="ml-2 sm:text-sm lg:text-lg font-bold">
          College Papers
        </span>
      </Link>
      <div className="ml-10 lg:ml-26 flex items-center">
        <NavLink
          className={({ isActive }) =>
            `font-semibold ${
              isActive
                ? "text-black border-b border-black"
                : "text-muted-foreground"
            } hover:text-black`
          }
          to={"posts"}
        >
          All Posts
        </NavLink>
      </div>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {user ? (
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-10 w-10" />
              )}
              <span className="sr-only">Open profile menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {(user && user.fullName) || "New User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link to={`/user/${user._id}`}>
                    <User />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                  }}
                >
                  <LogoutPage />
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/signup" className="flex items-center pl-3">
                    {" "}
                    <UserPlus />
                    Sign Up
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <LoginPage />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
