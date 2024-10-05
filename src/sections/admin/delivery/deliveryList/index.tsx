import React, { useState, useMemo, useCallback } from 'react';
import { CustomTable } from '@components';
import { Box } from '@mui/material';
import usePagination from 'src/hooks/use-pagination';
import { useRouter } from 'next/router';
import { DeliveryDetail, initialDeliveryList } from 'src/types/delivery';
import getDeliveryTableConfig from '../delivery-table-config';

function DeliveryList() {
  const router = useRouter();
  const deliveryTableConfig = useMemo(() => {
    return getDeliveryTableConfig({
      onClickDelete: (data: DeliveryDetail) => {
        console.log(data);
      },
      onClickEdit: (data: DeliveryDetail) => {
        console.log(data);
      }
    });
  }, []);

  const pagination = usePagination({
    count: initialDeliveryList.length
  });

  return (
    <Box className='px-6 text-black my-5'>
      <CustomTable
        rows={initialDeliveryList}
        configs={deliveryTableConfig}
        pagination={pagination}
      />
    </Box>
  );
}

export default DeliveryList;
