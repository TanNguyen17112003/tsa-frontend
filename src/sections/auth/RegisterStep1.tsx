import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import FormInput from 'src/components/ui/FormInput';
import { useFormik } from 'formik';
import React, { useCallback } from 'react';
import GoogleButton from './GoogleButton';
import * as Yup from 'yup';
import { useAuth } from 'src/hooks/use-auth';
import useFunction from 'src/hooks/use-function';

const validationSchema = Yup.object({
  email: Yup.string().email('Địa chỉ email không hợp lệ').required('Email không được để trống')
});

interface RegisterStep1Props {
  onNextStep: () => void;
}

function RegisterStep1({ onNextStep }: RegisterStep1Props) {
  const { initiateSignUp } = useAuth();
  const handleInitiateSignUp = useCallback(
    async (email: string) => {
      try {
        await initiateSignUp({ email });
        onNextStep(); // Call the callback function to navigate to the next step
      } catch (error: any) {
        console.error(error);
      }
    },
    [initiateSignUp, onNextStep]
  );

  const handleInitiateSignUpHelper = useFunction(handleInitiateSignUp, {
    successMessage: 'Gửi thông tin thành công!'
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await handleInitiateSignUpHelper.call(values.email);
      } catch (error: any) {
        console.error(error);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col items-center'>
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
          {...formik.getFieldProps('email')}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
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
    </form>
  );
}

export default RegisterStep1;
