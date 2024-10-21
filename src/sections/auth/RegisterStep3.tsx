import React, { useCallback, useMemo, useState } from 'react';
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
import { SignUpRequest } from 'src/api/users';
import { useAuth } from '@hooks';
import useFunction from 'src/hooks/use-function';
import { paths } from 'src/paths';

interface SignUpFormProps extends Omit<SignUpRequest, 'token'> {}

function RegisterStep3() {
  const router = useRouter();
  const { completeSignUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleCompleteSignUp = useCallback(async (values: SignUpRequest) => {
    try {
      const response = await completeSignUp(values);
    } catch (error: any) {
      console.error(error);
    }
  }, []);
  const handleCompleteSignUpHelper = useFunction(handleCompleteSignUp, {
    successMessage: 'Đăng ký thành công!'
  });
  const formik = useFormik<SignUpFormProps & { confirmPassword: string }>({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dormitory: '',
      room: '',
      building: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Tên không được để trống'),
      lastName: Yup.string().required('Họ không được để trống'),
      phoneNumber: Yup.string().required('Số điện thoại không được để trống'),
      dormitory: Yup.string().required('Kí túc xá không được để trống'),
      room: Yup.string().required('Phòng không được để trống'),
      building: Yup.string().required('Tòa nhà không được để trống'),
      password: Yup.string().required('Mật khẩu không được để trống'),
      confirmPassword: Yup.string()
        .required('Nhập lại mật khẩu không được để trống')
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    }),
    onSubmit: useCallback(
      async (values) => {
        try {
          const signUpData = {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            dormitory: values.dormitory,
            room: values.room,
            building: values.building,
            password: values.password,
            token: router.query.token as string
          };
          await handleCompleteSignUpHelper.call(signUpData);
          router.push(paths.auth.login);
        } catch (error: any) {
          console.error(error);
        }
      },
      [router.query.token]
    )
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
    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col items-center'>
      <Stack width={'50%'} spacing={2} justifyContent={'center'}>
        <Box display={'flex'} flexDirection={'column'} gap={0.4}>
          <Typography fontWeight={'bold'}>Họ</Typography>
          <FormInput
            type='text'
            className='w-full px-3 rounded-lg bg-white'
            {...formik.getFieldProps('lastName')}
            error={formik.touched.lastName && !!formik.errors.lastName}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={0.4}>
          <Typography fontWeight={'bold'}>Tên</Typography>
          <FormInput
            type='text'
            className='w-full px-3 rounded-lg bg-white'
            {...formik.getFieldProps('firstName')}
            error={formik.touched.firstName && !!formik.errors.firstName}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={0.4}>
          <Typography fontWeight={'bold'}>Số điện thoại</Typography>
          <FormInput
            type='text'
            className='w-full px-3 rounded-lg bg-white'
            {...formik.getFieldProps('phoneNumber')}
            error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
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
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Typography fontWeight={'bold'}>Địa chỉ nhận hàng</Typography>
          <Box display={'flex'} justifyContent={'center'}>
            <Stack direction={'row'} spacing={5} className='w-[90%]'>
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
    </form>
  );
}

export default RegisterStep3;
