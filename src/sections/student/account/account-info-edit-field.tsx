import { Box, MenuItem, TextField } from '@mui/material';
import { useState, type FC, useCallback } from 'react';
import AccountInfoEditFieldAction from './account-field-action';
import useFunction from 'src/hooks/use-function';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

type AccountInfoFieldProps = {
  label: string;
  value?: string;
  type?: 'text' | 'date' | 'select';
  onSave?: (value: string) => Promise<void>;
  disabled?: boolean;
  items?: string[];
};

const AccountInfoEditField: FC<AccountInfoFieldProps> = ({
  label,
  type = 'text',
  value,
  onSave,
  disabled = false,
  items
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState('');

  const handleSave = useCallback(
    async ({}) => {
      await onSave?.(editingValue);
      setIsEditing(false);
      setEditingValue(editingValue);
    },
    [editingValue, onSave]
  );
  const handleSaveHelper = useFunction(handleSave);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2
      }}
    >
      {type == 'text' && (
        <TextField
          label={label}
          value={!isEditing ? value : editingValue}
          disabled={disabled || !isEditing}
          onChange={(e) => setEditingValue(e.target.value)}
          sx={{
            flex: 1
          }}
        />
      )}
      {type == 'select' && (
        <TextField
          label={label}
          value={!isEditing ? value : editingValue}
          disabled={disabled || !isEditing}
          onChange={(e) => setEditingValue(e.target.value)}
          select
          sx={{
            flex: 1
          }}
        >
          {items?.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      )}

      <AccountInfoEditFieldAction
        isEditing={isEditing}
        onClickEdit={() => {
          setIsEditing(true);
          setEditingValue(value || '');
        }}
        onClickSave={() => handleSaveHelper.call({})}
        onClickCancel={() => {
          setIsEditing(false);
          setEditingValue('');
        }}
        disabled={disabled}
      />
    </Box>
  );
};

export default AccountInfoEditField;
