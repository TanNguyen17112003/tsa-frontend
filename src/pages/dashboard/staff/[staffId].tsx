import { ArrowBack } from '@mui/icons-material';
import { Box, Typography, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Page as PageType } from 'src/types/page';
import StaffDetailInformation from 'src/sections/admin/staff/staff-detail/staff-detail-information';
import StaffDetailOrderRevenueChart from 'src/sections/admin/staff/staff-detail/staff-detail-order-revenue-chart';
import StaffDetailHeatChart from 'src/sections/admin/staff/staff-detail/staff-detail-heat-chart';
import StaffDetailOrderChart from 'src/sections/admin/staff/staff-detail/staff-detail-order-chart';
import StaffDetailPaymentChart from 'src/sections/admin/staff/staff-detail/staff-detail-payment-chart';
import AnaLysticCard, { AnaLysticCardProps } from 'src/sections/admin/analystic-card';
import { Box1 } from 'iconsax-react';
import { PiMotorcycle } from 'react-icons/pi';
import { DeliveriesApi } from 'src/api/deliveries';
import { OrdersApi } from 'src/api/orders';
import useFunction from 'src/hooks/use-function';
import { useEffect, useMemo } from 'react';
import { useUsersContext } from '@contexts';
import { UserDetail } from 'src/types/user';
import { useResponsive } from 'src/utils/use-responsive';
import StaffDetailDeliveryRadialChart from 'src/sections/admin/staff/staff-detail/staff-detail-delivery-radial-chart';

const Page: PageType = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const getDeliveriesApi = useFunction(DeliveriesApi.getDeliveries);
  const getOrdersApi = useFunction(OrdersApi.getOrders);
  const { getListUsersApi } = useUsersContext();

  const detailStaff = useMemo(() => {
    return (getListUsersApi.data || []).find((user) => user.id === router.query.staffId);
  }, [getListUsersApi.data, router.query.staffId]);

  const orders = useMemo(() => {
    return (getOrdersApi.data || []).filter((order) => order.shipperId === router.query.staffId);
  }, [getOrdersApi.data]);

  const deliveries = useMemo(() => {
    return (getDeliveriesApi.data || []).filter(
      (delivery) => delivery.staffId === router.query.staffId
    );
  }, [getDeliveriesApi.data]);

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

    return orders.filter((order) => {
      const orderDate = new Date(order.deliveryDate);
      return orderDate >= lastMonday && orderDate <= lastSunday;
    });
  }, [orders]);

  const thisWeekDeliveries = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return deliveries.filter((delivery) => {
      const deliveryDate = delivery.deliveryAt ? new Date(delivery.deliveryAt) : new Date();
      return deliveryDate >= monday && deliveryDate <= now;
    });
  }, [deliveries]);

  const lastWeekDeliveries = useMemo(() => {
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

    return deliveries.filter((delivery) => {
      const deliveryDate = delivery.deliveryAt ? new Date(delivery.deliveryAt) : new Date();
      return deliveryDate >= lastMonday && deliveryDate <= lastSunday;
    });
  }, [deliveries]);

  const mockAnalysticData: AnaLysticCardProps[] = useMemo(
    () => [
      {
        title: 'Tổng số đơn hàng',
        value: thisWeekOrders.length,
        changeValue: (thisWeekOrders.length - lastWeekOrders.length) / lastWeekOrders.length,
        type: 'WEEK',
        icon: <Box1 variant='Bold' />,
        iconColor: '#FEC53D',
        backgroundColor: '#FFF3D6'
      },
      {
        title: 'Tổng số chuyến đi',
        value: thisWeekDeliveries.length,
        changeValue:
          (thisWeekDeliveries.length - lastWeekDeliveries.length) / lastWeekDeliveries.length,
        type: 'WEEK',
        icon: <PiMotorcycle fontVariant={'bold'} />,
        iconColor: '#4AD991',
        backgroundColor: '#D9F7E8'
      }
    ],
    [thisWeekOrders, lastWeekOrders, thisWeekDeliveries, lastWeekDeliveries]
  );

  useEffect(() => {
    getDeliveriesApi.call({});
    getOrdersApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <Typography variant={isMobile ? 'body1' : 'h5'} fontWeight={'bold'}>
                Chi tiết nhân viên {detailStaff?.lastName} {detailStaff?.firstName}
              </Typography>
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
          <Grid item xs={isMobile ? 12 : 4}>
            <Stack className='h-full'>
              <StaffDetailInformation info={detailStaff as UserDetail} />
            </Stack>
          </Grid>
          {!isMobile && (
            <>
              <Grid item xs={4}>
                <Stack className='h-full'>
                  <StaffDetailDeliveryRadialChart deliveries={deliveries} />
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack className='h-full'>
                  <StaffDetailPaymentChart orders={orders} />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack className='h-full'>
                  <StaffDetailHeatChart orders={orders} />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack className='h-full'>
                  <StaffDetailOrderRevenueChart orders={orders} />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack className='h-full'>
                  <StaffDetailOrderChart orders={orders} />
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
