import React, { useEffect, useMemo, useState } from 'react';
import { Chart } from 'src/components/chart';
import { initialOrderList } from 'src/types/order';
import { AddressData } from 'src/utils/address-data';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { pieChartOptions } from 'src/utils/config-charts';
import { OrdersApi } from 'src/api/orders';
import useFunction from 'src/hooks/use-function';

const NumberOrderPercentageChart: React.FC = () => {
  const [selectedDormitory, setSelectedDormitory] = useState<string>('A');

  const getOrdersApi = useFunction(OrdersApi.getOrders);

  const orders = useMemo(() => {
    return getOrdersApi.data || [];
  }, [getOrdersApi.data]);
  const handleDormitoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedDormitory(event.target.value);
  };

  const filteredData = useMemo(
    () => orders.filter((order) => order.dormitory === selectedDormitory),
    [orders, selectedDormitory]
  );
  const buildings = AddressData.buildings[selectedDormitory as keyof typeof AddressData.buildings];
  const ordersByBuilding = buildings.map((building) => {
    return filteredData.filter((order) => order.building === building).length;
  });

  const series = ordersByBuilding;
  const labels = buildings;

  useEffect(() => {
    getOrdersApi.call({});
  }, []);
  return (
    <Box>
      <Box display='flex' justifyContent='flex-end' mb={2}>
        <FormControl variant='filled' size='small' className='w-1/5'>
          <InputLabel id='dormitory-select-label'>Chọn ký túc xá</InputLabel>
          <Select
            labelId='dormitory-select-label'
            value={selectedDormitory}
            onChange={handleDormitoryChange}
            label='Chọn ký túc xá'
          >
            {AddressData.dormitories.map((dormitory) => (
              <MenuItem key={dormitory} value={dormitory}>
                {dormitory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {filteredData && filteredData.length > 0 ? (
        <Chart options={{ ...pieChartOptions, labels }} series={series} type='pie' height={350} />
      ) : (
        <Box>Không có dữ liệu</Box>
      )}
    </Box>
  );
};

export default NumberOrderPercentageChart;
