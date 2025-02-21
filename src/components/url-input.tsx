"use client";
import { Input } from "@/components/ui/input";
// import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
 Form,
 FormField,
 FormItem,
 FormLabel,
 FormControl,
 FormMessage,
} from "@/components/ui/form";

const UrlSchema = z.object({
 url: z.string().url("Please enter a valid URL"),
});

export function UrlInput() {
 const form = useForm({
  resolver: zodResolver(UrlSchema),
  defaultValues: { url: "" },
 });

 return (
  <Form {...form}>
   <form className="flex flex-col gap-2 w-96 mb-4">
    <FormField
     control={form.control}
     name="url"
     render={({ field }) => (
      <FormItem>
       <FormLabel htmlFor="url">Enter your base url</FormLabel>
       <FormControl>
        <Input
         {...field}
         type="url"
         placeholder="https://foobar.com"
         aria-required="true"
         aria-invalid={!!form.formState.errors.url}
         aria-describedby="url-error"
        />
       </FormControl>
       <FormMessage id="url-error" />
      </FormItem>
     )}
    />
   </form>
  </Form>
 );
}
