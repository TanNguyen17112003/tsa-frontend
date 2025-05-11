import React from 'react';
import NotificationsFilter from './notifications-filter';
import { CustomTable } from '@components';
import { Stack, CircularProgress } from '@mui/material';
import { useNotificationsContext } from 'src/contexts/notifications/notifications-context';
import { useAuth, useFirebaseAuth } from '@hooks';
import getNotificationsTableConfig from './notifications-table-config';
import usePagination from 'src/hooks/use-pagination';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import LoadingProcess from 'src/components/LoadingProcess';

function NotificationsList() {
  const { getNotificationsApi } = useNotificationsContext();
  const notificationTypeList = ['Tất cả', 'Đơn hàng', 'Khiếu nại', 'Chuyến đi'];
  const [notificationType, setNotificationType] = React.useState(notificationTypeList[0]);
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

  const notifications = React.useMemo(() => {
    return getNotificationsApi.data?.notifications || [];
  }, [getNotificationsApi.data, user, firebaseUser]);

  const notificationsTableConfig = React.useMemo(() => {
    return getNotificationsTableConfig({});
  }, []);
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

  const filteredNotifications = React.useMemo(() => {
    return notifications?.filter((notification) => {
      const filterNotification =
        notificationType === 'Tất cả' || notificationType === ''
          ? true
          : notificationType === 'Đơn hàng'
            ? notification.type === 'ORDER'
            : notificationType === 'Khiếu nại'
              ? notification.type === 'REPORT'
              : notificationType === 'Chuyến đi'
                ? notification.type === 'DELIVERY'
                : false;
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate && dateRange.endDate
            ? dateRange.startDate <= formatUnixTimestamp(notification.createdAt) &&
              formatUnixTimestamp(notification.createdAt) <= dateRange.endDate
            : true;
      return filterNotification && filterDate;
    });
  }, [notifications, dateRange, notificationType]);

  const notificationPagination = usePagination({
    count: filteredNotifications.length
  });
  return (
    <Stack className='flex flex-col min-h-screen bg-white px-6 py-4 text-black gap-5'>
      <NotificationsFilter
        notificationTypeList={notificationTypeList}
        numberOfNotifications={filteredNotifications.length}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      {getNotificationsApi.loading ? (
        <LoadingProcess />
      ) : (
        <CustomTable
          rows={filteredNotifications}
          configs={notificationsTableConfig}
          pagination={notificationPagination}
        />
      )}
    </Stack>
  );
}

export default NotificationsList;
