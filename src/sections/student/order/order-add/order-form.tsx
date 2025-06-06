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
import { DeliverySlot } from './order-add-page';

interface OrderFormAttributes {
  formik: FormikProps<OrderFormProps>;
  title?: string;
  status: boolean;
  timeSlots?: DeliverySlot[];
}

export const OrderForm: FC<OrderFormAttributes> = ({ formik, title, status, timeSlots }) => {
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

  const filteredTimeSlotOptions = useMemo(() => {
    return timeSlots
      ?.slice()
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map((timeSlot) => {
        return {
          label: `${timeSlot.startTime} - ${timeSlot.endTime}`,
          value: timeSlot.startTime
        };
      });
  }, [timeSlots]);

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
          <Grid item xs={12} lg={6}>
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
                    <Select value={formik.values.room} onChange={formik.handleChange} name='room'>
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
            type='date'
            title={'Ngày giao hàng'}
            lg={3}
            xs={12}
            name={'deliveryDay'}
            placeholder='Chọn ngày gian giao hàng'
            onChange={formik.handleChange}
            value={formik.values.deliveryDay as string}
          />
          <OrderFormTextField
            type='text'
            title='Khung giờ giao hàng'
            lg={3}
            xs={12}
            name='deliveryTimeSlot'
            placeholder='Chọn khung giờ giao hàng'
            select
            onChange={(event) => formik.setFieldValue('deliveryTimeSlot', event.target.value)}
            value={formik.values.deliveryTimeSlot as string}
          >
            {filteredTimeSlotOptions?.map((slot, index) => (
              <MenuItem key={index} value={slot.value}>
                {slot.label}
              </MenuItem>
            ))}
          </OrderFormTextField>

          <OrderFormTextField
            type='text'
            title={'Phương thức thanh toán'}
            lg={6}
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
  );
};
