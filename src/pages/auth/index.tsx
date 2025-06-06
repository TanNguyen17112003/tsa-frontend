import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/shadcn/ui/button';
import FormInput from 'src/components/ui/FormInput';
import { useAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import PasswordInput from 'src/sections/auth/PasswordInput';
import type { Page as PageType } from 'src/types/page';
import * as Yup from 'yup';
import backgroundImage from 'public/ui/background-auth.png';
import Link from 'next/link';
import React from 'react';
import { Box, Typography, Divider, Stack, useTheme, useMediaQuery } from '@mui/material';
import GoogleButton from 'src/sections/auth/GoogleButton';
import { HomeIcon } from '@heroicons/react/24/solid';
import { useMounted } from '@hooks';
import LoadingProcess from 'src/components/LoadingProcess';
import useFunction from 'src/hooks/use-function';

export const loginSchema = Yup.object({
  email: Yup.string().required('Email không được để trống').email('Email không đúng định dạng'),
  password: Yup.string().required('Mật khẩu không được để trống')
});

const Page: PageType = () => {
  const theme = useTheme();
  const { signIn, user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMounted = useMounted();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = useCallback(
    async (values: { email: string; password: string }) => {
      try {
        const user = await signIn(values.email, values.password);
        if (isMounted() && user) {
          if (user.role === 'STUDENT') {
            router.replace(paths.student.order.index);
          } else if (user.role === 'ADMIN') {
            router.replace(paths.dashboard.order.index);
          } else {
            router.replace(paths.staff.order.index);
          }
        } else {
          throw new Error('Vui lòng kiểm tra lại Tên đăng nhập/Mật khẩu');
        }
      } catch (error: any) {
        throw error;
      }
    },
    [isMounted, signIn]
  );

  const handleSignInHelper = useFunction(handleSignIn);

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      general: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      // try {
      //   const user = await signIn(values.email, values.password);
      //   console.log('user', user);
      //   if (isMounted() && user) {
      //     if (user.role === 'STUDENT') {
      //       router.replace(paths.student.order.index);
      //     } else if (user.role === 'ADMIN') {
      //       router.replace(paths.dashboard.index);
      //     } else {
      //       router.replace(paths.staff.order.index);
      //     }
      //   }
      // } catch (error) {
      //   setFieldError('general', 'Vui lòng kiểm tra lại Tên đăng nhập/Mật khẩu');
      //   throw error;
      // } finally {
      //   setSubmitting(false);
      // }
      await handleSignInHelper.call(values);
      setSubmitting(false);
    }
  });

  const isButtonDisabled =
    !formik.values.email ||
    !formik.values.password ||
    !!formik.errors.email ||
    !!formik.errors.password ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formik.values.email);

  const handleBack = useCallback(() => {
    router.push(paths.landing.index);
  }, [router]);

  useEffect(() => {
    if (formik.values.email || formik.values.password) {
      formik.setFieldError('general', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.email, formik.values.password]);

  return (
    <Box className='h-screen flex bg-[#F6FDF5] items-center gap-10 px-6 text-black'>
      {!isMobile && (
        <Box width={'40%'}>
          <Image
            src={backgroundImage}
            className='w-[100%] object-contain'
            alt='Background images'
          />
        </Box>
      )}
      <Box width={isMobile ? '100%' : '60%'} className='flex justify-center'>
        <Box width={isMobile ? '100%' : '70%'} className='flex flex-col gap-5'>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            className='cursor-pointer'
            onClick={handleBack}
          >
            <HomeIcon width={20} />
            <Typography>Trang chủ</Typography>
          </Stack>
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
                className='w-full px-3 rounded-lg bg-white'
                {...formik.getFieldProps('email')}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
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
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
                className='bg-white'
              />
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant='body2'>Nhập mật khẩu</Typography>
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
            <Button className='mt-2' type='submit' disabled={isButtonDisabled}>
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
              <Link href={paths.auth.register.index} className='underline italic'>
                Đăng ký
              </Link>
            </Button>
          </Box>
        </Box>
      </Box>
      {formik.isSubmitting && <LoadingProcess />}
    </Box>
  );
};

export default Page;
