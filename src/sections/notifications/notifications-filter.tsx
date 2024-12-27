import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import AdvancedFilter from 'src/components/advanced-filter/advanced-filter';

interface NotificationsFilterProps {
  notificationTypeList: string[];
  numberOfNotifications: number;
  notificationType: string;
  setNotificationType: (notificationType: string) => void;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  setDateRange: (range: any) => void;
}

const NotificationsFilter: React.FC<NotificationsFilterProps> = (props) => {
  const handleDateChange = React.useCallback((range: any) => {
    props.setDateRange(range);
  }, []);

  const handleNotificationTypeChange = React.useCallback((notificationType: string) => {
    props.setNotificationType(notificationType);
  }, []);

  const filters = React.useMemo(() => {
    return [
      {
        type: 'select' as const,
        title: 'Loại thông báo',
        value: props.notificationType,
        onChange: handleNotificationTypeChange,
        options: props.notificationTypeList.map((type) => ({
          label: type,
          value: type
        }))
      },
      {
        type: 'dateRange' as const,
        title: 'Chọn thời gian thông báo',
        value: props.dateRange,
        onChange: handleDateChange
      }
    ];
  }, []);

  return (
    <Box className='flex gap-2 items-center w-full justify-between'>
      <Stack direction='row' spacing={1}>
        <Typography fontWeight={'bold'}>Số lượng thông báo:</Typography>
        <Typography fontWeight={'bold'}>{props.numberOfNotifications}</Typography>
      </Stack>
      <AdvancedFilter filters={filters} />
    </Box>
  );
};

export default NotificationsFilter;
