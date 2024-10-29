import React from 'react';
import NotificationsFilter from './notifications-filter';
import { CustomTable } from '@components';
import { Stack } from '@mui/material';
import { useNotificationsContext } from 'src/contexts/notifications/notifications-context';
import { useAuth, useFirebaseAuth } from '@hooks';
import getNotificationsTableConfig from './notifications-table-config';

function NotificationsList() {
  const { getNotificationsApi } = useNotificationsContext();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

  const notifications = React.useMemo(() => {
    return (getNotificationsApi.data || []).filter((notification) => {
      return notification.userId === user?.id || notification.userId === firebaseUser?.id;
    });
  }, [getNotificationsApi.data, user, firebaseUser]);

  const notificationsTableConfig = React.useMemo(() => {
    return getNotificationsTableConfig({});
  }, []);
  const notificationTypeList = ['Đơn hàng', 'Khiếu nại', 'Chuyến đi'];
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
  const [notificationType, setNotificationType] = React.useState(notificationTypeList[0]);
  return (
    <Stack className='flex flex-col min-h-screen bg-white px-6 py-4 text-black gap-5'>
      <NotificationsFilter
        notificationTypeList={notificationTypeList}
        numberOfNotifications={10}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <CustomTable rows={notifications} configs={notificationsTableConfig} />
    </Stack>
  );
}

export default NotificationsList;
