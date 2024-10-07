import { ArrowBack } from '@mui/icons-material';
import { Box, Typography, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Page as PageType } from 'src/types/page';
import StaffDetailInformation from 'src/sections/admin/staff/staff-detail/staff-detail-information';
import StaffDetailDeliveryChart from 'src/sections/admin/staff/staff-detail/staff-detail-delivery-chart';
import StaffDetailHeatChart from 'src/sections/admin/staff/staff-detail/staff-detail-heat-chart';
import StaffDetailOrderChart from 'src/sections/admin/staff/staff-detail/staff-detail-order-chart';
import StaffDetailOrderRadialChart from 'src/sections/admin/staff/staff-detail/staff-detail-order-radial-chart';
import StaffDetailPaymentChart from 'src/sections/admin/staff/staff-detail/staff-detail-payment-chart';
import AnaLysticCard, { AnaLysticCardProps } from 'src/sections/admin/analystic-card';
import { Box1 } from 'iconsax-react';
import { Bike } from 'lucide-react';

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
      title: 'Tổng số chuyến đi',
      value: 32,
      changeValue: 1.4,
      type: 'MONTH',
      icon: <Bike fontVariant={'bold'} />,
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
                router.push(paths.dashboard.staff.index);
              }}
            >
              <ArrowBack fontSize='small' className='align-middle' /> Quay lại
            </Box>
            <Box className='flex items-center gap-4 justify-between w-full mt-3'>
              <Typography variant='h5'>Chi tiết nhân viên #{router.query.staffId}</Typography>
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
              <StaffDetailInformation />
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack className='h-full'>
              <StaffDetailOrderRadialChart />
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack className='h-full'>
              <StaffDetailPaymentChart />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack className='h-full'>
              <StaffDetailHeatChart />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack className='h-full'>
              <StaffDetailDeliveryChart />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack className='h-full'>
              <StaffDetailOrderChart />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
