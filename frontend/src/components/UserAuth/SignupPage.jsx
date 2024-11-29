import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "../../hooks/use-toast.js";
import LoginPage from "./LoginPage.jsx";
import { useNavigate } from "react-router-dom";

import { GeneralContext } from "../../GeneralContext.jsx";
import { useContext } from "react";
import AxiosInstance from "@/AxiosInstance.js";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  batch: z.string().min(4, {
    message: "Please enter a valid batch year.",
  }),
  department: z.string().min(2, {
    message: "Please select a department.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender.",
  }),
});

export default function SignupPage() {
  const naviagte = useNavigate();

  const { setUser } = useContext(GeneralContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      batch: "",
      department: "",
      gender: "",
    },
  });

  async function onSubmit(values) {
    await AxiosInstance.post("/users/signup", { ...values })
      .then(({ data }) => {
        toast({
          title: data.message,
        });
        setUser(data.data);
        naviagte("/");
      })
      .catch((error) => console.error("Error signing up", error));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-8 py-4 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="itm">ITM</SelectItem>
                        <SelectItem value="phy">Physics</SelectItem>
                        <SelectItem value="chem">Chemestry</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="bot">Botany</SelectItem>
                        <SelectItem value="zoo">Zoology</SelectItem>
                        <SelectItem value="ele">Electronics</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="text-sm space-x-2">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <span className="font-medium text-primary">
            <LoginPage />
          </span>
        </div>
      </div>
    </div>
  );
}
