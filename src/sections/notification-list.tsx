import React, { useCallback } from 'react';
import { Typography, Stack, Box, Divider, Button } from '@mui/material';
import { NotificationDetail, NotificationType } from 'src/types/notification';
import { DocumentText, Box1 } from 'iconsax-react';
import { PiMotorcycle } from 'react-icons/pi';
import { formatUnixTimestamp, formatDate } from 'src/utils/format-time-currency';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { NotificationsApi } from 'src/api/notifications';
import useFunction from 'src/hooks/use-function';

interface NotificationItemProps {
  notification: NotificationDetail;
  onNotificationRead: (notificationId: string) => void;
}

interface NotificationListProps {
  notifications: NotificationDetail[];
  onNotificationRead: (notificationId: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = (props) => {
  const router = useRouter();
  const getNotificationsApi = useFunction(NotificationsApi.getNotifications);

  const handleGoOrder = useCallback(
    async (orderId: string) => {
      await NotificationsApi.updateNotificationStatus(props.notification.id);
      props.onNotificationRead(props.notification.id);
      await getNotificationsApi.setData(
        (getNotificationsApi.data || []).map((c) =>
          c.id == props.notification.id ? Object.assign(c, { isRead: true }) : c
        )
      );
      router.push({
        pathname: paths.student.order.index,
        query: { orderId: orderId }
      });
    },
    [NotificationsApi.updateNotificationStatus, getNotificationsApi]
  );

  const handleGoReport = useCallback(
    async (reportId: string) => {
      await NotificationsApi.updateNotificationStatus(props.notification.id);
      props.onNotificationRead(props.notification.id);
      await getNotificationsApi.setData(
        (getNotificationsApi.data || []).map((c) =>
          c.id == props.notification.id ? Object.assign(c, { isRead: true }) : c
        )
      );
      router.push({
        pathname: paths.student.report.index,
        query: { reportId: reportId }
      });
    },
    [NotificationsApi.updateNotificationStatus, getNotificationsApi]
  );

  return (
    <Stack
      flexDirection='row'
      gap={3}
      alignItems={'center'}
      paddingX={2}
      paddingY={1}
      onClick={() =>
        props.notification.type === 'ORDER'
          ? handleGoOrder(props.notification.orderId as string)
          : handleGoReport(props.notification.reportId as string)
      }
    >
      {props.notification.type === 'ORDER' ? (
        <Box1 size={32} color='blue' />
      ) : props.notification.type === 'REPORT' ? (
        <DocumentText size={32} color='orange' />
      ) : (
        <PiMotorcycle size={32} color='red' />
      )}
      <Stack spacing={0.5}>
        <Typography color='black' fontWeight={'bold'}>
          {props.notification.title}
        </Typography>
        <Typography color='black' fontSize={12} fontWeight={'semibold'}>
          {props.notification.content}
        </Typography>
        <Typography fontStyle={'italic'} color='black' fontSize={12} fontWeight={'light'}>
          {formatDate(formatUnixTimestamp(props.notification.createdAt))}
        </Typography>
      </Stack>
    </Stack>
  );
};

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationRead
}) => {
  const router = useRouter();
  return (
    <Stack
      className='flex flex-col bg-gray-100 rounded-lg absolute left-[220px] top-14'
      sx={{ boxShadow: 3, zIndex: 1000 }}
    >
      {notifications.slice(0, 5).map((notification, index) => {
        return (
          <Box key={index} className='cursor-pointer'>
            <NotificationItem notification={notification} onNotificationRead={onNotificationRead} />
            <Divider sx={{ borderColor: 'black' }} />
          </Box>
        );
      })}
      <Button
        onClick={() => {
          router.push(paths.notifications.index);
        }}
      >
        Xem thêm
      </Button>
    </Stack>
  );
};

export default NotificationList;
