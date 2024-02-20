import type { ComponentProps, FC, ReactNode } from "react";
import { Input, InputProps } from "../shadcn/ui/input";
import clsx from "clsx";

export interface FormInputProps extends InputProps {
  error?: boolean;
  helperText?: ReactNode;
}

const FormInput: FC<FormInputProps> = ({
  error,
  helperText,
  ...InputProps
}) => {
  return (
    <>
      <Input
        {...InputProps}
        className={clsx(error && "border-destructive ring-destructive")}
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
