import React from 'react';
import type { Page as PageType } from 'src/types/page';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import ContentHeader from 'src/components/content-header';
import { Box, Stack } from '@mui/material';
import AccountInfo from 'src/sections/student/account/account-info';
import AccountPassword from 'src/sections/student/account/account-password';
import { useFirebaseAuth } from '@hooks';
import { useAuth } from '@hooks';

const Page: PageType = () => {
  const { user: firebaseUser } = useFirebaseAuth();
  const { user } = useAuth();
  return (
    <Box>
      <ContentHeader title='Thông tin tài khoản' />
      <Stack spacing={2} className='p-5 bg-white min-h-screen'>
        <AccountInfo />
        <AccountPassword />
      </Stack>
    </Box>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
