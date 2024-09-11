import { Box, Grid, MenuItem, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FormikProps } from 'formik';
import React, { useMemo, type FC, useEffect } from 'react';
import useFunction from 'src/hooks/use-function';
import { getFormData } from 'src/utils/api-request';
import { OrderDetail, OrderImport } from 'src/types/order';
import { OrderFormTextField } from './order-form-text-field';

interface OrderFormProps {
  formik: FormikProps<OrderImport>;
  title?: string;
  status: boolean;
}

export const OrderForm: FC<OrderFormProps> = ({ formik, title, status }) => {
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
            title={'Mã đơn hàng'}
            lg={0}
            xs={12}
            onChange={formik.handleChange}
            value={formik.values.code}
            name={'name'}
          ></OrderFormTextField>

          <OrderFormTextField
            title={'Sản phẩm'}
            lg={6}
            xs={12}
            onChange={formik.handleChange}
            value={formik.values.product.toLocaleString()}
            select
            name={'product'}
          ></OrderFormTextField>

          <OrderFormTextField
            title={'Địa chỉ'}
            lg={0}
            xs={6}
            value={formik.values.address}
            onChange={formik.handleChange}
            select
            name={'address'}
          ></OrderFormTextField>

          <OrderFormTextField
            title={'Thời gian giao hàng'}
            lg={0}
            xs={6}
            name={'devileryDate'}
            onChange={formik.handleChange}
            value={formik.values.deliveryDate}
          ></OrderFormTextField>

          <OrderFormTextField
            title={'Phương thức thanh toán'}
            lg={6}
            xs={12}
            name={'paymentMethod'}
            value={formik.values.paymentMethod}
            select
            onChange={formik.handleChange}
          ></OrderFormTextField>
        </Grid>
      </Box>
    </Stack>
  );
};
