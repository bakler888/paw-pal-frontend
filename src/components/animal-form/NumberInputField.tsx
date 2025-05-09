
import React from "react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import FormFieldWrapper from "./FormField";

interface NumberInputFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  min?: string;
  step?: string;
}

const NumberInputField = ({
  form,
  name,
  label,
  placeholder,
  min = "0",
  step = "0.01",
}: NumberInputFieldProps) => {
  return (
    <FormFieldWrapper form={form} name={name} label={label}>
      <Input
        type="number"
        min={min}
        step={step}
        placeholder={placeholder}
        {...form.register(name)}
      />
    </FormFieldWrapper>
  );
};

export default NumberInputField;
