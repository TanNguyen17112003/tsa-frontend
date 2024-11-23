import {
  Box,
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import React, { useCallback, useState, useEffect } from 'react';
import { Box1, Edit } from 'iconsax-react';
import { PiMotorcycle } from 'react-icons/pi';

interface LandingFlowProps {
  image: React.ReactNode;
  title: string;
  description: string;
}

export const LandingFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      image: <PiMotorcycle size={'70%'} />,
      title: 'Giao hàng',
      description: 'Quản trị hệ thống tiến hành chỉ định nhân viên giao hàng'
    }
  ];

  useEffect(() => {
    flowList.forEach((_, index) => {
      setTimeout(() => {
        setActiveStep(index + 1);
      }, index * 1000);
    });
  }, [flowList.length]);

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
      <Stepper
        alternativeLabel={!isMobile}
        activeStep={activeStep}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {flowList.map((flow, index) => (
          <Step key={index} onClick={() => handleStepClick(index)} className='cursor-pointer'>
            <StepLabel>
              <Stack
                flexDirection={isMobile ? 'row' : 'column'}
                gap={isMobile ? 1 : 0}
                spacing={1}
                alignItems={'center'}
                width={'100%'}
              >
                <Box
                  width={isMobile ? 50 : isTablet ? 70 : 80}
                  height={isMobile ? 50 : isTablet ? 70 : 80}
                  borderRadius={'50%'}
                  bgcolor={'#5BE23D'}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  color={'#fff'}
                >
                  {flow.image}
                </Box>
                <Stack>
                  <Typography
                    fontWeight='bold'
                    variant={isMobile ? 'body1' : isTablet ? 'h6' : 'h5'}
                  >
                    {flow.title}
                  </Typography>
                  <Typography
                    textAlign={isMobile ? 'left' : 'center'}
                    fontWeight={'light'}
                    variant='body2'
                  >
                    {flow.description}
                  </Typography>
                </Stack>
              </Stack>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
