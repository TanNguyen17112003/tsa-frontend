import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "src/components/shadcn/ui/select";
import type { FC } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  value?: string;
  options: SelectOption[];
}

const CustomSelect: FC<CustomSelectProps> = ({
  label,
  placeholder,
  onValueChange,
  value,
  options,
}) => {
  return (
    <div>
      {label && <div className="text-xs font-semibold mb-1">{label}</div>}
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="h-10 shadow-none">
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
    </div>
  );
};

export default CustomSelect;
