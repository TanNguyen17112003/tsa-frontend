import { Save, Cancel } from '@mui/icons-material';
import { CircularProgress, TextField, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { ReactNode } from 'react';

export const CardTableEditCellTextfield: (
  editingValue: any,
  onChange: (value: any) => void,
  updating: boolean,
  initialValue: any,
  onUpdate: (value: any) => Promise<any>,
  onCancel: () => void,
  type?: 'string' | 'number' | 'date' | 'datetime' | 'float'
) => ReactNode = (editingValue, onChange, updating, initialValue, onUpdate, onCancel, type) => {
  return (
    <Stack direction='row' alignItems='center' justifyContent='flex-end' sx={{ my: -1 }}>
      {updating && (
        <div>
          <CircularProgress size={24} />
        </div>
      )}
      {type == 'date' || type == 'datetime' ? (
        <DatePicker
          onAccept={onUpdate}
          value={
            editingValue instanceof Date ? (editingValue as unknown as null | undefined) : null
          }
          slotProps={{
            textField: {
              variant: 'outlined',
              InputProps: {
                sx: { minHeight: 0 }
              },
              inputProps: {
                py: 1
              }
            }
          }}
        />
      ) : (
        <TextField
          autoFocus
          variant='outlined'
          value={
            type == 'number' ? Number(editingValue || 0).toLocaleString('vi-VN') : editingValue
          }
          InputProps={{ sx: { minHeight: 0 } }}
          inputProps={{ sx: { py: 1 } }}
          sx={{
            input: { fontSize: 16, fontWeight: 'normal' },
            mr: 1,
            ml: 1
          }}
          defaultValue={initialValue}
          onChange={(e) => {
            if (type == 'number') {
              onChange(Number(e.target.value.replaceAll(/[^0-9]/g, '')));
            } else {
              onChange(e.target.value);
            }
          }}
          disabled={updating}
          onKeyUp={(e) => {
            if (e.key == 'Enter' && editingValue != initialValue) {
              onUpdate(editingValue);
            }
            if (e.key == 'Escape') {
              onCancel();
            }
          }}
        />
      )}
      {type != 'date' && type != 'datetime' && (
        <>
          <IconButton onClick={() => onUpdate(editingValue)} disabled={updating}>
            <Save fontSize='small' color='success' />
          </IconButton>
          <IconButton onClick={onCancel} disabled={updating}>
            <Cancel fontSize='small' color='error' />
          </IconButton>
        </>
      )}
    </Stack>
  );
};
