import { ArrowBack } from '@mui/icons-material';
import { Box, Typography, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Page as PageType } from 'src/types/page';
import StudentDetailHeatChart from 'src/sections/admin/student/student-detail/student-detail-heat-chart';
import StudentDetailInformation from 'src/sections/admin/student/student-detail/student-detail-information';
import StudentDetailExpenseChart from 'src/sections/admin/student/student-detail/student-detail-expense-chart';
import StudentDetailOrderChart from 'src/sections/admin/student/student-detail/student-detail-order-chart';
import StudentDetailPaymentChart from 'src/sections/admin/student/student-detail/student-detail-payment-chart';
import AnaLysticCard, { AnaLysticCardProps } from 'src/sections/admin/analystic-card';
import { Box1, DocumentText } from 'iconsax-react';

const Page: PageType = () => {
  const router = useRouter();

  const mockAnalysticData: AnaLysticCardProps[] = [
    {
      title: 'Tổng số đơn hàng',
      value: 32,
      changeValue: 1.5,
      type: 'WEEK',
      icon: <Box1 variant='Bold' />,
      iconColor: '#FEC53D',
      backgroundColor: '#FFF3D6'
    },
    {
      title: 'Tổng số khiếu nại',
      value: 32,
      changeValue: 1.4,
      type: 'MONTH',
      icon: <DocumentText variant='Bold' />,
      iconColor: '#4AD991',
      backgroundColor: '#D9F7E8'
    }
  ];

  return (
    <Box className='min-h-screen w-full mx-auto py-3 px-2 text-black bg-white'>
      <Stack spacing={4}>
        <Box className='flex justify-between items-start w-full px-3'>
          <Box className='w-full'>
            <Box
              className='cursor-pointer'
              onClick={() => {
                router.push(paths.dashboard.student.index);
              }}
            >
              <ArrowBack fontSize='small' className='align-middle' /> Quay lại
            </Box>
            <Box className='flex items-center gap-4 justify-between w-full mt-3'>
              <Typography variant='h5'>Chi tiết người dùng #{router.query.studentId}</Typography>
            </Box>
            <Box className='mt-5'>
              <Stack direction={'row'} gap={2}>
                {mockAnalysticData.map((analystic, index) => (
                  <Box className='w-1/2' key={index}>
                    <AnaLysticCard {...analystic} />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Stack className='h-full'>
              <StudentDetailInformation />
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Stack className='h-full'>
              <StudentDetailOrderChart />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack className='h-full'>
              <StudentDetailHeatChart />
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack className='h-full'>
              <StudentDetailPaymentChart />
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Stack className='h-full'>
              <StudentDetailExpenseChart />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
