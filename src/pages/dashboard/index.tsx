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
import { TicketsApi } from 'src/api/tickets';
import useFunction from 'src/hooks/use-function';
import { useEffect, useMemo, useState } from 'react';
import { formatVNDcurrency } from 'src/utils/format-time-currency';
import { useResponsive } from 'src/utils/use-responsive';
import MobileContentHeader from 'src/components/mobile-content-header';
import LoadingProcess from 'src/components/LoadingProcess';
import { useFormContext } from 'react-hook-form';

const Page: PageType = () => {
  const router = useRouter();
  const getListUsersApi = useFunction(UsersApi.getUsers);
  const getReportsApi = useFunction(ReportsApi.getReports);
  const getOrdersApi = useFunction(OrdersApi.getOrders);
  const getTicketsApi = useFunction(TicketsApi.getListTicket);

  const { isMobile } = useResponsive();

  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const pageSize = 10;
        const firstPage = await getOrdersApi.call({ page: 1, size: pageSize });
        const totalElements = firstPage?.data?.totalElements || 0;
        const totalPages = Math.ceil(totalElements / pageSize);

        let totalOrders = [...(firstPage?.data?.results || [])];

        if (totalPages > 1) {
          const promises = [];
          for (let page = 2; page <= totalPages; page++) {
            promises.push(getOrdersApi.call({ page, size: pageSize }));
          }
          const results = await Promise.all(promises);
          results.forEach((res) => {
            totalOrders = [...totalOrders, ...(res.data?.results || [])];
          });
        }

        setAllOrders(totalOrders);
      } catch (e) {
        setAllOrders([]);
        throw e;
      }
    };

    fetchAllOrders();
    getListUsersApi.call({});
    getTicketsApi.call({});
    getReportsApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const users = useMemo(() => {
    return (getListUsersApi.data || []).filter((user) => user.role === 'STUDENT');
  }, [getListUsersApi.data]);
  const orders = useMemo(() => {
    return allOrders;
  }, [allOrders]);
  const reports = useMemo(() => {
    return getReportsApi.data?.results || [];
  }, [getReportsApi.data]);

  const tickets = useMemo(() => {
    return getTicketsApi.data || [];
  }, [getTicketsApi.data]);

  const revenue = useMemo(() => {
    const totalRevenue = orders.reduce((total, order) => {
      return total + order.shippingFee;
    }, 0);
    return totalRevenue;
  }, [orders]);

  const analysticList: AnaLysticCardProps[] = [
    {
      title: 'Số người dùng',
      value: users.length,
      icon: <Profile2User variant='Bold' />,
      iconColor: '#8280FF',
      backgroundColor: '#E5E4FF',
      onClick: () => router.push(paths.dashboard.student.index as string)
    },
    {
      title: 'Tổng số đơn hàng',
      value: orders.length,
      icon: <Box1 variant='Bold' />,
      iconColor: '#FEC53D',
      backgroundColor: '#FFF3D6',
      onClick: () => router.push(paths.dashboard.order.index as string)
    },
    {
      title: 'Tổng doanh thu',
      value: formatVNDcurrency(revenue),
      icon: <Diagram variant='Bold' />,
      iconColor: '#4AD991',
      backgroundColor: '#D9F7E8',
      onClick: () => router.push(paths.dashboard.delivery.index as string)
    },
    {
      title: 'Số lượng ticket',
      value: tickets.length,
      icon: <ArrowRotateLeft variant='Bold' />,
      iconColor: '#FF9871',
      backgroundColor: '#FFDED1',
      onClick: () => router.push(paths.tickets.index as string)
    },
    {
      title: 'Tổng số khiếu nại',
      value: getReportsApi.data?.totalElements || 0,
      icon: <DocumentText variant='Bold' />,
      iconColor: '#4AD991',
      backgroundColor: '#D9F7E8',
      onClick: () => router.push(paths.dashboard.report.index)
    }
  ];

  return (
    <>
      {!isMobile ? (
        <Stack className='min-h-screen bg-white'>
          <ContentHeader title='Thống kê' />
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
      {(getOrdersApi.loading ||
        getListUsersApi.loading ||
        getReportsApi.loading ||
        getTicketsApi.loading) && <LoadingProcess />}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
