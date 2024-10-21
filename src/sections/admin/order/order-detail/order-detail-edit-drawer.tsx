import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  ListItem,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import useFunction from 'src/hooks/use-function';
import { useAuth } from 'src/hooks/use-auth';
import 'dayjs/locale/en-gb';
import { OrderDetail } from 'src/types/order';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { OrderFormProps } from 'src/api/orders';
import { OrderFormTextField } from '../order-add/order-form-text-field';

function OrderDetailEditDrawer({
  open,
  onClose,
  order
}: {
  open: boolean;
  onClose: () => void;
  order?: OrderDetail;
}) {
  const { user } = useAuth();
  const { updateOrder } = useOrdersContext();
  const handleSubmitOrder = useCallback(
    async (values: OrderFormProps) => {
      try {
        await updateOrder(values, order?.id as string);
      } catch (err) {
        throw err;
      }
    },
    [order, user]
  );

  const initialOrderForm = useMemo(() => {
    return {
      checkCode: order?.checkCode || '',
      weight: order?.weight || 0,
      product: order?.product || ''
    };
  }, [order]);

  const handleSubmitOrderHelper = useFunction(handleSubmitOrder, {
    successMessage: 'Gửi khiếu nại thành công!'
  });

  const formik = useFormik<OrderFormProps>({
    initialValues: initialOrderForm,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await handleSubmitOrderHelper.call(values);
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
                <Typography variant='h6'>Chỉnh sửa đơn hàng #{order?.checkCode}</Typography>
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
                <Button variant='contained' color='primary' type='submit'>
                  Cập nhật
                </Button>
              </Box>
            </Box>
          </Paper>
          <Stack spacing={3} padding={3}>
            <Box>
              <Grid container spacing={2}>
                <OrderFormTextField
                  type='text'
                  title={'Mã đơn hàng'}
                  lg={0}
                  xs={12}
                  onChange={formik.handleChange}
                  value={formik.values.checkCode as string}
                  name={'checkCode'}
                />
                <OrderFormTextField
                  type='number'
                  title={'Khối lượng đơn hàng (kg)'}
                  lg={0}
                  xs={12}
                  onChange={formik.handleChange}
                  value={formik.values.weight as number}
                  name={'weight'}
                />
                <OrderFormTextField
                  type='autoComplete'
                  title={'Sản phẩm'}
                  lg={0}
                  xs={12}
                  options={[] as { value: string; label: string }[]}
                  onChange={(event) => formik.setFieldValue('product', event.target.value)}
                  value={formik.values.product as string}
                  name={'product'}
                  placeholder='Nhập danh sách sản phẩm'
                />
              </Grid>
            </Box>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}

export default OrderDetailEditDrawer;

function showSnackbarError(arg0: string) {
  throw new Error('Có lỗi trong quá trình thực thi');
}
