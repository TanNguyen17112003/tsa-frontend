import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/shadcn/ui/button';
import FormInput from 'src/components/ui/FormInput';
import { AuthContextType } from 'src/contexts/auth/jwt-context';
import { useAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import PasswordInput from 'src/sections/auth/PasswordInput';
import type { Page as PageType } from 'src/types/page';
import * as Yup from 'yup';
import backgroundImage from 'public/ui/background-auth.png';
import Link from 'next/link';
import { useSearchParams } from 'src/hooks/use-search-params';
import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import GoogleButton from 'src/sections/auth/GoogleButton';

export const loginSchema = Yup.object({
  username: Yup.string().required('Email không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống')
});

const Page: PageType = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { signIn } = useAuth<AuthContextType>();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  // Use useFormik hook to manage form state and actions
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      general: ''
    },
    validationSchema: loginSchema, // Replace with your actual loginSchema
    onSubmit: async (values) => {
      try {
        await signIn(values.username, values.password);
        router.replace(returnTo || paths.dashboard.index);
      } catch {
        formik.setFieldError('general', 'Vui lòng kiểm tra lại Tên đăng nhập/Mật khẩu');
      }
    }
  });

  useEffect(() => {
    if (formik.values.username || formik.values.password) {
      formik.setFieldError('general', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.username, formik.values.password]);

  return (
    <Box className='h-screen flex bg-[#F6FDF5] items-center gap-10 px-6'>
      <Box width={'40%'}>
        <Image src={backgroundImage} className='w-[100%] object-contain' alt='Background images' />
      </Box>
      <Box width='35%' className='flex flex-col gap-5'>
        <Typography variant='h3'>Đăng nhập</Typography>
        <GoogleButton />
        <Divider>Hoặc</Divider>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-3 w-full'>
          <Box className='flex flex-col gap-1'>
            <Typography
              fontWeight={'bold'}
              className='label color-label-input-caret label-text text-xs'
            >
              Email
            </Typography>
            <FormInput
              type='text'
              className='w-full px-3 rounded-lg'
              {...formik.getFieldProps('username')}
              error={formik.touched.username && !!formik.errors.username}
              helperText={formik.touched.username && formik.errors.username}
            />
            <Typography variant='body2'>Nhập địa chỉ email của bạn</Typography>
          </Box>
          <Box className='flex flex-col gap-1'>
            <Typography
              fontWeight='bold'
              className='label color-label-input-caret label-text text-xs font-semibold'
            >
              Mật khẩu
            </Typography>
            <PasswordInput
              {...formik.getFieldProps('password')}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
              error={formik.touched.password && !!formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant='body2'>Nhật mật khẩu</Typography>
              <Button
                color='primary'
                variant='ghost'
                className='px-4 pt-1 pb-1 max-w-max h-[24px] text-xs text-primary hover:text-primary underline'
              >
                Quên mật khẩu
              </Button>
            </Stack>
          </Box>
          {formik.errors.general && (
            <Box>
              <Typography className='text-sm font-semibold text-center flex items-center justify-center text-red-500 gap-6'>
                {formik.errors.general}
              </Typography>
              <Box className='mt-5'></Box>
            </Box>
          )}
          <Button className='mt-2' type='submit'>
            Đăng nhập
          </Button>
        </form>
        <Box className='flex items-center'>
          <Typography>Chưa có tài khoản?</Typography>
          <Button
            asChild
            variant='ghost'
            className='px-4 pt-1 pb-1 max-w-max h-[24px] text-primary hover:text-primary'
          >
            <Link href={paths.auth.register} className='underline italic'>
              Đăng ký
            </Link>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
