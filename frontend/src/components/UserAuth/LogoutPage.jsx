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
import { useContext } from "react";
import { GeneralContext } from "../../GeneralContext.jsx";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "@/AxiosInstance.js";

function LogoutPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(GeneralContext);

  const handleLogout = async () => {
    await AxiosInstance.post("/users/logout")
      .then(({ data }) => {
        setUser(null);
        navigate("/");
        toast({
          title: data.message,
        });
      })
      .catch((error) => console.error(" Error logging out", error));
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutPage;
