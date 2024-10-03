import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import ContentHeader from 'src/components/content-header';
import { Box, Stack, Card } from '@mui/material';
import AnaLysticCard, { AnaLysticCardProps } from '../../sections/admin/analystic-card';
import { Profile2User, Box1, Diagram, ArrowRotateLeft } from 'iconsax-react';
import RevenueChart from 'src/sections/admin/revenue-chart';
import NumberOrderChart from 'src/sections/admin/number-order-chart';
import NumberOrderPercentageChart from 'src/sections/admin/number-order-percentage-chart';
import PaymentMethodLineChart from 'src/sections/admin/payment-method-line-chart';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';

const Page: PageType = () => {
  const router = useRouter();
  const analysticList: AnaLysticCardProps[] = [
    {
      title: 'Số người dùng',
      value: 40689,
      type: 'WEEK',
      icon: <Profile2User variant='Bold' />,
      changeValue: 8.5,
      iconColor: '#8280FF',
      backgroundColor: '#E5E4FF',
      onClick: () => router.push(paths.dashboard.student.index as string)
    },
    {
      title: 'Tổng số đơn hàng',
      value: 10293,
      type: 'WEEK',
      icon: <Box1 variant='Bold' />,
      changeValue: 1.3,
      iconColor: '#FEC53D',
      backgroundColor: '#FFF3D6',
      onClick: () => router.push(paths.dashboard.order.index as string)
    },
    {
      title: 'Tổng doanh thu',
      value: '100.000 đ',
      type: 'MONTH',
      icon: <Diagram variant='Bold' />,
      changeValue: -4.3,
      iconColor: '#4AD991',
      backgroundColor: '#D9F7E8',
      onClick: () => router.push(paths.dashboard.delivery.index as string)
    },
    {
      title: 'Số đơn chưa xử lý',
      value: 2040,
      type: 'WEEK',
      icon: <ArrowRotateLeft variant='Bold' />,
      changeValue: 1.8,
      iconColor: '#FF9871',
      backgroundColor: '#FFDED1',
      onClick: () => router.push(paths.dashboard.order.index as string)
    }
  ];

  return (
    <Stack className='min-h-screen bg-white'>
      <ContentHeader title='Bảng điều khiển' />
      <Box padding={3}>
        <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
          {analysticList.map((analystic, index) => (
            <AnaLysticCard key={index} {...analystic} />
          ))}
        </Stack>
      </Box>
      <Box padding={3} display={'flex'} flexDirection={'column'} gap={3}>
        <Stack direction={'row'} spacing={2}>
          <Card className='p-3 w-1/2'>
            <RevenueChart />
          </Card>
          <Card className='p-3 w-1/2'>
            <PaymentMethodLineChart />
          </Card>
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <Card className='p-3 w-1/2'>
            <NumberOrderChart />
          </Card>
          <Card className='p-3 w-1/2'>
            <NumberOrderPercentageChart />
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
