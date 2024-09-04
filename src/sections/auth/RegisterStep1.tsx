import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import FormInput from 'src/components/ui/FormInput';
import { useFormik } from 'formik';
import React from 'react';
import GoogleButton from './GoogleButton';
import * as Yup from 'yup';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';

const validationSchema = Yup.object({
  fullName: Yup.string().required('Họ và tên không được để trống'),
  username: Yup.string().required('Tên đăng nhập không được để trống'),
  email: Yup.string().email('Địa chỉ email không hợp lệ').required('Email không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Mật khẩu không khớp')
});

function RegisterStep1() {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await signUp(
          values.email,
          values.username,
          values.fullName,
          values.password,
          values.confirmPassword
        );
        console.log(response);
        router.replace(paths.auth.login);
      } catch (error: any) {
        console.error(error);
      }
    }
  });
  const router = useRouter();
  const { signUp } = useAuth();

  return (
    <>
      <Box className='flex flex-col gap-1 w-[40%]'>
        <Typography
          fontWeight={'bold'}
          className='label color-label-input-caret label-text text-xs'
        >
          Email
        </Typography>
        <FormInput
          type='text'
          className='w-full px-3 rounded-lg bg-white'
          {...formik.getFieldProps('username')}
          error={formik.touched.username && !!formik.errors.username}
          helperText={formik.touched.username && formik.errors.username}
        />
        <Typography variant='body2'>Nhập địa chỉ email của bạn</Typography>
        <Button
          className='mt-2 bg-green-400 hover:shadow-sm hover:bg-green-500'
          type='submit'
          variant='contained'
        >
          Tiếp tục
        </Button>
      </Box>
      <Stack className='w-[40%]' spacing={2}>
        <Divider>Hoặc</Divider>
        <Box>
          <GoogleButton />
        </Box>
      </Stack>
    </>
  );
}

export default RegisterStep1;
