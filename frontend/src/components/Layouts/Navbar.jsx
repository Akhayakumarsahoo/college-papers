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
import { useContext } from "react";
import { GeneralContext } from "../../GeneralContext";

export default function Navbar() {
  const { user } = useContext(GeneralContext);

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
              <User className="h-5 w-5" />
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
                  <Link to="/user/1">
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
                  <Link to="/signup" className="flex items-center">
                    {" "}
                    <UserPlus />
                    Sign Up
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
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
