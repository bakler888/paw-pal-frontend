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
  species: z.string().min(1, { message: "Species is required" }),
  breed: z.string().min(1, { message: "Breed is required" }),
  age: z.string()
    .min(1, { message: "Age is required" })
    .transform((val) => Number(val)),
  healthStatus: z.string().min(1, { message: "Health status is required" }),
  notes: z.string().optional(),
});

type AnimalFormValues = z.infer<typeof animalFormSchema>;

interface AnimalFormProps {
  initialValues?: {
    name: string;
    species: string;
    breed: string;
    age: number;
    healthStatus: string;
    notes?: string;
  };
  onSubmit: (values: AnimalFormValues) => void;
  isSubmitting: boolean;
}

const AnimalForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
}: AnimalFormProps) => {
  // Transform the age to a string for the form
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      species: initialValues?.species || "",
      breed: initialValues?.breed || "",
      age: initialValues ? String(initialValues.age) : "",
      healthStatus: initialValues?.healthStatus || "Healthy",
      notes: initialValues?.notes || "",
    },
  });

  // Handle form submission and convert age back to number
  const handleSubmit = (values: AnimalFormValues) => {
    onSubmit({
      ...values,
      age: Number(values.age),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Species</FormLabel>
                <FormControl>
                  <Input placeholder="Species" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input placeholder="Breed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Age in years"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="healthStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select health status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="Minor Issues">Minor Issues</SelectItem>
                    <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
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
