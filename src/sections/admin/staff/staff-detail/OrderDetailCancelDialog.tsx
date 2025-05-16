import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import useFunction from 'src/hooks/use-function';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { UploadImagesApi } from 'src/api/upload-images';
import { DialogProps } from '@mui/material';
import { OrderDetail } from 'src/types/order';

function OrderDetailCancelDialog({
  order,
  ...dialogProps
}: DialogProps & {
  order: OrderDetail;
}) {
  const { updateOrderStatus } = useOrdersContext();
  const [reason, setReason] = useState('');
  const [canceledImage, setCanceledImage] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

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
      await updateOrderStatus({ status: 'CANCELED', reason, canceledImage }, [order.id]);
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
          <Typography variant='h6'>{'Hủy đơn hàng #' + order?.id + ' ?'}</Typography>
        </Box>
      </DialogTitle>
      <Box px={3} py={2}>
        <input type='file' accept='image/*' onChange={onFileChange} disabled={uploading} />
        {canceledImage && (
          <Box mt={1}>
            <img src={canceledImage} alt='Canceled' style={{ maxWidth: '100%', maxHeight: 120 }} />
          </Box>
        )}
        <Box mt={2}>
          <Typography variant='subtitle2'>Lý do hủy đơn</Typography>
          <input
            type='text'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='Nhập lý do hủy đơn...'
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </Box>
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
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDetailCancelDialog;
