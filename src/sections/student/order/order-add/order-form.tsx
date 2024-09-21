import { Box, Grid, MenuItem, Typography, ListItemIcon, ListItem } from '@mui/material';
import { Stack } from '@mui/system';
import { FormikProps } from 'formik';
import React, { useMemo, type FC, useEffect } from 'react';
import useFunction from 'src/hooks/use-function';
import { getFormData } from 'src/utils/api-request';
import { OrderDetail, OrderImport } from 'src/types/order';
import { OrderFormTextField } from './order-form-text-field';
import { paymentMethodOptions } from 'src/utils/payment-method';
import Image from 'next/image';

interface OrderFormProps {
  formik: FormikProps<OrderImport>;
  title?: string;
  status: boolean;
}

export const OrderForm: FC<OrderFormProps> = ({ formik, title, status }) => {
  const options = [
    { value: 'Mũ', label: 'Mũ' },
    { value: 'Điện thoại', label: 'Điện thoại' },
    { value: 'Túi xách', label: 'Túi xách' },
    { value: 'Giá đỡ', label: 'Giá đỡ' }
  ];

  return (
    <Stack spacing={2}>
      {title && (
        <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      )}
      <Box>
        <Grid container spacing={2}>
          <OrderFormTextField
            type='text'
            title={'Mã đơn hàng'}
            lg={0}
            xs={12}
            onChange={formik.handleChange}
            value={formik.values.code}
            name={'name'}
          />
          <OrderFormTextField
            type='autoComplete'
            title={'Sản phẩm'}
            lg={6}
            xs={12}
            options={options}
            onChange={(value) => formik.setFieldValue('product', value)}
            value={formik.values.product}
            name={'product'}
            placeholder='Nhập danh sách sản phẩm'
          />
          <OrderFormTextField
            type='text'
            title={'Địa chỉ'}
            lg={0}
            xs={6}
            value={formik.values.address}
            onChange={formik.handleChange}
            name={'address'}
          />

          <OrderFormTextField
            type='dateTime'
            title={'Thời gian giao hàng'}
            lg={6}
            xs={12}
            name={'devileryDate'}
            placeholder='Chọn thời gian giao hàng'
            onChange={formik.handleChange}
            value={formik.values.deliveryDate}
          />

          <OrderFormTextField
            type='text'
            title={'Phương thức thanh toán'}
            lg={6}
            xs={12}
            name={'paymentMethod'}
            value={formik.values.paymentMethod}
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
  );
};
