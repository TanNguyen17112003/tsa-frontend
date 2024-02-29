import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "src/components/shadcn/ui/select";
import type { FC, ReactNode } from "react";
import clsx from "clsx";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  className?: string;
  label?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  value?: string;
  options: SelectOption[];
  error?: boolean;
  helperText?: ReactNode;
}

const CustomSelect: FC<CustomSelectProps> = ({
  className,
  label,
  placeholder,
  onValueChange,
  value,
  options,
  error,
  helperText,
}) => {
  return (
    <div>
      {label && <div className="text-xs font-semibold mb-1">{label}</div>}
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className={clsx("h-10 shadow-none", className)}>
          <SelectValue placeholder={placeholder} className="py-4" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-primary"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <div className={clsx("text-xs", error && "text-destructive")}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
