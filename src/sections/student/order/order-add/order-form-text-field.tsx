import { ChangeEventHandler, FC, PropsWithChildren } from 'react';
import { OrderFormField } from './order-form-field';
import { TextField } from '@mui/material';
import AutocompleteTextFieldMultiple from 'src/components/autocomplete-textfield-multiple';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface OrderFormTextFieldProps {
  type: 'text' | 'autoComplete' | 'dateTime' | 'number';
  title: string;
  lg: number;
  xs: number;
  options?: { value: string; label: string }[];
  onChange: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
  value: string | { value: any; label: string }[] | number;
  name: string;
  placeholder?: string;
  select?: boolean;
  children?: React.ReactNode;
}

export const OrderFormTextField: FC<OrderFormTextFieldProps> = ({
  type,
  title,
  lg,
  xs,
  options,
  onChange,
  value,
  name,
  placeholder,
  select,
  children
}) => {
  if (type === 'autoComplete' && options) {
    const formattedValue = Array.isArray(value)
      ? value
      : typeof value === 'string'
        ? value.split(',').map((val) => ({ value: val.trim(), label: val.trim() }))
        : [];

    return (
      <OrderFormField title={title} lg={lg} xs={xs}>
        <AutocompleteTextFieldMultiple
          onChange={(newValue) =>
            onChange({
              target: { name, value: newValue.map((item: { value: any }) => item.value).join(', ') }
            })
          }
          value={formattedValue}
          options={options!}
          TextFieldProps={{
            variant: 'outlined',
            placeholder: placeholder
          }}
          freeSolo={true}
        />
      </OrderFormField>
    );
  }

  return (
    <OrderFormField title={title} lg={lg} xs={xs}>
      <TextField
        type={type === 'dateTime' ? 'datetime-local' : type === 'text' ? 'text' : 'number'}
        fullWidth
        variant='outlined'
        onChange={onChange}
        value={value}
        name={name}
        placeholder={placeholder}
        select={select}
      >
        {select && children}
      </TextField>
    </OrderFormField>
  );
};
