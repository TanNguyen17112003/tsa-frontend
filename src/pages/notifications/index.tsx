import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import { useDialog, useFirebaseAuth, useAuth } from '@hooks';
import React, { useCallback } from 'react';
import NotificationsProvider from 'src/contexts/notifications/notifications-context';
import useFunction from 'src/hooks/use-function';
import NotificationsList from 'src/sections/notifications/notifications-list';
import ContentHeader from 'src/components/content-header';
import { Box } from '@mui/material';

const Page: PageType = () => {
  const updateInformationDialog = useDialog();
  const { user: firebaseUser } = useFirebaseAuth();
  const { user } = useAuth();

  return (
    <Box>
      <ContentHeader title='Lịch sử thông báo' description='Danh sách thông báo của bạn' />
      <NotificationsList />
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <NotificationsProvider>{page}</NotificationsProvider>
  </DashboardLayout>
);

export default Page;
