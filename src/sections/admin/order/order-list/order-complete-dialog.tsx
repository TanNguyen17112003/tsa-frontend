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

function OrderCompleteDialog({
  order,
  ...dialogProps
}: DialogProps & {
  order: OrderDetail;
}) {
  const { updateOrderStatus } = useOrdersContext();
  const [finishedImage, setFinishedImage] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await UploadImagesApi.postImage(file);
      setFinishedImage(uploaded.secure_url);
    } finally {
      setUploading(false);
    }
  };

  const onConfirmHelper = useFunction(
    async () => {
      await updateOrderStatus({ status: 'DELIVERED', finishedImage }, [order.id]);
    },
    {
      successMessage: 'Hoàn thành đơn hàng thành công!'
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
          <Typography variant='h6'>{'Xác nhận đơn hàng ' + order?.checkCode}</Typography>
        </Box>
      </DialogTitle>

      <Box px={3} py={2} gap={2}>
        <input type='file' accept='image/*' onChange={onFileChange} disabled={uploading} />
        {finishedImage && (
          <Box mt={2}>
            <img src={finishedImage} alt='Received' style={{ maxWidth: '100%', maxHeight: 120 }} />
          </Box>
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
          color='success'
          disabled={uploading}
          onClick={async (e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
            await onConfirmHelper.call({});
          }}
        >
          Hoàn thành
        </Button>
      </DialogActions>
      {(uploading || onConfirmHelper.loading) && <LoadingProcess />}
    </Dialog>
  );
}

export default OrderCompleteDialog;
