
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import FormFieldWrapper from "./FormField";

interface TextareaFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
}

const TextareaField = ({
  form,
  name,
  label,
  placeholder,
}: TextareaFieldProps) => {
  return (
    <FormFieldWrapper form={form} name={name} label={label}>
      <Textarea
        placeholder={placeholder}
        className="min-h-[120px]"
        {...form.register(name)}
      />
    </FormFieldWrapper>
  );
};

export default TextareaField;
