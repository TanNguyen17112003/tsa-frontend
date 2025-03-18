import { Box, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FormikProps } from 'formik';
import React, { type FC } from 'react';
import { OrderFormTextField } from './order-form-text-field';
import { OrderFormProps } from 'src/api/orders';

interface OrderFormAttributes {
  formik: FormikProps<OrderFormProps>;
  title?: string;
  status: boolean;
}

export const OrderForm: FC<OrderFormAttributes> = ({ formik, title }) => {
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
      value: 'Tiktok',
      label: 'Tiktok'
    },
    {
      value: 'Sendo',
      label: 'Sendo'
    },
    {
      value: 'Bách hóa xanh',
      label: 'Bách hóa xanh'
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
        </Grid>
      </Box>
    </Stack>
  );
};
