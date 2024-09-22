import React, { useCallback } from 'react';
import OrderFilter from './order-filter';
import { Box, Stack, Typography } from '@mui/material';
import { OrderDetail, initialOrderList } from 'src/types/order';
import getOrderTableConfigs from './order-table-config';
import { CustomTable } from '@components';
import usePagination from 'src/hooks/use-pagination';
import { useRouter } from 'next/router';
import OrderDetailReportDrawer from './order-detail-report-drawer';
import { useDrawer } from '@hooks';

interface OrderNotPaidProps {
  orders: OrderDetail[];
}

const OrderNotPaid: React.FC<OrderNotPaidProps> = ({ orders }) => {
  const router = useRouter();
  const orderDetailReportDrawer = useDrawer<OrderDetail>();

  const handleGoReport = useCallback(
    (data: OrderDetail) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, orderId: data.id }
      });
    },
    [router]
  );

  const orderTableConfig = React.useMemo(() => {
    return getOrderTableConfigs({
      onClickEdit: (data: OrderDetail) => {
        orderDetailReportDrawer.handleOpen(data);
      },
      onClickRow: (data: OrderDetail) => {
        handleGoReport(data);
      }
    });
  }, [handleGoReport, orderDetailReportDrawer]);

  const result = React.useMemo(() => {
    const dateRange =
      typeof router.query.dateRange === 'string' ? router.query.dateRange.split(',') : null;
    const startDate = dateRange ? new Date(dateRange[0]) : null;
    const endDate = dateRange ? new Date(dateRange[1]) : null;

    return orders.filter((order) => {
      const orderDate = new Date(order.deliveryDate);
      const isWithinDateRange =
        startDate && endDate ? orderDate >= startDate && orderDate <= endDate : true;
      const isStatusMatch =
        router.query.status === 'all' || !router.query.status
          ? true
          : order.status.toLowerCase() === router.query.status;

      return !order.isPaid && isWithinDateRange && isStatusMatch;
    });
  }, [orders, router.query.status, router.query.dateRange]);

  const pagination = usePagination({
    count: result.length
  });

  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <OrderFilter numberOfOrders={result.length} />
      <Box sx={{ flex: 1 }}>
        <CustomTable
          rows={result}
          configs={orderTableConfig}
          pagination={pagination}
          className='my-5 -mx-6'
          onClickRow={(data) => handleGoReport(data)}
        />
      </Box>
      <OrderDetailReportDrawer
        open={orderDetailReportDrawer.open}
        onClose={orderDetailReportDrawer.handleClose}
        order={orderDetailReportDrawer.data}
      />
    </Box>
  );
};

export default OrderNotPaid;
