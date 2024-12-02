import { Link, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Calendar,
  BookOpen,
  Download,
  EllipsisVertical,
  Pencil,
  Copy,
  CopyCheck,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GeneralContext } from "@/GeneralContext";
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
} from "../ui/alert-dialog";
import AxiosInstance from "@/AxiosInstance";
import NotFoundPage from "../NotFoundPage";

export default function ShowPost() {
  const navigate = useNavigate();
  const { user } = useContext(GeneralContext);
  const [post, setPost] = useState({});
  const { id } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      await AxiosInstance.get(`/posts/${id}`)
        .then(({ data }) => {
          setPost(data.data);
          setIsOwner(data.data.owner._id === user?._id);
        })
        .catch((error) => {
          setNotFound(true);
          console.error("Error fetching post", error);
        });
    };
    fetchPost();
  }, [id, user, navigate]);

  const [copy, setCopy] = useState(false);
  const copyPath = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopy(true);
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    });
  };

  const handleDeletePost = async () => {
    await AxiosInstance.delete(`/posts/${id}`)
      .then(() => {
        setPost({});
        navigate("/posts");
      })
      .catch((error) => console.log("Error deleting post", error));
  };

  if (notFound) return <NotFoundPage />;
  return (
    <div className="container mx-auto md:px-4 md:py-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col justify-between items-start">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className="flex gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  {post.owner?.fullName}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {moment(post.createdAt).fromNow()}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="w-8 h-8 p-0 flex items-center justify-center"
                  size="icon"
                >
                  <EllipsisVertical className="w-6 h-6" />{" "}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem asChild onClick={copyPath}>
                  {!copy ? (
                    <span>
                      <Copy />
                      Copy Link
                    </span>
                  ) : (
                    <span>
                      <CopyCheck />
                      Copied!
                    </span>
                  )}
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={`edit`}>
                        <Pencil />
                        Edit Post
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <span className="text-red-500 flex items-center gap-2 ">
                            <Trash className="w-4 h-4" /> Delete
                          </span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this post?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the post and remove the data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 text-white"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {/* Render File */}
          <div className="flex justify-center border-y">
            {post.file && post.file.fileType && (
              <>
                {post.file.fileType.startsWith("image") ? (
                  // Render Image
                  <img
                    src={`${post.file.url}`}
                    className="md:w-72"
                    alt="File"
                    loading="lazy"
                  />
                ) : post.file.fileType.endsWith(".pdf") ? (
                  // Render PDF in iframe
                  <iframe
                    src={`${post.file.url}`}
                    style={{ width: "100%", height: "500px", border: "none" }}
                    title="PDF Viewer"
                    loading="lazy"
                    alt="File"
                  />
                ) : (
                  // Fallback for unsupported file types
                  <a
                    href={post.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download File
                  </a>
                )}
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge>{post.postType}</Badge>
            <Badge variant="secondary">{post.department}</Badge>
            <Badge variant="outline">{post.semester} sem</Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <BookOpen className="h-4 w-4 mr-1" />
            Subject: {post.subject}
          </div>
          {post.description && (
            <p className="text-gray-700">{post.description}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* Download Button */}
          {post.file && post.file.url && (
            <Button asChild>
              <a href={post.file.url} download={post.title}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
