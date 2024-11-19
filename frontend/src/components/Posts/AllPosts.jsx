import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
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

// Mock data for posts
const posts = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    postType: "Notes",
    department: "Computer Science",
    semester: "Fall 2023",
    subject: "CS101",
    preview:
      "This is a detailed introduction to the field of computer science...",
    image: "/placeholder.svg?height=100&width=200",
  },
  // Add more mock posts as needed
];

const postTypes = ["Notes", "Exam", "Essay"];
const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
];
const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    postType: [],
    department: [],
    semester: [],
  });

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
      <FilterSection title="Post Type" items={postTypes} category="postType" />
      <Separator />
      <FilterSection
        title="Department"
        items={departments}
        category="department"
      />
      <Separator />
      <FilterSection title="Semester" items={semesters} category="semester" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 border-r">
        <ScrollArea className="h-screen py-6 pr-6 pl-8">
          <FilterSidebar />
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-6 gap-4">
            <div className="flex-1 flex items-center space-x-4">
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
            </div>
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pr-6">
                  <FilterSidebar />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Button asChild>
              <Link to="/create">
                <Plus className=" lg:mr-2 h-4 w-4" /> Create New Post
              </Link>
            </Button>
          </div>
        </header>

        {/* Posts Grid */}
        <main className="flex-1 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`${post.id}`}>
                <Card className="flex flex-col">
                  <CardHeader>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.preview}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{post.postType}</Badge>
                      <Badge variant="outline">{post.department}</Badge>
                      <Badge variant="secondary">{post.semester}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto"></CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
