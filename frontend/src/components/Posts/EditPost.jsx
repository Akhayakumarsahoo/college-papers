import { useNavigate, useParams } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast.js";
import { useEffect, useState } from "react";
import AxiosInstance from "@/api/AxiosInstance";
import useValues from "@/hooks/useValues";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  postType: z.string().min(2, { message: "Please select a post type." }),
  department: z.string().min(2, { message: "Please select a department." }),
  semester: z.string().min(1, { message: "Please select a semester." }),
  subject: z
    .string()
    .min(2, { message: "Subject must be at least 2 characters." }),
  file: z.any().optional(),
});

export default function EditPost() {
  const navigate = useNavigate();
  const { departments, postTypes, semesters } = useValues();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      file: {},
      postType: "",
      department: "",
      semester: "",
      subject: "",
    },
  });

  useEffect(() => {
    (async () => {
      await AxiosInstance.get(`/posts/${id}/edit`)
        .then(({ data }) => {
          form.reset(data.data);
        })
        .catch((error) => {
          navigate(`/posts/${id}`);
          console.error("Error fetching post", error);
        });
    })();
  }, [id, form, navigate]);

  async function onSubmit(values) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("postType", values.postType);
    formData.append("department", values.department);
    formData.append("semester", values.semester);
    formData.append("subject", values.subject);
    formData.append("file", values.file[0]);

    await AxiosInstance.put(`/posts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
      .then(({ data }) => {
        toast({ title: data.message });
        form.reset();
        navigate(`/posts/${id}`);
      })
      .catch((error) => console.error("Error updating post", error))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[200px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Type</FormLabel>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a post type"
                          defaultValue={field.value || "Select a post type"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {postTypes.map((postType) => (
                        <SelectItem key={postType} value={`${postType}`}>
                          {postType}
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
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a department"
                          defaultValue={field.value || "Select a department"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department} value={`${department}`}>
                          {department}
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
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a semester"
                          defaultValue={field.value || ""}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={`${semester}`}>
                          {semester}
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
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload New File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf, image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a new file to replace the existing one (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/posts/${id}`)}
              >
                Cancel
              </Button>
              {isLoading ? (
                <Button type="submit" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </Button>
              ) : (
                <Button type="submit">Save</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
