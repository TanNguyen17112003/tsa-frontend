import {
  Box,
  Grid,
  MenuItem,
  Typography,
  ListItemIcon,
  ListItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Stack } from '@mui/system';
import { FormikProps } from 'formik';
import React, { useMemo, type FC } from 'react';
import { OrderFormTextField } from './order-form-text-field';
import { paymentMethodOptions } from 'src/utils/payment-method';
import Image from 'next/image';
import { AddressData } from '@utils';
import { OrderFormProps } from 'src/api/orders';

interface OrderFormAttributes {
  formik: FormikProps<OrderFormProps>;
  title?: string;
  status: boolean;
}

export const OrderForm: FC<OrderFormAttributes> = ({ formik, title, status }) => {
  const options = [
    { value: 'Mũ', label: 'Mũ' },
    { value: 'Điện thoại', label: 'Điện thoại' },
    { value: 'Túi xách', label: 'Túi xách' },
    { value: 'Giá đỡ', label: 'Giá đỡ' }
  ];
  const brandOptions = [
    {
      value: 'Shopee',
      label: 'Shopee'
    },
    {
      value: 'Lazada',
      label: 'Lazada'
    },
    {
      value: 'Tiki',
      label: 'Tiki'
    },
    {
      value: 'Tiktok shop',
      label: 'Tiktok shop'
    }
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
            lg={6}
            xs={12}
            onChange={formik.handleChange}
            value={formik.values.checkCode as string}
            name={'checkCode'}
          />
          <OrderFormTextField
            type='autoComplete'
            title='Sàn thương mại'
            lg={6}
            xs={12}
            options={brandOptions}
            onChange={formik.handleChange}
            value={formik.values.brand as string}
            name='brand'
            placeholder='Nhập sàn thương mại của đơn hàng'
            isMultiple={false}
          />
          <OrderFormTextField
            type='number'
            title={'Khối lượng đơn hàng (kg)'}
            lg={6}
            xs={12}
            onChange={formik.handleChange}
            value={formik.values.weight as number}
            name={'weight'}
          />
          <OrderFormTextField
            type='autoComplete'
            title={'Sản phẩm'}
            lg={6}
            xs={12}
            options={options}
            onChange={(event) => formik.setFieldValue('product', event.target.value)}
            value={formik.values.product as string}
            name={'product'}
            placeholder='Nhập danh sách sản phẩm'
            isMultiple={true}
          />
        </Grid>
      </Box>
    </Stack>
  );
};
