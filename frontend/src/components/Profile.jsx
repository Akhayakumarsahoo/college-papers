import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "../hooks/use-toast.js";
import LogoutPage from "./UserAuth/LogoutPage.jsx";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not be longer than 160 characters.",
  }),
});

// Mock user data
const user = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  bio: "Computer Science student passionate about web development and AI.",
  avatar: "/placeholder.svg?height=100&width=100",
};

// Mock posts data
const userPosts = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    postType: "Notes",
    department: "Computer Science",
    semester: "Fall 2023",
    preview: "A comprehensive guide to using React Hooks in your projects...",
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    postType: "Essay",
    department: "Computer Science",
    semester: "Spring 2024",
    preview: "Exploring the fundamental concepts of machine learning...",
  },
  // Add more mock posts as needed
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio,
    },
  });

  function onSubmit(values) {
    // Here you would typically send the updated profile data to your backend
    console.log(values);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little bit about yourself"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            You can @mention other users and organizations to
                            link to them.
                          </FormDescription>
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
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Bio</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.bio}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="mt-4 mr-5"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                  <LogoutPage btnType="outline" />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>My Posts</CardTitle>
              <CardDescription>
                Here are the posts you've created. Click on a post to edit or
                view details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {userPosts.map((post) => (
                  <div key={post.id} className="mb-4 last:mb-0">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <div className="flex space-x-2 my-1">
                      <Badge>{post.postType}</Badge>
                      <Badge variant="outline">{post.department}</Badge>
                      <Badge variant="secondary">{post.semester}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.preview}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/create-post">Create New Post</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
