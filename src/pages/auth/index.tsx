import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/shadcn/ui/button';
import FormInput from 'src/components/ui/FormInput';
import HeaderTitle from 'src/components/ui/HeaderTitle';
import { AuthContextType } from 'src/contexts/auth/jwt-context';
import { useAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import PasswordInput from 'src/sections/auth/PasswordInput';
import type { Page as PageType } from 'src/types/page';
import * as Yup from 'yup';
import backgroundImage from '../../../public/ui/landing-logo-1.png';
import Link from 'next/link';
import { useSearchParams } from 'src/hooks/use-search-params';

export const loginSchema = Yup.object({
  username: Yup.string().required('Tên đăng nhập không được để trống'),
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
    <div className='h-screen flex '>
      <Image
        src={backgroundImage}
        className='flex-1 min-w-0 object-cover'
        alt='Background images'
      />

      <div className='flex flex-col max-w-max max-h-max justify-center items-center px-[106px]'>
        <HeaderTitle />
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-3 w-full'>
          <div className='flex flex-col gap-1'>
            <span className='label color-label-input-caret label-text text-xs  font-semibold '>
              Tên đăng nhập
            </span>
            <FormInput
              type='text'
              placeholder='Nhập tên đăng nhập tại đây ...'
              className='w-full px-3'
              {...formik.getFieldProps('username')}
              error={formik.touched.username && !!formik.errors.username}
              helperText={formik.touched.username && formik.errors.username}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <span className='label color-label-input-caret label-text text-xs  font-semibold'>
              Mật khẩu
            </span>
            <PasswordInput
              {...formik.getFieldProps('password')}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
              error={formik.touched.password && !!formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />
          </div>
          {formik.errors.general && (
            <div>
              <p className='text-sm font-semibold text-center flex items-center justify-center  text-red-500 gap-6'>
                {formik.errors.general}
              </p>
              <div className='mt-5'> </div>
            </div>
          )}
          <Button
            className='w-full mt-2'
            type='submit' // Specify the button type as "submit"
          >
            Đăng nhập
          </Button>
        </form>
        <div className='flex items-center gap-0'>
          <Button
            asChild
            variant='ghost'
            className='px-4 pt-1 pb-1 max-w-max h-[24px] text-xs text-primary hover:text-primary'
          >
            <Link href={paths.auth.register}>Đăng ký tài khoản</Link>
          </Button>
          <span>/</span>
          <Button
            color='primary'
            variant='ghost'
            className='px-4 pt-1 pb-1 max-w-max h-[24px] text-xs text-primary hover:text-primary'
          >
            Quên mật khẩu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
