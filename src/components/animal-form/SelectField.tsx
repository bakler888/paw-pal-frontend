
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import FormFieldWrapper from "./FormField";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  options: SelectOption[];
}

const SelectField = ({
  form,
  name,
  label,
  placeholder,
  options,
}: SelectFieldProps) => {
  return (
    <FormFieldWrapper form={form} name={name} label={label}>
      <Select
        onValueChange={(value) => form.setValue(name, value)}
        defaultValue={form.getValues(name)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  );
};

export default SelectField;
