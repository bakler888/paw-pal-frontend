
import { z } from "zod";

export const animalFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  animalPrice: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  animalcount: z.coerce.number().min(1, { message: "Count must be at least 1" }),
  description: z.string().optional(),
  buyorsale: z.enum(["buy", "sale"], { 
    required_error: "Buy/Sale status is required" 
  }),
});

export type AnimalFormValues = z.infer<typeof animalFormSchema>;
