
import React from "react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import FormFieldWrapper from "./FormField";

interface TextInputFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
}

const TextInputField = ({
  form,
  name,
  label,
  placeholder,
}: TextInputFieldProps) => {
  return (
    <FormFieldWrapper form={form} name={name} label={label}>
      <Input 
        placeholder={placeholder} 
        {...form.register(name)} 
      />
    </FormFieldWrapper>
  );
};

export default TextInputField;
