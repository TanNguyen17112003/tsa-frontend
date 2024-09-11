import { ChangeEventHandler, FC, PropsWithChildren } from 'react';
import { OrderFormField } from './order-form-field';
import { TextField } from '@mui/material';

interface OrderFormFieldTextProps {
  title: string;
  lg: number;
  xs: number;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value: string;
  required?: boolean;
  disabled?: boolean;
  select?: boolean;
}

export const OrderFormTextField: FC<OrderFormFieldTextProps & PropsWithChildren> = ({
  title,
  lg,
  xs,
  onChange,
  value,
  name,
  required = true,
  disabled = false,
  select = false,
  children
}) => {
  return (
    <OrderFormField title={title} lg={lg} xs={xs}>
      <TextField
        fullWidth
        variant='outlined'
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        select={select}
      >
        {children}
      </TextField>
    </OrderFormField>
  );
};
