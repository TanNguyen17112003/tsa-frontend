import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogProps,
  Typography,
  IconButton,
  TextField
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import useFunction from 'src/hooks/use-function';
import { ReportDetail } from 'src/types/report';

function ReportDetailDeleteDialog({
  report,
  onConfirm,
  ...dialogProps
}: DialogProps & {
  report: ReportDetail;
  onConfirm?: () => Promise<void>;
}) {
  const onConfirmHelper = useFunction(onConfirm!, {
    successMessage: 'Đã xoá!'
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
          <Typography variant='h6'>{'Xoá khiếu nại #' + report?.id + ' ?'}</Typography>
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
            await onConfirm!();
          }}
        >
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReportDetailDeleteDialog;
