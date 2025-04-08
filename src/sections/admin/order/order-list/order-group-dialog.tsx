import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  DialogProps,
  Typography,
  Divider,
  IconButton,
  Stack,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useMemo } from 'react';
import useFunction from 'src/hooks/use-function';
import { OrderDetail } from 'src/types/order';
import { useFormik } from 'formik';
import { DeliveryRequest } from 'src/api/deliveries';
import { UsersApi } from 'src/api/users';
import { DeliveriesApi } from 'src/api/deliveries';
import { OrdersApi } from 'src/api/orders';

function OrderGroupDialog({
  orders,
  ...dialogProps
}: DialogProps & {
  orders: OrderDetail[];
}) {
  const onConfirm = useCallback(
    async (values: DeliveryRequest) => {
      try {
        const extractedOrders = orders.map((order) => {
          return {
            id: order.id,
            room: order.room,
            building: order.building,
            dormitory: order.dormitory
          };
        });
        const response = await OrdersApi.routeOrders({
          orders: extractedOrders
        });
        await DeliveriesApi.postDeliveries({
          orderIds: response.orders.map((order) => order.id),
          staffId: values.staffId,
          limitTime: Number(values.limitTime)
        });
      } catch (error) {
        throw error;
      }
    },
    [orders, OrdersApi.routeOrders, DeliveriesApi.postDeliveries]
  );

  const onConfirmHelper = useFunction(onConfirm!, {
    successMessage: 'Gom nhóm hàng thành công!'
  });

  const getListUsersApiApi = useFunction(UsersApi.getUsers);
  const staffs = useMemo(() => {
    return (getListUsersApiApi.data || []).filter(
      (user) => user.role === 'STAFF' && user.status === 'AVAILABLE'
    );
  }, [getListUsersApiApi.data]);

  const formik = useFormik<DeliveryRequest>({
    initialValues: {
      limitTime: 0,
      staffId: '',
      orderIds: orders.map((order) => order.id)
    },
    onSubmit: async (values) => {
      await onConfirmHelper.call(values);
      dialogProps.onClose?.({}, 'escapeKeyDown');
    }
  });

  const orderListTitle = useMemo(() => {
    return orders.map((order) => order.checkCode).join(', ');
  }, [orders]);

  useEffect(() => {
    getListUsersApiApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog fullWidth maxWidth='xs' {...dialogProps}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            py: 1
          }}
        >
          <Typography variant='h6'>Gom nhóm đơn hàng</Typography>
          <IconButton
            edge='end'
            color='inherit'
            onClick={() => {
              dialogProps.onClose?.({}, 'escapeKeyDown');
            }}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'} gap={3}>
          <Stack spacing={0.5}>
            <Typography variant='h6'>Danh sách đơn hàng</Typography>
            <Typography>{orderListTitle}</Typography>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography variant='h6'>Nhân viên giao hàng</Typography>
            <FormControl fullWidth>
              <InputLabel id='staff-select-label'>Chọn nhân viên</InputLabel>
              <Select
                labelId='staff-select-label'
                value={formik.values.staffId}
                onChange={(event) => formik.setFieldValue('staffId', event.target.value)}
                label='Chọn nhân viên'
              >
                {staffs.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.lastName} {staff.firstName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography variant='h6'>Thời gian giới hạn</Typography>
            <TextField
              type='number'
              value={formik.values.limitTime}
              onChange={(event) => formik.setFieldValue('limitTime', event.target.value)}
              label='Thời gian giới hạn (phút)'
              fullWidth
            />
          </Stack>
          <Divider />
        </Box>
      </DialogContent>
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
          disabled={onConfirmHelper.loading || !formik.values.staffId || !formik.values.limitTime}
          color='primary'
          onClick={async (e) => {
            await formik.handleSubmit();
          }}
        >
          Gom nhóm
        </Button>
      </DialogActions>
      {onConfirmHelper.loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  );
}

export default OrderGroupDialog;
