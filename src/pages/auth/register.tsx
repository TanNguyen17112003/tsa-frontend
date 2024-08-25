import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Button } from 'src/components/shadcn/ui/button';
import FormInput from 'src/components/ui/FormInput';
import HeaderTitle from 'src/components/ui/HeaderTitle';
import { useAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import PasswordInput from 'src/sections/auth/PasswordInput';
import type { Page as PageType } from 'src/types/page';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  fullName: Yup.string().required('Họ và tên không được để trống'),
  username: Yup.string().required('Tên đăng nhập không được để trống'),
  email: Yup.string().email('Địa chỉ email không hợp lệ').required('Email không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Mật khẩu không khớp')
});

const Page: PageType = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  // Use useFormik hook to manage form state and actions
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

  return (
    <>
      <div className='h-screen flex '>
        {/* <Image
          src={backgroundImage}
          className="flex-1 min-w-0 object-cover"
          alt="Background images"
        /> */}
        <div className='flex flex-col max-w-max max-h-screen justify-center px-[106px]'>
          <HeaderTitle />
          <div
            className='flex items-center px-4 pt-1 pb-1 border-slate-200 border gap-2  w-[115px] text-xs h-[24px] bg-buttons-buttons-secondary-default rounded-lg cursor-pointer'
            onClick={() => router.push(paths.auth.login)}
          >
            <FaArrowLeftLong />
            <span className='label color-label-input-caret label-text text-xs  font-semibold w-[60px] h-[16px]'>
              Quay lại
            </span>
          </div>
          <form onSubmit={formik.handleSubmit} className='flex flex-col gap-3 mt-2'>
            <div className='flex flex-col gap-1'>
              <div className='label color-label-input-caret label-text text-xs  font-semibold'>
                Họ và tên
              </div>
              <FormInput
                type='text'
                placeholder='Nhập họ và tên của bạn ...'
                className='w-full px-3'
                {...formik.getFieldProps('fullName')}
                error={formik.touched.fullName && !!formik.errors.fullName}
                helperText={!!formik.touched.fullName && formik.errors.fullName}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='label color-label-input-caret label-text text-xs font-semibold'>
                Tên đăng nhập
              </div>
              <FormInput
                type='text'
                placeholder='Nhập tên đăng nhập tại đây ...'
                className='w-full px-3'
                {...formik.getFieldProps('username')}
                error={formik.touched.username && !!formik.errors.username}
                helperText={!!formik.touched.username && formik.errors.username}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <span className='label color-label-input-caret label-text text-xs font-semibold'>
                Địa chỉ Email
              </span>
              <FormInput
                type='text'
                placeholder='Nhập địa chỉ Email tại đây ...'
                className='w-full px-3'
                {...formik.getFieldProps('email')}
                error={formik.touched.email && !!formik.errors.email}
                helperText={!!formik.touched.email && formik.errors.email}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='label color-label-input-caret label-text text-xs font-semibold'>
                Mật khẩu
              </div>
              <PasswordInput
                {...formik.getFieldProps('password')}
                showPassword={showPassword}
                togglePasswordVisibility={() => setShowPassword(!showPassword)}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='label color-label-input-caret label-text text-xs font-semibold'>
                Nhập lại mật khẩu
              </div>

              <PasswordInput
                {...formik.getFieldProps('confirmPassword')}
                showPassword={showConfirmPassword}
                togglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </div>
            <Button className='w-full mt-2' type='submit'>
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
