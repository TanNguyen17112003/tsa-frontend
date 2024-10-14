import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
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
import { HomeIcon } from '@heroicons/react/24/solid';
import { useMounted } from '@hooks';

export const loginSchema = Yup.object({
  email: Yup.string().required('Email không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống')
});

const Page: PageType = () => {
  const isMounted = useMounted();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      general: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const user = await signIn(values.email, values.password);
        console.log('user', user);
        if (isMounted() && user) {
          if (user.role === 'STUDENT') {
            router.replace(paths.student.index);
          } else if (user.role === 'ADMIN') {
            router.replace(paths.dashboard.index);
          }
        }
      } catch (error) {
        setFieldError('general', 'Vui lòng kiểm tra lại Tên đăng nhập/Mật khẩu');
      } finally {
        setSubmitting(false);
      }
    }
  });

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
      <Box width={'40%'}>
        <Image src={backgroundImage} className='w-[100%] object-contain' alt='Background images' />
      </Box>
      <Box width='60%' className='flex justify-center'>
        <Box width={'70%'} className='flex flex-col gap-5'>
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
            <Button className='mt-2' type='submit' disabled={formik.isSubmitting}>
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
    </Box>
  );
};

export default Page;
