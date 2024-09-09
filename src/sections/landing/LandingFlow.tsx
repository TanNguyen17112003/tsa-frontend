import { Box, Stack, Typography, Stepper, Step, StepLabel } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Box1, Edit } from 'iconsax-react';
import { BikeIcon } from 'lucide-react';

interface LandingFlowProps {
  image: React.ReactNode;
  title: string;
  description: string;
}

export const LandingFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const flowList: LandingFlowProps[] = [
    {
      image: <Box1 size={'70%'} />,
      title: 'Nhận hàng',
      description: 'Shipper giao những đơn hàng của sinh viên cho nhân viên hệ thống phụ trách'
    },
    {
      image: <Edit size={'70%'} />,
      title: 'Nhập liệu thông tin',
      description: 'Sinh viên nhập liệu thông tin đơn hàng lên hệ thống'
    },
    {
      image: <BikeIcon size={'70%'} />,
      title: 'Giao hàng',
      description: 'Quản trị hệ thống tiến hành chỉ định nhân viên giao hàng'
    }
  ];

  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index);
  }, []);
  return (
    <Box
      paddingX={6}
      paddingY={5}
      sx={{
        backgroundColor: '#f6fdf5',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Typography textAlign={'center'} variant='h4' marginBottom={5} color='black'>
        Luồng hoạt động của hệ thống
      </Typography>
      <Stepper alternativeLabel activeStep={activeStep}>
        {flowList.map((flow, index) => (
          <Step key={index} onClick={() => handleStepClick(index)} className='cursor-pointer'>
            <StepLabel>
              <Stack spacing={1} alignItems='center' width={'100%'}>
                <Box
                  width={80}
                  height={80}
                  borderRadius={'50%'}
                  bgcolor={'#5BE23D'}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  color={'#fff'}
                >
                  {flow.image}
                </Box>
                <Typography variant='h5'>{flow.title}</Typography>
                <Typography textAlign={'center'} fontWeight={'light'} variant='body2'>
                  {flow.description}
                </Typography>
              </Stack>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
