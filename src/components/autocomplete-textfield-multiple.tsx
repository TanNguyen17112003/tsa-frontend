import React, { useEffect, useRef, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import { Popper } from '@mui/material';

interface Props {
  value: { value: any; label: string }[];
  options: { value: any; label: string }[];
  onChange: (value: any) => void;
  TextFieldProps: TextFieldProps;
  freeSolo?: boolean;
}

const AutocompleteTextFieldMultiple: React.FC<Props> = ({
  value,
  options: initialOptions,
  onChange,
  TextFieldProps,
  freeSolo = false
}) => {
  const [options, setOptions] = useState(initialOptions);
  const [inputValue, setInputValue] = useState('');
  const [key, setKey] = useState<any>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const handleOptionChange = (_: any, newValue: ({ value: string; label: string } | string)[]) => {
    const newOptions = newValue.map((item) => {
      if (typeof item === 'string') {
        if (freeSolo) {
          const newOption = { value: item, label: `${item} (mới)` };
          if (!options.some((option) => option.value === item)) {
            setOptions((prevOptions) => [...prevOptions, newOption]);
          }
          return newOption;
        }
      }
      return item;
    });
    onChange(newOptions as { value: any; label: string }[]);
  };

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...TextFieldProps}
      {...params}
      InputProps={{
        sx: { ...TextFieldProps.InputProps?.sx },
        ...params.InputProps
      }}
      inputRef={inputRef}
    />
  );

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setKey(new Date().getTime());
    }
  }, [value]);

  const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      key={key}
      options={options}
      filterOptions={(options, state) => {
        const filtered = options.filter((option) =>
          option.label.toLowerCase().includes(state.inputValue.toLowerCase())
        );
        if (
          freeSolo &&
          state.inputValue !== '' &&
          !filtered.some((option) => option.value === state.inputValue)
        ) {
          filtered.push({
            value: state.inputValue,
            label: `${state.inputValue} (mới)`
          });
        }
        return filtered;
      }}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option?.label)}
      value={value}
      renderInput={renderInput}
      onChange={handleOptionChange}
      onInputChange={handleInputChange}
      autoHighlight
      disableCloseOnSelect
      multiple
      freeSolo={freeSolo}
      PopperComponent={(props) => (
        <Popper
          {...props}
          sx={{
            ...props.sx,
            zIndex: (theme) => `${theme.zIndex.drawer + 10} !important`
          }}
        />
      )}
    />
  );
};

export default AutocompleteTextFieldMultiple;
