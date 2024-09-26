import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import type { FC } from 'react';

interface AccountFieldActionProps {
  isEditing: boolean;
  onClickEdit: () => void;
  onClickSave: () => void;
  onClickCancel: () => void;
  disabled?: boolean;
}

const ProfileFieldAction: FC<AccountFieldActionProps> = ({
  isEditing,
  onClickEdit,
  onClickSave,
  onClickCancel,
  disabled = false
}) => {
  return (
    <>
      {!isEditing && (
        <Button
          variant='text'
          size='small'
          color='primary'
          onClick={onClickEdit}
          disabled={disabled}
        >
          Sửa
        </Button>
      )}

      {isEditing && (
        <Stack spacing={2} direction={'row'}>
          <Button variant='text' size='small' color='inherit' onClick={onClickCancel}>
            Hủy
          </Button>
          <Button variant='contained' size='small' color='primary' onClick={onClickSave}>
            Lưu
          </Button>
        </Stack>
      )}
    </>
  );
};

export default ProfileFieldAction;
