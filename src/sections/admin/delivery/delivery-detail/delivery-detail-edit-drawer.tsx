import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  ListItem,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import Image from 'next/image';
import { Stack } from '@mui/system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import useFunction from 'src/hooks/use-function';
import { useAuth } from 'src/hooks/use-auth';
import 'dayjs/locale/en-gb';
import { DeliveryDetail } from 'src/types/delivery';
import { DeliveryRequest } from 'src/api/deliveries';
import { UserDetail, UserStatus } from 'src/types/user';
import { useDeliveriesContext } from 'src/contexts/deliveries/deliveries-context';

function DeliveryDetailEditDrawer({
  open,
  onClose,
  delivery,
  staffs
}: {
  open: boolean;
  onClose: () => void;
  delivery?: DeliveryDetail;
  staffs: { firstName: string; lastName: string; id: string; status: UserStatus }[];
}) {
  const { user } = useAuth();
  const orderListTitle = useMemo(() => {
    return delivery?.orders?.map((order) => order.product).join(', ');
  }, [delivery?.orders]);

  const { updateDelivery } = useDeliveriesContext();
  const handleSubmitDelivery = useCallback(
    async (values: DeliveryRequest) => {
      try {
        await updateDelivery(values, delivery?.id as string);
      } catch (err) {
        throw err;
      }
    },
    [delivery, user]
  );

  const initialDeliveryForm: DeliveryRequest = useMemo(() => {
    return {
      staffId: delivery?.staffId || '',
      limitTime: Number(delivery?.limitTime) || 0,
      orderIds: delivery?.orders?.map((order) => order.id) || []
    };
  }, [delivery]);

  const hanldelSubmitDeliveryHelper = useFunction(handleSubmitDelivery, {
    successMessage: 'Chỉnh sửa thông tin chuyến đi thành công!'
  });

  const formik = useFormik<DeliveryRequest>({
    initialValues: initialDeliveryForm,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await hanldelSubmitDeliveryHelper.call(values);
        onClose();
      } catch {
        showSnackbarError('Có lỗi xảy ra');
      }
    }
  });

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        PaperProps={{
          sx: {
            width: 600
          }
        }}
        onClose={onClose}
      >
        <form onSubmit={formik.handleSubmit}>
          <Paper elevation={5} sx={{ p: 3, borderRadius: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box>
                <Box sx={{ cursor: 'pointer' }} onClick={onClose}>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    <ArrowBack
                      fontSize='small'
                      sx={{
                        verticalAlign: 'middle'
                      }}
                    />{' '}
                    Quay lại
                  </Typography>
                </Box>
                <Typography variant='h6'>Chỉnh sửa chuyến đi #{delivery?.id}</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center'
                }}
              >
                <Button color='inherit' variant='contained' onClick={onClose}>
                  Hủy bỏ
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={delivery?.latestStatus !== 'PENDING'}
                >
                  Cập nhật
                </Button>
              </Box>
            </Box>
          </Paper>
          <Box display={'flex'} flexDirection={'column'} gap={3} padding={3}>
            <Stack spacing={0.5}>
              <Typography variant='h6'>Danh sách đơn hàng</Typography>
              <Typography>{orderListTitle}</Typography>
            </Stack>
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
          </Box>
        </form>
      </Drawer>
    </>
  );
}

export default DeliveryDetailEditDrawer;

function showSnackbarError(arg0: string) {
  throw new Error('Có lỗi trong quá trình thực thi');
}
