"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Globe, ArrowRight, Target, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
 FormDescription,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const items = [
 {
  id: "all",
  label: "All Pages",
  description: "Crawl every page found on the website",
  icon: Globe,
 },
 {
  id: "startWith",
  label: "Start With",
  description: "Crawl pages that start with a specific URL path",
  icon: ArrowRight,
 },
 {
  id: "one",
  label: "One Page",
  description: "Crawl only a specific page",
  icon: Target,
 },
] as const;

const FormSchema = z.object({
 items: z.array(z.string()).refine((value) => value.length === 1, {
  message: "Please select exactly one option.",
 }),
 urlPath: z
  .string()
  .optional()
  .refine((val) => {
   if (!val) return true;
   return val.startsWith("/");
  }, "Path must start with /"),
 pageUrl: z
  .string()
  .optional()
  .refine((val) => {
   if (!val) return true;
   try {
    new URL(val);
    return true;
   } catch {
    return false;
   }
  }, "Please enter a valid URL"),
});

type FormValues = z.infer<typeof FormSchema>;

export function Options() {
 const [isSubmitting, setIsSubmitting] = useState(false);

 const form = useForm<FormValues>({
  resolver: zodResolver(FormSchema),
  defaultValues: {
   items: [],
   urlPath: "",
   pageUrl: "",
  },
  mode: "onChange",
 });

 async function onSubmit(data: FormValues) {
  try {
   setIsSubmitting(true);
   // Validate required fields based on selection
   const selectedOption = data.items[0];
   if (selectedOption === "startWith" && !data.urlPath) {
    form.setError("urlPath", { message: "URL path is required" });
    return;
   }
   if (selectedOption === "one" && !data.pageUrl) {
    form.setError("pageUrl", { message: "Page URL is required" });
    return;
   }

   console.log("data", data);
   await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
   setIsSubmitting(false);
  }
 }

 const selectedOption = form.watch("items")[0];

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-8">
    <FormField
     control={form.control}
     name="items"
     render={() => (
      <FormItem className="space-y-4">
       <div className="space-y-2">
        <FormLabel className="text-lg font-semibold">
         Crawling Options
        </FormLabel>
        <p className="text-sm text-muted-foreground">
         Choose how you want to crawl the website. Select an option and provide
         additional details if needed.
        </p>
       </div>
       {items.map((item) => (
        <FormField
         key={item.id}
         control={form.control}
         name="items"
         render={({ field }) => {
          const Icon = item.icon;
          const isSelected = field.value?.includes(item.id);

          return (
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            key={item.id}
           >
            <FormItem className="space-y-2">
             <div
              className={cn(
               "flex flex-col space-y-2 rounded-lg border border-transparent",
               isSelected && "border-primary bg-primary/5"
              )}
             >
              <div
               className={cn(
                "flex items-center space-x-3 p-3 hover:bg-accent/50 rounded-md transition-all cursor-pointer",
                isSelected && "bg-primary/5"
               )}
               role="button"
               tabIndex={0}
               aria-pressed={isSelected}
               aria-label={`Select ${item.label}`}
               title={item.description}
               onClick={() => {
                const newValue = isSelected ? [] : [item.id];
                field.onChange(newValue);
                if (!newValue.includes(item.id)) {
                 form.setValue("urlPath", "");
                 form.setValue("pageUrl", "");
                }
               }}
              >
               <FormControl>
                <Checkbox
                 checked={isSelected}
                 onChange={() => {
                  const newValue = isSelected ? [] : [item.id];
                  field.onChange(newValue);
                  if (!newValue.includes(item.id)) {
                   form.setValue("urlPath", "");
                   form.setValue("pageUrl", "");
                  }
                 }}
                 aria-label={`Checkbox for ${item.label}`}
                />
               </FormControl>
               <div className="flex items-center space-x-3 flex-1">
                <Icon
                 className={cn(
                  "h-5 w-5 text-muted-foreground",
                  isSelected && "text-primary"
                 )}
                />
                <div>
                 <FormLabel className="font-medium cursor-pointer">
                  {item.label}
                 </FormLabel>
                 <FormDescription className="text-xs">
                  {item.description}
                 </FormDescription>
                </div>
               </div>
              </div>
              <AnimatePresence mode="wait">
               {item.id === "startWith" && isSelected && (
                <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 transition={{ duration: 0.2 }}
                 className="overflow-hidden"
                >
                 <div className="px-11 pb-3">
                  <FormField
                   control={form.control}
                   name="urlPath"
                   render={({ field }) => (
                    <FormItem>
                     <FormControl>
                      <Input
                       {...field}
                       type="text"
                       placeholder="Enter starting path (e.g., /blog)"
                       className="w-full focus:ring-2"
                      />
                     </FormControl>
                     <FormMessage />
                    </FormItem>
                   )}
                  />
                 </div>
                </motion.div>
               )}
               {item.id === "one" && isSelected && (
                <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 transition={{ duration: 0.2 }}
                 className="overflow-hidden"
                >
                 <div className="px-11 pb-3">
                  <FormField
                   control={form.control}
                   name="pageUrl"
                   render={({ field }) => (
                    <FormItem>
                     <FormControl>
                      <Input
                       {...field}
                       type="url"
                       placeholder="Enter full page URL"
                       className="w-full focus:ring-2"
                      />
                     </FormControl>
                     <FormMessage />
                    </FormItem>
                   )}
                  />
                 </div>
                </motion.div>
               )}
              </AnimatePresence>
             </div>
            </FormItem>
           </motion.div>
          );
         }}
        />
       ))}
       <FormMessage />
      </FormItem>
     )}
    />
    <div className="flex justify-end space-x-2">
     <Button
      type="button"
      variant="outline"
      onClick={() => {
       form.reset();
      }}
      disabled={isSubmitting || !selectedOption}
     >
      Clear
     </Button>
     <Button type="submit" disabled={isSubmitting || !selectedOption}>
      {isSubmitting ? (
       <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing...
       </>
      ) : (
       "Start Crawling"
      )}
     </Button>
    </div>
   </form>
  </Form>
 );
}
