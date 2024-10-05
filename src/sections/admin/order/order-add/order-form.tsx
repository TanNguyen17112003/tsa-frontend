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
            options={[]}
            onChange={(event) => formik.setFieldValue('product', event.target.value)}
            value={formik.values.product as string}
            name={'product'}
            placeholder='Nhập danh sách sản phẩm'
          />
        </Grid>
      </Box>
    </Stack>
  );
};
