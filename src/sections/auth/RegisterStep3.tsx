import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import FormInput from 'src/components/ui/FormInput';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import PasswordInput from './PasswordInput';
import * as Yup from 'yup';
import { AddressData } from 'src/utils/address-data';
import GoogleButton from './GoogleButton';

function RegisterStep3() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
      address: '',
      campus: '',
      department: '',
      room: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Tên đăng nhập không được để trống'),
      password: Yup.string().required('Mật khẩu không được để trống'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Mật khẩu không khớp'),
      address: Yup.string().required('Địa chỉ không được để trống')
    }),
    onSubmit: async (values) => {
      () => {};
    }
  });
  const campusList = useMemo(() => {
    return AddressData.campuses;
  }, [AddressData]);
  const departmentList = useMemo(() => {
    return formik.values.campus === 'Khu A' ? AddressData.departments.A : AddressData.departments.B;
  }, [formik.values.campus]);
  const roomList = useMemo(() => {
    return AddressData.rooms;
  }, [departmentList]);
  return (
    <Stack width={'50%'} spacing={2} justifyContent={'center'}>
      <Box display={'flex'} flexDirection={'column'} gap={0.4}>
        <Typography fontWeight={'bold'}>Tên đăng nhập</Typography>
        <FormInput
          type='text'
          className='w-full px-3 rounded-lg bg-white'
          {...formik.getFieldProps('username')}
          error={formik.touched.username && !!formik.errors.username}
          helperText={formik.touched.username && formik.errors.username}
        />
        <Typography variant='body2'>Nhập địa chỉ email của bạn</Typography>
      </Box>
      <Box display={'flex'} flexDirection={'column'} gap={0.5}>
        <Typography fontWeight={'bold'}>Mật khẩu</Typography>
        <PasswordInput
          {...formik.getFieldProps('password')}
          showPassword={showPassword}
          togglePasswordVisibility={() => setShowPassword(!showPassword)}
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password && formik.errors.password}
          className='bg-white'
        />
        <Typography variant='body2'>Nhập mật khẩu</Typography>
      </Box>
      <Box display={'flex'} flexDirection={'column'} gap={0.5}>
        <Typography fontWeight={'bold'}>Nhập lại mật khẩu</Typography>
        <PasswordInput
          {...formik.getFieldProps('confirmPassword')}
          showPassword={showConfirmPassword}
          togglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
          error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          className='bg-white'
        />
        <Typography variant='body2'>Nhập lại mật khẩu</Typography>
      </Box>
      <Box display={'flex'} flexDirection={'column'} gap={1}>
        <Typography fontWeight={'bold'}>Địa chỉ nhận hàng</Typography>
        <Box display={'flex'} justifyContent={'center'}>
          <Stack direction={'row'} spacing={5} className='w-[90%]'>
            <FormControl className='w-[33.33%]'>
              <InputLabel>Chọn kí túc xá</InputLabel>
              <Select value={formik.values.campus} onChange={formik.handleChange} name='campus'>
                {campusList.map((campus, index) => (
                  <MenuItem key={index} value={campus}>
                    {campus}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className='w-[33.33%]'>
              <InputLabel>Chọn tòa</InputLabel>
              <Select
                value={formik.values.department}
                onChange={formik.handleChange}
                name='department'
              >
                {departmentList.map((department, index) => (
                  <MenuItem key={index} value={department}>
                    {department}
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
      <Button
        className='mt-2 bg-green-400 hover:shadow-sm hover:bg-green-500'
        type='submit'
        variant='contained'
      >
        Hoàn tất
      </Button>
      <Stack className='w-full' spacing={2}>
        <Divider>Hoặc</Divider>
        <Box>
          <GoogleButton />
        </Box>
      </Stack>
    </Stack>
  );
}

export default RegisterStep3;
