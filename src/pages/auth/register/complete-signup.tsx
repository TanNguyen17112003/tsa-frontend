import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { paths } from 'src/paths';
import type { Page as PageType } from 'src/types/page';
import { Box, Typography, Step, Stepper, StepLabel, Stack } from '@mui/material';
import RegisterStep3 from 'src/sections/auth/RegisterStep3';
import { ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '@hooks';

const Page: PageType = () => {
  const [registrationStep, setRegistrationStep] = useState(1);
  const { completeSignUp } = useAuth();
  const flowList = [
    {
      title: 'Nhập địa chỉ email'
    },
    {
      title: 'Xác thực email'
    },
    {
      title: 'Thông tin cá nhân'
    }
  ];
  const router = useRouter();

  const handleBackLogin = useCallback(() => {
    router.push(paths.auth.login);
  }, []);

  const handleStepClick = useCallback((index: number) => {
    setRegistrationStep(index);
  }, []);

  return (
    <Box className='relative'>
      <Stack
        direction={'row'}
        spacing={1}
        alignItems={'center'}
        className='absolute top-6 left-6 cursor-pointer'
        onClick={handleBackLogin}
      >
        <ArrowLeftIcon size={24} />
        <Typography>Quay lại</Typography>
      </Stack>
      <Box className='min-h-screen flex flex-col bg-[#F6FDF5] items-center justify-center gap-10 px-6 text-black'>
        <Stack alignItems={'center'}>
          <Typography variant='h3' sx={{ wordSpacing: '0.2rem' }}>
            Tạo tài khoản
          </Typography>
          <Box display={'flex'} gap={1}>
            <Typography variant='body2'>Đã có tài khoản?</Typography>
            <Typography
              variant='body2'
              className='underline italic cursor-pointer'
              onClick={handleBackLogin}
            >
              Đăng nhập
            </Typography>
          </Box>
        </Stack>
        <Stepper activeStep={registrationStep} alternativeLabel className='w-[40%]'>
          {flowList.map((flow, index) => (
            <Step key={index} onClick={() => handleStepClick(index + 1)} className='cursor-pointer'>
              <StepLabel>
                <Typography variant='body2'>{flow.title}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <RegisterStep3 />
      </Box>
    </Box>
  );
};

export default Page;
