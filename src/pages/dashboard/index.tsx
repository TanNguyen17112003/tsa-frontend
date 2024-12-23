import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import ContentHeader from 'src/components/content-header';
import { Box, Stack, Card } from '@mui/material';
import AnaLysticCard, { AnaLysticCardProps } from '../../sections/admin/analystic-card';
import {
  Profile2User,
  DocumentText,
  Box1,
  Diagram,
  ArrowRotateLeft,
  Category2
} from 'iconsax-react';
import RevenueChart from 'src/sections/admin/revenue-chart';
import NumberOrderChart from 'src/sections/admin/number-order-chart';
import NumberOrderPercentageChart from 'src/sections/admin/number-order-percentage-chart';
import PaymentMethodLineChart from 'src/sections/admin/payment-method-line-chart';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { OrdersApi } from 'src/api/orders';
import { UsersApi } from 'src/api/users';
import { ReportsApi } from 'src/api/reports';
import useFunction from 'src/hooks/use-function';
import { useEffect, useMemo } from 'react';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';
import { useResponsive } from 'src/utils/use-responsive';
import MobileContentHeader from 'src/components/mobile-content-header';

const Page: PageType = () => {
  const router = useRouter();
  const getOrdersApi = useFunction(OrdersApi.getOrders);
  const getListUsersApi = useFunction(UsersApi.getUsers);
  const getReportsApi = useFunction(ReportsApi.getReports);

  const { isMobile } = useResponsive();

  const users = useMemo(() => {
    return (getListUsersApi.data || []).filter((user) => user.role === 'STUDENT');
  }, [getListUsersApi.data]);
  const orders = useMemo(() => {
    return getOrdersApi.data?.results || [];
  }, [getOrdersApi.data]);
  const reports = useMemo(() => {
    return getReportsApi.data?.results || [];
  }, [getReportsApi.data]);

  const thisWeekUsers = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return users.filter((user) => {
      const createDate = new Date(Number(user.createdAt) * 1000); // Convert Unix timestamp to Date
      return createDate >= monday && createDate <= now;
    });
  }, [users]);
  const lastWeekUsers = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - diffToMonday);
    thisMonday.setHours(0, 0, 0, 0);

    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);

    return users.filter((user) => {
      const createDate = new Date(Number(user.createdAt) * 1000); // Convert Unix timestamp to Date
      return createDate >= lastMonday && createDate <= lastSunday;
    });
  }, [users]);

  const thisWeekOrders = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return orders.filter((order) => {
      const orderDate = new Date(order.deliveryDate);
      return orderDate >= monday && orderDate <= now;
    });
  }, [orders]);
  const lastWeekOrders = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - diffToMonday);
    thisMonday.setHours(0, 0, 0, 0);

    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);

    return orders?.filter((order) => {
      const orderDate = new Date(order.deliveryDate);
      return orderDate >= lastMonday && orderDate <= lastSunday;
    });
  }, [orders]);

  const thisMonthOrders = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return orders?.filter((order) => {
      const deliveredAt = new Date(Number(order.deliveryDate) * 1000);
      return deliveredAt >= startOfMonth && deliveredAt <= endOfMonth;
    });
  }, [orders]);
  const lastMonthOrders = useMemo(() => {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return orders?.filter((order) => {
      const deliveredAt = new Date(Number(order.deliveryDate) * 1000);
      return deliveredAt >= startOfLastMonth && deliveredAt <= endOfLastMonth;
    });
  }, [orders]);

  const thisMonthRevenue = useMemo(() => {
    const totalRevenue = thisMonthOrders.reduce((total, order) => {
      return total + order.shippingFee;
    }, 0);
    return totalRevenue;
  }, [thisMonthOrders]);
  const lastMonthRevenue = useMemo(() => {
    const totalRevenue = thisMonthOrders.reduce((total, order) => {
      return total + order.shippingFee;
    }, 0);
    return totalRevenue;
  }, [lastMonthOrders]);

  const thisMonthReports = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return reports?.filter((report) => {
      const reportedAt = new Date(Number(report.reportedAt) * 1000);
      return reportedAt >= startOfMonth && reportedAt <= endOfMonth;
    });
  }, [reports]);
  const lastMonthReports = useMemo(() => {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return reports?.filter((report) => {
      const reportedAt = new Date(Number(report.reportedAt) * 1000);
      return reportedAt >= startOfLastMonth && reportedAt <= endOfLastMonth;
    });
  }, [reports]);

  const analysticList: AnaLysticCardProps[] = [
    {
      title: 'Số người dùng',
      value: thisWeekUsers.length,
      type: 'WEEK',
      icon: <Profile2User variant='Bold' />,
      changeValue: (thisWeekUsers.length - lastWeekUsers.length) / lastWeekUsers.length,
      iconColor: '#8280FF',
      backgroundColor: '#E5E4FF',
      onClick: () => router.push(paths.dashboard.student.index as string)
    },
    {
      title: 'Tổng số đơn hàng',
      value: thisWeekOrders.length,
      type: 'WEEK',
      icon: <Box1 variant='Bold' />,
      changeValue: (thisWeekOrders.length - lastWeekOrders.length) / lastWeekOrders.length,
      iconColor: '#FEC53D',
      backgroundColor: '#FFF3D6',
      onClick: () => router.push(paths.dashboard.order.index as string)
    },
    {
      title: 'Tổng doanh thu',
      value: formatVNDcurrency(thisMonthRevenue),
      type: 'MONTH',
      icon: <Diagram variant='Bold' />,
      changeValue: (thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue,
      iconColor: '#4AD991',
      backgroundColor: '#D9F7E8',
      onClick: () => router.push(paths.dashboard.delivery.index as string)
    },
    {
      title: 'Số đơn chưa xử lý',
      value: thisWeekOrders.filter((order) => order.latestStatus === 'PENDING').length,
      type: 'WEEK',
      icon: <ArrowRotateLeft variant='Bold' />,
      changeValue:
        (thisWeekOrders.filter((order) => order.latestStatus === 'PENDING').length -
          lastWeekOrders.filter((order) => order.latestStatus === 'PENDING').length) /
        lastWeekOrders.filter((order) => order.latestStatus === 'PENDING').length,
      iconColor: '#FF9871',
      backgroundColor: '#FFDED1',
      onClick: () => router.push(paths.dashboard.order.index as string)
    },
    {
      title: 'Tổng số khiếu nại',
      value: thisMonthReports.length,
      type: 'MONTH',
      icon: <DocumentText variant='Bold' />,
      changeValue: (thisMonthReports.length - lastMonthReports.length) / lastMonthReports.length,
      iconColor: '#4AD991',
      backgroundColor: '#D9F7E8',
      onClick: () => router.push(paths.dashboard.report.index)
    }
  ];

  useEffect(() => {
    getOrdersApi.call({});
    getListUsersApi.call({});
    getReportsApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isMobile ? (
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
                <RevenueChart orders={orders} />
              </Card>
              <Card className='p-3 w-1/2'>
                <PaymentMethodLineChart orders={orders} />
              </Card>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Card className='p-3 w-1/2'>
                <NumberOrderChart orders={orders} />
              </Card>
              <Card className='p-3 w-1/2'>
                <NumberOrderPercentageChart orders={orders} />
              </Card>
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Box className='px-4 py-3'>
          <MobileContentHeader
            title='Thống kê hệ thống'
            image={<Category2 variant='Bold' color='green' />}
          />
          <Stack mt={2} gap={1.5} sx={{ flexGrow: 1, overFlowY: 'auto' }}>
            {analysticList.map((analystic, index) => (
              <AnaLysticCard key={index} {...analystic} />
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
