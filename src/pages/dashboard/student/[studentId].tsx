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
import { useUsersContext } from '@contexts';
import { ReportsApi } from 'src/api/reports';
import { OrdersApi } from 'src/api/orders';
import useFunction from 'src/hooks/use-function';
import { useEffect, useMemo } from 'react';
import { UserDetail } from 'src/types/user';

const Page: PageType = () => {
  const router = useRouter();
  const getReportsApi = useFunction(ReportsApi.getReports);
  const getOrdersApi = useFunction(OrdersApi.getOrders);
  const { getListUsersApi } = useUsersContext();

  const orders = useMemo(() => {
    return (getOrdersApi.data || []).filter((order) => order.shipperId === router.query.staffId);
  }, [getOrdersApi.data]);

  const reports = useMemo(() => {
    return (getReportsApi.data || []).filter(
      (report) => report.studentId === router.query.studentId
    );
  }, [getReportsApi.data]);

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

  const thisMonthReports = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return reports.filter((report) => {
      const reportedAt = new Date(Number(report.reportedAt) * 1000);
      return reportedAt >= startOfMonth && reportedAt <= endOfMonth;
    });
  }, [reports]);

  const lastMonthReports = useMemo(() => {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return reports.filter((report) => {
      const reportedAt = new Date(Number(report.reportedAt) * 1000);
      return reportedAt >= startOfLastMonth && reportedAt <= endOfLastMonth;
    });
  }, [reports]);

  const detailStudent = useMemo(() => {
    return (getListUsersApi.data || []).find((user) => user.id === router.query.studentId);
  }, [getListUsersApi.data, router.query.studentId]);

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
        title: 'Tổng số khiếu nại',
        value: thisMonthReports.length,
        changeValue: (thisMonthReports.length - lastMonthReports.length) / lastMonthReports.length,
        type: 'MONTH',
        icon: <DocumentText variant='Bold' />,
        iconColor: '#4AD991',
        backgroundColor: '#D9F7E8'
      }
    ],
    [thisWeekOrders, lastWeekOrders, thisMonthReports, lastMonthReports]
  );

  useEffect(() => {
    getReportsApi.call({});
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
              <StudentDetailInformation info={detailStudent as UserDetail} />
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Stack className='h-full'>
              <StudentDetailOrderChart orders={orders} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack className='h-full'>
              <StudentDetailHeatChart orders={orders} />
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack className='h-full'>
              <StudentDetailPaymentChart orders={orders} />
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Stack className='h-full'>
              <StudentDetailExpenseChart orders={orders} />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
