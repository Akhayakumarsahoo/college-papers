import { Link, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Calendar,
  BookOpen,
  EllipsisVertical,
  Copy,
  CopyCheck,
  Trash,
  SquarePen,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import AxiosInstance from "@/api/AxiosInstance";
import NotFoundPage from "../NotFoundPage";
import useValues from "@/hooks/useValues";
import { Avatar, AvatarFallback } from "../ui/avatar";
// import { Document, Page } from "react-pdf";

export default function ShowPost() {
  const navigate = useNavigate();
  const { user } = useValues();
  const [post, setPost] = useState({});
  const { id } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isDeleteing, setIsDeleteing] = useState(false);
  useEffect(() => {
    (async () => {
      await AxiosInstance.get(`/posts/${id}`)
        .then(({ data }) => {
          setPost(data.data);
          setIsOwner(data.data.owner._id === user?._id);
        })
        .catch((error) => {
          setNotFound(true);
          console.error("Error fetching post", error);
        });
    })();
  }, [id, user]);

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
    setIsDeleteing(true);
    await AxiosInstance.delete(`/posts/${id}`)
      .then(() => {
        setPost({});
      })
      .catch((error) => console.log("Error deleting post", error))
      .finally(() => {
        navigate("/posts");
      });
  };

  if (notFound) return <NotFoundPage />;
  return (
    <div className="container mx-auto md:px-4 md:py-4 min-h-screen">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col justify-between items-start">
              <CardTitle className="max-w-[250px] md:max-w-[350px] truncate">
                {post.title}
              </CardTitle>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  {post.owner ? (
                    <Avatar className="w-6 h-6 mr-1 text-xs font-semibold">
                      <AvatarFallback>
                        {post.owner.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                  {post.owner?.fullName}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
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
                        <SquarePen />
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
                              {isDeleteing ? (
                                <>
                                  <Loader2 className="animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>Delete</>
                              )}
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
                    src={post.file.url}
                    className="md:w-72"
                    alt="File"
                    loading="lazy"
                  />
                ) : post.file.fileType.includes("application/pdf") ? (
                  // <Document file={post.file.url}>
                  //   <Page pageNumber={1} />
                  // </Document>
                  <iframe
                    src={post.file.url}
                    className="w-full h-96"
                    title="PDF"
                    loading="lazy"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Unsupported file type: {post.file.fileType}
                  </p>
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
            <CardDescription className="">{post.description}</CardDescription>
          )}
        </CardContent>
        <CardFooter className="flex justify-end"></CardFooter>
      </Card>
    </div>
  );
}
