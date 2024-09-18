import React, { useCallback } from 'react';
import OrderFilter from './order-filter';
import { Box } from '@mui/material';
import { OrderDetail, initialOrderList } from 'src/types/order';
import getOrderTableConfigs from './order-table-config';
import { CustomTable } from '@components';
import usePagination from 'src/hooks/use-pagination';
import { useRouter } from 'next/router';
import OrderDetailReportDrawer from './order-detail-report-drawer';
import { useDrawer } from '@hooks';

function OrderNotPaid() {
  const router = useRouter();
  const handleGoReport = useCallback((data: OrderDetail) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, orderId: data.id }
    });
  }, []);
  const orderDetailReportDrawer = useDrawer<OrderDetail>();
  const orderTableConfig = React.useMemo(() => {
    return getOrderTableConfigs({
      onClickEdit: (data: OrderDetail) => {
        orderDetailReportDrawer.handleOpen(data);
      },
      onClickRow: (data: OrderDetail) => {
        handleGoReport(data);
      }
    });
  }, []);

  const result = React.useMemo(() => {
    return initialOrderList.filter(
      (order) =>
        order.isPaid === true &&
        (router.query.status === 'all' || !router.query.status
          ? true
          : order.status.toLowerCase() === router.query.status)
    );
  }, [initialOrderList, router.query.status]);
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
}

export default OrderNotPaid;
