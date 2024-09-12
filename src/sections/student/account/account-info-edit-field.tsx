import React from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

interface AccountInfoEditFieldProps {
  label: string;
  defaultValue: string;
  disabled?: boolean;
  isEdit?: boolean;
  setIsEdit?: (value: boolean) => void;
  textFieldSx?: object;
  buttonSx?: object;
}

const AccountInfoEditField: React.FC<AccountInfoEditFieldProps> = ({
  label,
  defaultValue,
  isEdit,
  disabled,
  setIsEdit,
  textFieldSx,
  buttonSx
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2
      }}
    >
      <TextField
        label={label}
        defaultValue={defaultValue}
        disabled={!isEdit}
        sx={{
          flex: 1,
          ...textFieldSx
        }}
      />
      {!isEdit && (
        <Button
          variant='text'
          size='small'
          color='primary'
          onClick={() => {
            setIsEdit && setIsEdit(!isEdit);
          }}
          sx={buttonSx}
          disabled={disabled}
        >
          Sửa
        </Button>
      )}

      {isEdit && (
        <Stack spacing={2} direction='row'>
          <Button
            variant='text'
            size='small'
            color='inherit'
            onClick={() => {
              setIsEdit && setIsEdit(!isEdit);
            }}
            sx={buttonSx}
          >
            Hủy
          </Button>
          <Button
            variant='contained'
            size='small'
            color='primary'
            onClick={() => {
              setIsEdit && setIsEdit(!isEdit);
            }}
            sx={buttonSx}
          >
            Lưu
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default AccountInfoEditField;
