import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import useFunction from 'src/hooks/use-function';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { UploadImagesApi } from 'src/api/upload-images';
import { DialogProps } from '@mui/material';
import { OrderDetail } from 'src/types/order';
import LoadingProcess from 'src/components/LoadingProcess';

function OrderDetailCancelDialog({
  order,
  type,
  ...dialogProps
}: DialogProps & {
  order: OrderDetail;
  type: 'STUDENT' | 'ADMIN';
}) {
  const { updateOrderStatus } = useOrdersContext();
  const [reason, setReason] = useState('');
  const [canceledImage, setCanceledImage] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  const cancelReasonTypeList = useMemo(() => {
    return [
      {
        label: 'Lý do từ sinh viên',
        value: 'FROM_STUDENT'
      },
      {
        label: 'Lý do từ nhân viên hệ thống',
        value: 'FROM_STAFF'
      }
    ];
  }, []);

  const [cancelReasonType, setCancelReasonType] = useState<string>('');

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await UploadImagesApi.postImage(file);
      setCanceledImage(uploaded.secure_url);
    } finally {
      setUploading(false);
    }
  };

  const onConfirmHelper = useFunction(
    async () => {
      await updateOrderStatus(
        {
          status: 'CANCELED',
          reason,
          canceledImage,
          cancelReasonType: type === 'STUDENT' ? 'FROM_STUDENT' : (cancelReasonType as any)
        },
        [order.id]
      );
    },
    {
      successMessage: 'Hủy đơn hàng thành công!'
    }
  );

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
          <Typography variant='h6'>{'Hủy đơn hàng  #' + order?.id}</Typography>
        </Box>
      </DialogTitle>

      <Box px={3} py={2} gap={2}>
        <Box mb={3}>
          <Typography variant='subtitle2'>Lý do hủy đơn</Typography>
          <TextField
            placeholder='Nhập lý do hủy đơn'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
        </Box>
        <input type='file' accept='image/*' onChange={onFileChange} disabled={uploading} />
        {canceledImage && (
          <Box mt={2}>
            <img src={canceledImage} alt='Canceled' style={{ maxWidth: '100%', maxHeight: 120 }} />
          </Box>
        )}
        {type === 'ADMIN' && (
          <FormControl fullWidth className='mt-5'>
            <InputLabel id='demo-simple-select-label'>Lý do hủy đơn</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={cancelReasonType}
              label='Lý do hủy đơn'
              onChange={(e) => setCancelReasonType(e.target.value)}
            >
              {cancelReasonTypeList.map((type) => {
                return (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </Box>
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
          disabled={uploading}
          onClick={async (e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
            await onConfirmHelper.call({});
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
      {(uploading || onConfirmHelper.loading) && <LoadingProcess />}
    </Dialog>
  );
}

export default OrderDetailCancelDialog;
