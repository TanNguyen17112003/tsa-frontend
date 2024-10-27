import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { ArrowBack } from '@mui/icons-material';
import { Stack } from '@mui/system';
import { useFormik } from 'formik';
import useFunction from 'src/hooks/use-function';
import { useAuth } from 'src/hooks/use-auth';
import { OrderDetail } from 'src/types/order';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { OrderFormProps } from 'src/api/orders';
import { OrderFormTextField } from '../order-add/order-form-text-field';
import { AddressData, paymentMethodOptions } from '@utils';
import Image from 'next/image';
import dayjs from 'dayjs';

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
      product: order?.product || '',
      dormitory: order?.dormitory || '',
      building: order?.building || '',
      room: order?.room || '',
      deliveryDate: order?.deliveryDate
        ? dayjs.unix(parseInt(order.deliveryDate)).format('YYYY-MM-DDTHH:mm')
        : '',
      paymentMethod: order?.paymentMethod || 'CREDIT'
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

  const dormitoryList = useMemo(() => {
    return AddressData.dormitories;
  }, []);
  const buildingList = useMemo(() => {
    return formik.values.dormitory === 'A' ? AddressData.buildings.A : AddressData.buildings.B;
  }, [formik.values.dormitory]);
  const roomList = useMemo(() => {
    return AddressData.rooms;
  }, [buildingList]);

  return (
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
              <Grid item xs={12} lg={0}>
                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  <Typography>Địa chỉ nhận hàng</Typography>
                  <Box display={'flex'}>
                    <Stack direction={'row'} spacing={5} className='w-[100%]'>
                      <FormControl className='w-[33.33%]'>
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
                      <FormControl className='w-[33.33%]'>
                        <InputLabel>Chọn tòa</InputLabel>
                        <Select
                          value={formik.values.building}
                          onChange={formik.handleChange}
                          name='building'
                        >
                          {buildingList.map((building, index) => (
                            <MenuItem key={index} value={building}>
                              {building}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl className='w-[33.33%]'>
                        <InputLabel>Chọn phòng</InputLabel>
                        <Select
                          value={formik.values.room}
                          onChange={formik.handleChange}
                          name='room'
                        >
                          {roomList.map((room, index) => (
                            <MenuItem key={index} value={room}>
                              {room}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Box>
                </Box>
              </Grid>
              <OrderFormTextField
                type='dateTime'
                title={'Thời gian giao hàng'}
                lg={0}
                xs={12}
                name={'deliveryDate'}
                placeholder='Chọn thời gian giao hàng'
                onChange={formik.handleChange}
                value={formik.values.deliveryDate as string}
              />

              <OrderFormTextField
                type='text'
                title={'Phương thức thanh toán'}
                lg={0}
                xs={12}
                name={'paymentMethod'}
                value={formik.values.paymentMethod as string}
                select
                onChange={formik.handleChange}
              >
                {paymentMethodOptions.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    <ListItem alignItems='center'>
                      <ListItemIcon>
                        <Image src={option.image} width={24} height={24} alt='' />
                      </ListItemIcon>
                      {option.label}
                    </ListItem>
                  </MenuItem>
                ))}
              </OrderFormTextField>
            </Grid>
          </Box>
        </Stack>
      </form>
    </Drawer>
  );
}

export default OrderDetailEditDrawer;

function showSnackbarError(arg0: string) {
  throw new Error('Function not implemented.');
}
