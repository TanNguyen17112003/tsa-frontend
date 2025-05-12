import { Dialog, DialogTitle, DialogActions, Button, DialogProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import useFunction from 'src/hooks/use-function';
import { UserDetail } from 'src/types/user';

function RestoreUserDialog({
  user,
  onConfirm,
  ...dialogProps
}: DialogProps & {
  user: UserDetail;
  onConfirm?: () => Promise<void>;
}) {
  const onConfirmHelper = useFunction(onConfirm!, {
    successMessage: `Khôi phục ${user?.role === 'STUDENT' ? 'sinh viên' : 'nhân viên'} thành công!`
  });

  return (
    <Dialog fullWidth maxWidth='xs' {...dialogProps}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant='h6'>
            Khôi phục {user?.role === 'STUDENT' ? 'sinh viên' : 'nhân viên'} {user?.lastName}{' '}
            {user?.firstName}?
          </Typography>
        </Box>
      </DialogTitle>

      <DialogActions className='flex justify-center'>
        <Button
          variant='contained'
          color={'inherit'}
          onClick={(e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
          }}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={async (e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
            await onConfirmHelper.call({});
          }}
        >
          Khôi phục
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RestoreUserDialog;
