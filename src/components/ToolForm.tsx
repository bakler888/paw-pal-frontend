
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CareToolItem } from "@/types";

const toolFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  count: z.coerce.number().min(1, { message: "Count must be at least 1" }),
  description: z.string().optional(),
});

type ToolFormValues = z.infer<typeof toolFormSchema>;

interface ToolFormProps {
  initialValues?: {
    name: string;
    price: number;
    count: number;
    description?: string;
  };
  onSubmit: (values: CareToolItem) => void;
  isSubmitting: boolean;
}

const ToolForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
}: ToolFormProps) => {
  // Initialize form with default values or initial values
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      price: initialValues ? initialValues.price : 0,
      count: initialValues ? initialValues.count : 1,
      description: initialValues?.description || "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: ToolFormValues) => {
    const toolData: CareToolItem = {
      name: values.name,
      price: values.price,
      count: values.count,
      description: values.description,
    };
    onSubmit(toolData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tool Name</FormLabel>
                <FormControl>
                  <Input placeholder="Tool name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Number of tools"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about the tool"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-farm-brown hover:bg-farm-brown/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loader mr-2"></div>
                <span>Saving...</span>
              </>
            ) : (
              "Save Tool"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ToolForm;
