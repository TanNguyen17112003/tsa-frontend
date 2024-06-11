import type { ComponentProps, FC, ReactNode } from "react";
import { Input, InputProps } from "../shadcn/ui/input";
import clsx from "clsx";

export interface FormInputProps extends InputProps {
  error?: boolean;
  helperText?: ReactNode;
  label?: string;
}

const FormInput: FC<FormInputProps> = ({
  error,
  helperText,
  label,
  ...InputProps
}) => {
  return (
    <>
      {label && <div className="text-xs font-semibold mb-1">{label}</div>}
      <Input
        {...InputProps}
        className={clsx(
          error && "border-destructive ring-destructive",
          InputProps.className
        )}
      />
      {helperText && (
        <div className={clsx("text-xs", error && "text-destructive")}>
          {helperText}
        </div>
      )}
    </>
  );
};

export default FormInput;
