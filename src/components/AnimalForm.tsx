
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const animalFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  animalPrice: z.string()
    .min(1, { message: "Price is required" })
    .transform((val) => Number(val)),
  animalcount: z.string()
    .min(1, { message: "Count is required" })
    .transform((val) => Number(val)),
  description: z.string().optional(),
  buyorsale: z.string().min(1, { message: "Buy/Sale status is required" }),
});

type AnimalFormValues = z.infer<typeof animalFormSchema>;

interface AnimalFormProps {
  initialValues?: {
    name: string;
    animalPrice: number;
    animalcount: number;
    description?: string;
    buyorsale: string | number;
  };
  onSubmit: (values: AnimalFormValues) => void;
  isSubmitting: boolean;
}

const AnimalForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
}: AnimalFormProps) => {
  // Initialize form with default values or initial values
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      animalPrice: initialValues ? String(initialValues.animalPrice) : "0",
      animalcount: initialValues ? String(initialValues.animalcount) : "1",
      description: initialValues?.description || "",
      buyorsale: initialValues?.buyorsale?.toString() || "buy",
    },
  });

  // Handle form submission
  const handleSubmit = (values: AnimalFormValues) => {
    onSubmit({
      ...values,
      animalPrice: Number(values.animalPrice),
      animalcount: Number(values.animalcount),
    });
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
                <FormLabel>Animal Name</FormLabel>
                <FormControl>
                  <Input placeholder="Animal name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="animalPrice"
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
            name="animalcount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Number of animals"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buyorsale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buy/Sale Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                  </SelectContent>
                </Select>
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
                  placeholder="Additional notes about the animal"
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
            className="bg-farm-green hover:bg-farm-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loader mr-2"></div>
                <span>Saving...</span>
              </>
            ) : (
              "Save Animal"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AnimalForm;
