import React, { useCallback } from 'react';
import OrderFilter from './order-filter';
import { Box, Stack, Typography } from '@mui/material';
import { OrderDetail } from 'src/types/order';
import getOrderTableConfigs from './order-table-config';
import { CustomTable } from '@components';
import usePagination from 'src/hooks/use-pagination';
import { useRouter } from 'next/router';
import OrderDetailReportDrawer from './order-detail-report-drawer';
import { useDrawer, useDialog } from '@hooks';
import OrderDetailDeleteDialog from './order-detail-delete-dialog';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import OrderDetailEditDrawer from './order-detail-edit-drawer';

interface OrderNotPaidProps {
  orders: OrderDetail[];
}

const OrderNotPaid: React.FC<OrderNotPaidProps> = ({ orders }) => {
  const router = useRouter();
  const orderDetailReportDrawer = useDrawer<OrderDetail>();
  const orderDetailDeleteDialog = useDialog<OrderDetail>();
  const orderDetailEditDrawer = useDrawer<OrderDetail>();

  const { deleteOrder } = useOrdersContext();

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
      onClickReport: (data: OrderDetail) => {
        orderDetailReportDrawer.handleOpen(data);
      },
      onClickEdit: (data: OrderDetail) => {
        orderDetailEditDrawer.handleOpen(data);
      },
      onClickDelete: (data: OrderDetail) => {
        orderDetailDeleteDialog.handleOpen(data);
      }
    });
  }, [handleGoReport, orderDetailReportDrawer, orderDetailDeleteDialog, orderDetailEditDrawer]);

  const result = React.useMemo(() => {
    const dateRange =
      typeof router.query.dateRange === 'string' ? router.query.dateRange.split(',') : null;
    const startDate = dateRange ? new Date(dateRange[0]) : null;
    const endDate = dateRange ? new Date(dateRange[1]) : null;

    return orders.filter((order) => {
      const orderDate = new Date(formatUnixTimestamp(order.deliveryDate));
      const isWithinDateRange =
        startDate && endDate ? orderDate >= startDate && orderDate <= endDate : true;
      const isStatusMatch =
        router.query.status === 'all' || !router.query.status
          ? true
          : order.latestStatus.toLowerCase() === router.query.status;

      return !order.isPaid && isWithinDateRange && isStatusMatch;
    });
  }, [orders, router.query.status, router.query.dateRange]);

  const pagination = usePagination({
    count: result.length
  });

  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <OrderFilter numberOfOrders={result.length} />
      {/* <>{JSON.stringify(orders[0])}</> */}
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
      <OrderDetailDeleteDialog
        open={orderDetailDeleteDialog.open}
        onClose={orderDetailDeleteDialog.handleClose}
        order={orderDetailDeleteDialog.data as OrderDetail}
        onConfirm={() => deleteOrder(orderDetailDeleteDialog.data?.id as string)}
      />
      <OrderDetailEditDrawer
        open={orderDetailEditDrawer.open}
        onClose={orderDetailEditDrawer.handleClose}
        order={orderDetailEditDrawer.data}
      />
    </Box>
  );
};

export default OrderNotPaid;
