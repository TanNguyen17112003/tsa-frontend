import React, { useCallback, useState, useMemo, useEffect } from 'react';
import OrderFilter from './order-filter';
import { Box } from '@mui/material';
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

interface OrderPaidProps {
  orders: OrderDetail[];
}

const OrderPaid: React.FC<OrderPaidProps> = ({ orders }) => {
  const router = useRouter();
  const orderStatusList = [
    'Tất cả',
    'Đã giao',
    'Đã hủy',
    'Đang giao',
    'Đã xác nhận',
    'Đang chờ xử lý',
    'Đã từ chối'
  ];
  const orderDetailReportDrawer = useDrawer<OrderDetail>();
  const orderDetailDeleteDialog = useDialog<OrderDetail>();
  const orderDetailEditDrawer = useDrawer<OrderDetail>();

  const { deleteOrder } = useOrdersContext();

  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');
  const [dateRange, setDateRange] = React.useState(() => {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    return {
      startDate: yesterday,
      endDate: oneWeekFromNow
    };
  });
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    const queryStatus = router.query.status as string;
    const queryDateRange = router.query.dateRange as string;

    if (queryStatus) {
      setSelectedStatus(queryStatus);
    }

    if (queryDateRange) {
      const [startDate, endDate] = queryDateRange.split(',').map((date) => new Date(date));
      setDateRange({ startDate, endDate });
    }
  }, [router.query.status, router.query.dateRange]);

  const handleGoReport = useCallback(
    (data: OrderDetail) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, orderId: data.id }
      });
    },
    [router]
  );

  const orderTableConfig = useMemo(() => {
    return getOrderTableConfigs({
      onClickReport: (data: OrderDetail) => {
        orderDetailReportDrawer.handleOpen(data);
      },
      onClickEdit: (data: OrderDetail) => {
        orderDetailEditDrawer.handleOpen(data);
      },
      onClickDelete: (data: OrderDetail) => {
        orderDetailDeleteDialog.handleOpen(data);
      },
      isPaid: true
    });
  }, [orderDetailReportDrawer, orderDetailDeleteDialog, orderDetailEditDrawer]);

  const result = useMemo(() => {
    return orders.filter((order) => {
      const filterStatus =
        selectedStatus === 'Tất cả'
          ? true
          : selectedStatus === 'Đã giao'
            ? order.latestStatus === 'DELIVERED'
            : selectedStatus === 'Đã hủy'
              ? order.latestStatus === 'CANCELLED'
              : selectedStatus === 'Đang giao'
                ? order.latestStatus === 'IN_TRANSPORT'
                : selectedStatus === 'Đã xác nhận'
                  ? order.latestStatus === 'ACCEPTED'
                  : selectedStatus === 'Đang chờ xử lý'
                    ? order.latestStatus === 'PENDING'
                    : selectedStatus === 'Đã từ chối'
                      ? order.latestStatus === 'REJECTED'
                      : false;
      const orderDate = formatUnixTimestamp(order.deliveryDate);
      const filterDate = dateRange.startDate <= orderDate && orderDate <= dateRange.endDate;
      const filterCheckCode = searchInput
        ? order.checkCode.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
        : true;
      return order.isPaid && filterStatus && filterDate && filterCheckCode;
    });
  }, [orders, dateRange, selectedStatus, searchInput]);

  const pagination = usePagination({
    count: result.length
  });

  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <OrderFilter
        statusList={orderStatusList}
        numberOfOrders={result.length}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSearch={setSearchInput}
      />
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
        onConfirm={() => deleteOrder([orderDetailDeleteDialog.data?.id] as string[])}
      />
      <OrderDetailEditDrawer
        open={orderDetailEditDrawer.open}
        onClose={orderDetailEditDrawer.handleClose}
        order={orderDetailEditDrawer.data}
      />
      {/* <Chat /> */}
    </Box>
  );
};

export default OrderPaid;
