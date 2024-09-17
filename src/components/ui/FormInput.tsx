import type { ComponentProps, FC, ReactNode } from 'react';
import { Input, InputProps } from '../shadcn/ui/input';
import clsx from 'clsx';

export interface FormInputProps extends InputProps {
  error?: boolean;
  helperText?: ReactNode;
  label?: string;
}

const FormInput: FC<FormInputProps> = ({ error, helperText, label, ...InputProps }) => {
  return (
    <>
      {label && <div className='text-xs font-semibold'>{label}</div>}
      <Input
        {...InputProps}
        className={clsx(
          error && 'border-destructive ring-destructive',
          InputProps.disabled ? 'bg-[#e0e5eb]' : 'bg-white',
          InputProps.className
        )}
      />
      {helperText && (
        <div className={clsx('text-xs', error && 'text-destructive')}>{helperText}</div>
      )}
    </>
  );
};

export default FormInput;
