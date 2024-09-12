import React from 'react';
import OrderFilter from './order-filter';
import { Box, Stack, Typography } from '@mui/material';
import { OrderDetail, initialOrderList } from 'src/types/order';
import getOrderTableConfigs from './order-table-config';
import { CustomTable } from '@components';
import Pagination from 'src/components/ui/Pagination';
import usePagination from 'src/hooks/use-pagination';

function OrderNotPaid() {
  const orderTableConfig = React.useMemo(() => {
    return getOrderTableConfigs({
      onClick: (data: OrderDetail) => {
        console.log(data);
      }
    });
  }, []);
  const pagination = usePagination({
    count: initialOrderList.length
  });
  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <OrderFilter />
      <Box sx={{ flex: 1 }}>
        <CustomTable
          rows={initialOrderList}
          configs={orderTableConfig}
          pagination={pagination}
          className='my-5 -mx-6'
        />
      </Box>
    </Box>
  );
}

export default OrderNotPaid;
