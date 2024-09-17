import { ChangeEventHandler, FC, PropsWithChildren } from 'react';
import { OrderFormField } from './order-form-field';
import { TextField } from '@mui/material';
import AutocompleteTextFieldMultiple from 'src/components/autocomplete-textfield-multiple';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface OrderFormFieldTextProps {
  title: string;
  lg: number;
  xs: number;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value: string | string[] | { value: any; label: string }[];
  required?: boolean;
  disabled?: boolean;
  select?: boolean;
  type: string;
  options?: { value: any; label: string }[];
  placeholder?: string;
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
  children,
  type,
  options,
  placeholder
}) => {
  return (
    <OrderFormField title={title} lg={lg} xs={xs}>
      {type === 'text' ? (
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
      ) : type === 'autoComplete' ? (
        <AutocompleteTextFieldMultiple
          onChange={onChange}
          value={value as { value: any; label: string }[]}
          options={options!}
          TextFieldProps={{
            variant: 'outlined',
            placeholder: placeholder
          }}
          freeSolo={true}
        ></AutocompleteTextFieldMultiple>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker label={placeholder} />
          </DemoContainer>
        </LocalizationProvider>
      )}
    </OrderFormField>
  );
};
