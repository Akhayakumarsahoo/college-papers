import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "../../hooks/use-toast.js";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "@/api/AxiosInstance.js";
import useValues from "@/hooks/useValues.js";
import { useState } from "react";

function LogoutPage() {
  const navigate = useNavigate();
  const { setUser } = useValues();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AxiosInstance.post("/users/logout").then(({ data }) => {
        setUser(null);
        AxiosInstance.defaults.headers.common["Authorization"] = undefined;
        toast({
          title: data.message,
        });
      });
    } catch (error) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
      console.error(" Error logging out", error);
    } finally {
      setIsLoading(false);
      navigate("/");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="flex items-center cursor-pointer text-red-500 gap-2">
          <LogOut className="h-4 w-4" />
          Log out
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will end your current session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isLoading ? (
            <>
              <AlertDialogCancel disabled>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled>Logging out...</AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Log out
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutPage;
