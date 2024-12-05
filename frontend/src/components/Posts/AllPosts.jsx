import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  Filter,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "@/api/AxiosInstance";
import useValues from "@/hooks/useValues";

export default function AllPosts() {
  const navigate = useNavigate();
  const { departments, postTypes, semesters } = useValues();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    postType: [],
    department: [],
    semester: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await AxiosInstance.get("/posts");
        setPosts(data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    })();
  }, [setPosts, navigate]);

  const handleFilterChange = (category, item) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(item)
        ? prevFilters[category].filter((i) => i !== item)
        : [...prevFilters[category], item],
    }));
  };

  const filteredPosts = posts.filter(
    (post) =>
      (searchTerm === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.postType.length === 0 ||
        filters.postType.includes(post.postType)) &&
      (filters.department.length === 0 ||
        filters.department.includes(post.department)) &&
      (filters.semester.length === 0 ||
        filters.semester.includes(post.semester))
  );

  const FilterSection = ({ title, items, category }) => (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h3 className="text-sm font-medium">{title}</h3>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox
              id={`${category}-${item}`}
              checked={filters[category].includes(item)}
              onCheckedChange={() => handleFilterChange(category, item)}
            />
            <label
              htmlFor={`${category}-${item}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item}
            </label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  const FilterSidebar = () => (
    <div className="space-y-4">
      <FilterSection
        title="Department"
        items={departments}
        category="department"
      />
      <Separator />
      <FilterSection title="Semester" items={semesters} category="semester" />
      <Separator />
      <FilterSection title="Post Type" items={postTypes} category="postType" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 border-r">
        <ScrollArea className="h-[calc(100vh-56px)]">
          <div className="h-screen py-6 pr-6 pl-8">
            <h1 className="text-2xl font-bold text-center mb-5">Filters</h1>
            <FilterSidebar />
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4 lg:px-6 gap-2">
            <div className="flex-1 flex items-center"></div>
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden w-16"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pr-6">
                  <FilterSidebar />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to={"create"}>
                <Plus className=" lg:mr-2 h-4 w-4" />
                Post
              </Link>
            </Button>
          </div>
        </header>

        {/* Posts Grid */}
        <main className="flex-1 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post._id} to={`${post._id}`}>
                <Card className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-center">
                      {post.file && post.file.fileType && (
                        <>
                          {post.file.fileType.startsWith("image") ? (
                            // Render Image
                            <img
                              src={`${post.file.url}?w=150&h=150&crop=thumb`}
                              alt="File"
                              loading="lazy"
                              className=""
                            />
                          ) : post.file.fileType.endsWith(".pdf") ? (
                            // Render PDF in iframe
                            <image
                              src={`${post.file.url}`}
                              // style={{
                              //   width: "100%",
                              //   height: "500px",
                              //   border: "none",
                              // }}
                              // title="PDF Viewer"
                              alt="File"
                              loading="lazy"
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
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Sub: {post.subject}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      {post.owner?.fullName}
                      <Calendar className="h-4 w-4 ml-2 mr-1" />
                      {moment(post.createdAt).fromNow()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{post.postType}</Badge>
                      <Badge variant={"outline"}>{post.department}</Badge>
                      <Badge variant="secondary">{post.semester} sem</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
