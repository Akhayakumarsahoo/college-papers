import { Link, useParams } from "react-router-dom";
import { Eye, ThumbsUp, User, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for a single post
const post = {
  id: 1,
  title: "Introduction to Computer Science",
  owner: "Prof. Smith",
  postType: "Notes",
  department: "Computer Science",
  semester: "Fall 2023",
  subject: "CS101",
  views: 1200,
  likes: 45,
  image: "/placeholder.svg?height=400&width=600",
  content:
    "This is a detailed introduction to the field of computer science. It covers fundamental concepts such as algorithms, data structures, and programming paradigms. Students will learn about the history of computing, binary number systems, and basic problem-solving techniques used in computer science.",
  createdAt: "2023-09-01T12:00:00Z",
};

export default function ShowPost() {
  // In a real application, you would use this id to fetch the post data
  const { department, id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4 mr-1" />
                {post.owner}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Eye className="h-4 w-4 mr-1" />
                {post.views} views
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {post.likes} likes
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{post.postType}</Badge>
            <Badge variant="secondary">{post.department}</Badge>
            <Badge variant="outline">{post.semester}</Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <BookOpen className="h-4 w-4 mr-1" />
            Subject: {post.subject}
          </div>
          <p className="text-gray-700">{post.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to={`edit`}>
            <Button variant="outline">Edit Post</Button>
          </Link>
          <Button>Download</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
