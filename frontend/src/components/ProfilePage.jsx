import { useEffect, useState } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "../hooks/use-toast.js";
import LogoutPage from "./UserAuth/LogoutPage.jsx";
import useValues from "@/hooks/useValues.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import AxiosInstance from "@/api/AxiosInstance.js";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator.jsx";
import moment from "moment";
import { Calendar } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  batch: z.string().min(2, {
    message: "Please enter a valid batch year.",
  }),
  department: z.string().min(2, {
    message: "Please select a department.",
  }),
});

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const { user, setUser, departments, years } = useValues();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user.fullName,
      batch: user.batch,
      department: user.department,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await AxiosInstance.get("/users/user-data");
        setUser(data.data);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [setUser]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await AxiosInstance.get(`/posts/user/${user._id}`);
        setUserPosts(data.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user]);

  async function onSubmit(values) {
    try {
      const { data } = await AxiosInstance.put("/users/update-account", {
        ...values,
      });
      setUser(data.data);
      toast({
        title: data.message,
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="posts">My Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback>
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.fullName}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="space-x-2 pt-1">
                    <Badge variant={"outline"}>{user.department}</Badge>
                    <Badge variant={"secondary"}>Batch {user.batch}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <Input {...field} placeholder="Select a year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                              {departments.map((department) => (
                                <SelectItem
                                  key={department}
                                  value={department}
                                >{`${department}`}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  <Button
                    className="mt-4 mr-5"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                  <div className="pt-2">
                    <LogoutPage />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>My Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {userPosts.map((post) => (
                  <Link
                    to={`/posts/${post._id}`}
                    key={post._id}
                    className="mb-4 last:mb-0"
                  >
                    <h3 className="text-lg font-semibold flex">
                      {post.title}
                      <div className="flex items-center text-xs pl-2 text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {moment(post.createdAt).fromNow()}
                      </div>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Sub: {post.subject}
                    </p>
                    <div className="flex space-x-2 my-1">
                      <Badge>{post.postType}</Badge>
                      <Badge variant="outline">{post.department}</Badge>
                      <Badge variant="secondary">{post.semester} sem</Badge>
                    </div>
                    <Separator />
                  </Link>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={"/posts/create"}>Create New Post</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
