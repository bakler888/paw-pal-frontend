
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Animal } from "@/types";
import { animalFormSchema, AnimalFormValues } from "./animal-form/AnimalFormSchema";
import TextInputField from "./animal-form/TextInputField";
import NumberInputField from "./animal-form/NumberInputField";
import SelectField from "./animal-form/SelectField";
import TextareaField from "./animal-form/TextareaField";

interface AnimalFormProps {
  initialValues?: {
    name: string;
    animalPrice: number;
    animalcount: number;
    description?: string;
    buyorsale: string | number;
  };
  onSubmit: (values: Animal) => void;
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
      animalPrice: initialValues ? initialValues.animalPrice : 0,
      animalcount: initialValues ? initialValues.animalcount : 1,
      description: initialValues?.description || "",
      buyorsale: initialValues?.buyorsale === "buy" || initialValues?.buyorsale === 0 ? "buy" : "sale",
    },
  });

  // Handle form submission
  const handleSubmit = (values: AnimalFormValues) => {
    const animalData: Animal = {
      name: values.name,
      animalPrice: values.animalPrice,
      animalcount: values.animalcount,
      description: values.description,
      buyorsale: values.buyorsale,
    };
    onSubmit(animalData);
  };

  const statusOptions = [
    { value: "buy", label: "Buy" },
    { value: "sale", label: "Sale" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInputField
            form={form}
            name="name"
            label="Animal Name"
            placeholder="Animal name"
          />

          <NumberInputField
            form={form}
            name="animalPrice"
            label="Price"
            placeholder="Price"
            min="0"
            step="0.01"
          />

          <NumberInputField
            form={form}
            name="animalcount"
            label="Count"
            placeholder="Number of animals"
            min="0"
            step="1"
          />

          <SelectField
            form={form}
            name="buyorsale"
            label="Buy/Sale Status"
            placeholder="Select status"
            options={statusOptions}
          />
        </div>

        <TextareaField
          form={form}
          name="description"
          label="Description"
          placeholder="Additional notes about the animal"
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
