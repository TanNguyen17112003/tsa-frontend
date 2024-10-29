import { FC, useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from 'src/hooks/use-auth';
import { useFirebaseAuth } from 'src/hooks/use-auth';
import { usePathname } from 'src/hooks/use-pathname';
import { Section } from '../config/config';
import SimpleBar from 'simplebar-react';
import { SideNavSection } from './side-nav-section';
import { NavColor } from 'src/types/settings';
import { SIDE_NAV_WIDTH } from 'src/config';
import { useRouter } from 'next/router';
import { Box, Stack, Typography, Button, Avatar, Tooltip, Badge } from '@mui/material';
import { paths } from 'src/paths';
import { Add } from 'iconsax-react';
import { Bell } from 'lucide-react';
import { NotificationsApi } from 'src/api/notifications';
import useFunction from 'src/hooks/use-function';
import { NotificationDetail } from 'src/types/notification';
import NotificationList from 'src/sections/notification-list';

interface SideNavProps {
  color?: NavColor;
  sections?: Section[];
}

export const SideNav: FC<SideNavProps> = (props) => {
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const { sections = [] } = props;
  const pathname = usePathname();
  const [isNotificationListOpen, setIsNotificationListOpen] = useState(false);

  const getNotificationsApi = useFunction(NotificationsApi.getNotifications);
  const notifications = useMemo(() => {
    return (getNotificationsApi.data || []).filter((notification: NotificationDetail) => {
      return (
        (notification.userId === user?.id || notification.userId === firebaseUser?.id) &&
        !notification.isRead
      );
    });
  }, [getNotificationsApi.data, user, firebaseUser]);

  useEffect(() => {
    if (user || firebaseUser) {
      getNotificationsApi.call({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firebaseUser]);

  const notificationCount = notifications.length > 9 ? '9+' : notifications.length;

  const toggleNotificationList = () => {
    setIsNotificationListOpen(!isNotificationListOpen);
  };

  const handleNotificationRead = useCallback(
    (notificationId: string) => {
      getNotificationsApi.setData(
        (getNotificationsApi.data || []).map((c) =>
          c.id === notificationId ? { ...c, isRead: true } : c
        )
      );
    },
    [getNotificationsApi]
  );

  return (
    <Box>
      <Box
        className='fixed inset-0 z-50 h-screen text-white bg-[#34A853] overflow-hidden border-r border-solid border-background-other-Boxider shadow-lg'
        style={{ width: SIDE_NAV_WIDTH }}
      >
        <Box
          className='flex flex-col w-full bg-gray-900  h-full'
          style={{
            backgroundColor: 'var(--nav-bg)',
            color: 'var(--nav-color)'
          }}
        >
          <Stack className='flex-1'>
            <nav className='flex flex-col justify-between space-y-5 px-5 py-3 h-full'>
              <Box className='flex flex-col space-y-5'>
                <Box className='flex justify-between items-center relative'>
                  <Stack>
                    <Typography>TSA</Typography>
                    <Typography className='text-[14px] opacity-60'>
                      Hệ thống quản lý đơn hàng
                    </Typography>
                  </Stack>
                  {(user?.role === 'STUDENT' || firebaseUser?.role === 'STUDENT') && (
                    <Tooltip title='Thông báo' className='cursor-pointer'>
                      <Badge
                        badgeContent={notificationCount}
                        color='error'
                        overlap='circular'
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        onClick={toggleNotificationList}
                      >
                        <Bell fontVariant={'bold'} />
                      </Badge>
                    </Tooltip>
                  )}
                </Box>
                <Stack>
                  <Button
                    variant='contained'
                    startIcon={<Add />}
                    className='!text-black !bg-white'
                    LinkComponent={Link}
                    href={
                      user?.role === 'STUDENT' || firebaseUser?.role === 'STUDENT'
                        ? paths.student.order.add
                        : paths.dashboard.order.add
                    }
                  >
                    Thêm đơn hàng
                  </Button>
                </Stack>
                {sections.map((section, index) => (
                  <SideNavSection
                    items={section.items}
                    key={index}
                    pathname={pathname}
                    subheader={section.subheader}
                  />
                ))}
              </Box>
              <Box className='flex gap-2 items-center'>
                <Avatar src={user?.photoUrl || firebaseUser?.photoUrl || ''} />
                <Stack>
                  {user && !firebaseUser && (
                    <Typography>
                      {user?.lastName} {user?.firstName}
                    </Typography>
                  )}
                  {firebaseUser && (
                    <Typography>
                      {firebaseUser?.lastName} {firebaseUser?.firstName}
                    </Typography>
                  )}

                  {user && !firebaseUser && (
                    <Typography className='text-xs opacity-60'>
                      {user?.role === 'STUDENT'
                        ? 'Sinh viên'
                        : user?.role === 'STAFF'
                          ? 'Nhân viên'
                          : 'Quản trị viên'}
                    </Typography>
                  )}
                  {firebaseUser && (
                    <Typography className='text-xs opacity-60'>
                      {firebaseUser?.role === 'STUDENT'
                        ? 'Sinh viên'
                        : firebaseUser?.role === 'STAFF'
                          ? 'Nhân viên'
                          : 'Quản trị viên'}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </nav>
          </Stack>
        </Box>
      </Box>
      {isNotificationListOpen && (
        <NotificationList
          notifications={notifications}
          onNotificationRead={handleNotificationRead}
        />
      )}
    </Box>
  );
};
