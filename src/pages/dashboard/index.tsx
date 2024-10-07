import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import ContentHeader from 'src/components/content-header';
import { Box, Stack, Card } from '@mui/material';
import AnaLysticCard, { AnaLysticCardProps } from '../../sections/admin/analystic-card';
import { Profile2User, DocumentText, Box1, Diagram, ArrowRotateLeft } from 'iconsax-react';
import RevenueChart from 'src/sections/admin/revenue-chart';
import NumberOrderChart from 'src/sections/admin/number-order-chart';
import NumberOrderPercentageChart from 'src/sections/admin/number-order-percentage-chart';
import PaymentMethodLineChart from 'src/sections/admin/payment-method-line-chart';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { OrdersApi } from 'src/api/orders';
import useFunction from 'src/hooks/use-function';
import { useEffect, useMemo } from 'react';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const Page: PageType = () => {
  const router = useRouter();
  const getOrdersApi = useFunction(OrdersApi.getOrders);
  const orders = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const thisMonthOrders = getOrdersApi.data?.filter((order) => {
      const earliestOrderDate = formatDate(
        formatUnixTimestamp(order.historyTime[order.historyTime.length - 1].time)
      );
      const earliestOrderMonth = new Date(earliestOrderDate).getDate();
      return earliestOrderMonth === currentMonth;
    });
    return thisMonthOrders || [];
  }, [getOrdersApi.data]);

  const notHandledOrders = useMemo(() => {
    return orders.filter((order) => order.latestStatus === 'PENDING');
  }, [orders]);

  const gapOrders = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const lastWeekOrders = orders.filter((order) => {
      const earliestOrderDate = formatDate(
        formatUnixTimestamp(order.historyTime[order.historyTime.length - 1].time)
      );
      const earliestOrderDateObj = new Date(earliestOrderDate);
      return earliestOrderDateObj >= oneWeekAgo && earliestOrderDateObj <= today;
    });

    return ((orders.length - (lastWeekOrders.length || 1)) / (lastWeekOrders.length || 1)) * 100;
  }, [orders]);

  const gapNotHandledOrders = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const lastWeekOrders = (getOrdersApi.data || []).filter((order) => {
      const earliestOrderDate = formatDate(
        formatUnixTimestamp(order.historyTime[order.historyTime.length - 1].time)
      );
      const earliestOrderDateObj = new Date(earliestOrderDate);
      const filterStatus = order.latestStatus === 'PENDING';
      return earliestOrderDateObj >= oneWeekAgo && earliestOrderDateObj <= today && filterStatus;
    });

    return (
      ((notHandledOrders.length - (lastWeekOrders.length || 1)) / (lastWeekOrders.length || 1)) *
      100
    );
  }, [notHandledOrders, getOrdersApi.data]);

  const orderRevenue = useMemo(() => {
    const thisMonth = new Date().getMonth() + 1;
    const totalRevenue = (getOrdersApi.data || []).reduce((total, order) => {
      const earliestOrderDate = formatDate(
        formatUnixTimestamp(order.historyTime[order.historyTime.length - 1].time)
      );
      const earliestOrderMonth = new Date(earliestOrderDate).getDate();
      const filterStatus = order.latestStatus === 'DELIVERED';
      return earliestOrderMonth === thisMonth && filterStatus ? total + order.shippingFee : total;
    }, 0);
    return totalRevenue;
  }, [getOrdersApi.data]);

  const gapOrderRevenue = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const lastMonthOrderRevenue = (getOrdersApi.data || []).reduce((total, order) => {
      const earliestOrderDate = formatDate(
        formatUnixTimestamp(order.historyTime[order.historyTime.length - 1].time)
      );
      const earliestOrderMonth = new Date(earliestOrderDate).getDate();
      const filterStatus = order.latestStatus === 'DELIVERED';
      return earliestOrderMonth === currentMonth - 1 && filterStatus
        ? total + order.shippingFee
        : total;
    }, 0);
    return ((orderRevenue - lastMonthOrderRevenue) / lastMonthOrderRevenue) * 100;
  }, [getOrdersApi.data, orderRevenue]);
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
      value: orders.length,
      type: 'WEEK',
      icon: <Box1 variant='Bold' />,
      changeValue: gapOrders,
      iconColor: '#FEC53D',
      backgroundColor: '#FFF3D6',
      onClick: () => router.push(paths.dashboard.order.index as string)
    },
    {
      title: 'Tổng doanh thu',
      value: formatVNDcurrency(orderRevenue),
      type: 'MONTH',
      icon: <Diagram variant='Bold' />,
      changeValue: gapOrderRevenue,
      iconColor: '#4AD991',
      backgroundColor: '#D9F7E8',
      onClick: () => router.push(paths.dashboard.delivery.index as string)
    },
    {
      title: 'Số đơn chưa xử lý',
      value: notHandledOrders.length,
      type: 'WEEK',
      icon: <ArrowRotateLeft variant='Bold' />,
      changeValue: gapNotHandledOrders,
      iconColor: '#FF9871',
      backgroundColor: '#FFDED1',
      onClick: () => router.push(paths.dashboard.order.index as string)
    },
    {
      title: 'Tổng số khiếu nại',
      value: 32,
      type: 'MONTH',
      icon: <DocumentText variant='Bold' />,
      changeValue: 1.3,
      iconColor: '#4AD991',
      backgroundColor: '#D9F7E8',
      onClick: () => router.push(paths.dashboard.report.index)
    }
  ];

  useEffect(() => {
    getOrdersApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack className='min-h-screen bg-white'>
      <ContentHeader title='Bảng điều khiển' />
      <Box padding={3}>
        <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
          {analysticList.map((analystic, index) => (
            <Box className='w-1/5' key={index}>
              <AnaLysticCard {...analystic} />
            </Box>
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
