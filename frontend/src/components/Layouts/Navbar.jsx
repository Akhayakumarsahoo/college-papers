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
import LogoutPage from "../UserAuth/LogoutPage";
import { useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";
import { toast } from "@/hooks/use-toast";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.post("/api/users/refresh-token", {
        withCredentials: true,
      });
      console.log(data.data);

      if (data.success) {
        toast({
          title: `Welcome back ${data.data.user.fullName} 👋`,
        });
      }
    };
    fetchUser();
  }, [user, setUser]);

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 z-50 bg-background ">
      <Link to="/" className="flex items-center justify-center">
        <BookOpen className="h-6 w-6" />
        <span className="ml-2 sm:text-sm lg:text-lg font-bold">
          College Papers
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {!user && (
          <Link to="/signup">
            <Button variant="outline" size="sm">
              Sign Up
            </Button>
          </Link>
        )}
        {!user && <LoginPage btnType="" />}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Open profile menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.fullName || "New User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user && (
              <DropdownMenuItem>
                <Link to="/user/1">Profile</Link>
              </DropdownMenuItem>
            )}
            {user && (
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                }}
              >
                <LogoutPage btnType={"links"} />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
