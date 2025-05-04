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
  CircularProgress,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useFunction from 'src/hooks/use-function';
import { UsersApi } from 'src/api/users';
import { OrderFormTextField } from '../order-add/order-form-text-field';
import { AddressData } from '@utils';
import { useFormik } from 'formik';
import { AdvancedDelivery } from 'src/types/delivery';
import { useDialog } from '@hooks';
import OrderConfirmAdvancedDialog from './order-confirm-advanced-dialog';
import { GroupOrderMode, OrdersApi } from 'src/api/orders';

interface OrderFastGroupFieldProps {
  deliveryDay: string;
  deliveryTimeSlot: string;
  dormitory: string;
  maxWeight: number;
  mode: GroupOrderMode;
}

function OrderFastGroupDialog({ ...dialogProps }: DialogProps & {}) {
  const [result, setResult] = useState<AdvancedDelivery | null>(null);
  const confirmAdvancedDialog = useDialog();
  const modeOptions = useMemo(() => {
    return [
      {
        label: 'Gom nhóm tự do',
        value: 'free'
      },
      {
        label: 'Gom nhóm cân bằng',
        value: 'balanced'
      }
    ];
  }, []);
  const formik = useFormik<OrderFastGroupFieldProps>({
    initialValues: {
      deliveryDay: new Date().toISOString().split('T')[0],
      deliveryTimeSlot: '07:00',
      dormitory: 'A',
      maxWeight: 20,
      mode: 'balanced'
    },
    onSubmit: async (values) => {
      console.log(values);
    }
  });
  const getListUsersApiApi = useFunction(UsersApi.getUsers);
  const staffs = useMemo(() => {
    return (getListUsersApiApi.data || []).filter(
      (user) => user.role === 'STAFF' && user.status === 'AVAILABLE'
    );
  }, [getListUsersApiApi.data]);

  const fetchGroupOrders = useCallback(async () => {
    const response = await OrdersApi.groupOrders({
      maxWeight: formik.values.maxWeight,
      dormitory: formik.values.dormitory,
      timeslot: Math.floor(
        new Date(`${formik.values.deliveryDay} ${formik.values.deliveryTimeSlot}`).getTime() / 1000
      ).toString(),
      mode: formik.values.mode
    });
    if (response) {
      await setResult(response);
      confirmAdvancedDialog.handleOpen();
    }
  }, [
    formik.values.deliveryDay,
    formik.values.deliveryTimeSlot,
    formik.values.maxWeight,
    formik.values.dormitory,
    formik.values.mode,
    confirmAdvancedDialog,
    setResult
  ]);

  const timeSlotOptions = useMemo(() => {
    const slots = [];
    let startHour = 7;
    const startMinute = 0;

    while (startHour < 18 || (startHour === 18 && startMinute <= 45)) {
      const endHour = startHour + 1;
      const endMinute = startMinute + 45;
      const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      slots.push({
        label: `${startTime} - ${endTime}`,
        value: startTime
      });

      startHour += 2;
    }
    return slots;
  }, []);

  const dormitoryList = useMemo(() => {
    return AddressData.dormitories;
  }, []);

  useEffect(() => {
    getListUsersApiApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog fullWidth maxWidth='sm' {...dialogProps}>
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
          <Typography variant='h6'>Gom nhóm nhanh các đơn hàng dựa vào AI</Typography>
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
        <Box>
          <Grid container spacing={2}>
            <OrderFormTextField
              type='date'
              title={'Ngày giao hàng'}
              lg={6}
              xs={6}
              name={'deliveryDay'}
              placeholder='Chọn ngày gian giao hàng'
              onChange={formik.handleChange}
              value={formik.values.deliveryDay as string}
            />
            <OrderFormTextField
              type='text'
              title='Khung giờ giao hàng'
              xs={6}
              lg={6}
              name='deliveryTimeSlot'
              placeholder='Chọn khung giờ giao hàng'
              select
              onChange={(event) => formik.setFieldValue('deliveryTimeSlot', event.target.value)}
              value={formik.values.deliveryTimeSlot as string}
            >
              {timeSlotOptions.map((slot, index) => (
                <MenuItem key={index} value={slot.value}>
                  {slot.label}
                </MenuItem>
              ))}
            </OrderFormTextField>
            <Grid item xs={6}>
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Typography>Địa chỉ nhận hàng</Typography>
                <Box display={'flex'}>
                  <Stack direction={'row'} spacing={5} className='w-[100%]'>
                    <FormControl fullWidth>
                      <InputLabel>Chọn kí túc xá</InputLabel>
                      <Select
                        value={formik.values.dormitory}
                        onChange={formik.handleChange}
                        name='dormitory'
                      >
                        {dormitoryList.map((dormitoryItem, index) => (
                          <MenuItem key={index} value={dormitoryItem}>
                            {dormitoryItem}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              </Box>
            </Grid>
            <OrderFormTextField
              type='number'
              title={'Khối lượng tối đa của một chuyến đi'}
              lg={6}
              xs={6}
              name={'maxWeight'}
              placeholder='Chọn khối lượng tối đa'
              onChange={formik.handleChange}
              value={formik.values.maxWeight as number}
            />
            <OrderFormTextField
              type='text'
              title='Chế độ gom nhóm'
              xs={12}
              lg={12}
              name='mode'
              placeholder='Chọn chế độ gom nhóm'
              select
              onChange={formik.handleChange}
              value={formik.values.mode as string}
            >
              {modeOptions.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </OrderFormTextField>
          </Grid>
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
        <Button variant='contained' color='primary' onClick={fetchGroupOrders}>
          Gom nhóm
        </Button>
      </DialogActions>
      <OrderConfirmAdvancedDialog
        {...confirmAdvancedDialog}
        open={confirmAdvancedDialog.open}
        onClose={confirmAdvancedDialog.handleClose}
        staffs={staffs}
        result={result}
      />
    </Dialog>
  );
}

export default OrderFastGroupDialog;
