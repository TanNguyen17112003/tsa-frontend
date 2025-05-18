import { Box, Tab, Tabs } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import { useState } from 'react';
import { Stack } from '@mui/system';
import ContentHeader from 'src/components/content-header';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '@hooks';
import TicketManagement from 'src/sections/tickets/ticket-management';
import TicketAdd from 'src/sections/tickets/ticket-add';
import TicketsProvider from 'src/contexts/tickets/tickets-context';
import { paths } from 'src/paths';
import { useAuth } from '@hooks';
import Regulation from 'src/sections/regulations/regulation';
import RegulationsProvider from 'src/contexts/regulations/regulations-context';

const tabs = [
  {
    label: 'KTX Khu A',
    key: 'A'
  },
  {
    label: 'KTX Khu B',
    key: 'B'
  }
];

const Page: PageType = () => {
  const [tab, setTab] = useState(tabs[0].key);
  const router = useRouter();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

  return (
    <Box className='bg-white'>
      <Stack
        sx={{
          maxHeight: '100vh',
          overflow: 'auto',
          bgcolor: 'white'
        }}
        className='min-h-screen'
      >
        <ContentHeader
          title='Cài đặt các quy định của hệ thống'
          description='Các quy định về số lượng vi phạm tối đa và khung thời gian hoạt động của việc giao nhận đơn hàng'
          tabs={
            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'green'
                },
                '& .MuiTab-root': {
                  color: 'green',
                  '&.Mui-selected': {
                    color: 'green'
                  }
                }
              }}
            >
              {tabs.map((tab) => {
                return <Tab key={tab.key} label={tab.label} value={tab.key} />;
              })}
            </Tabs>
          }
        />
        <Box paddingX={2} paddingY={3}>
          {tab === tabs[0].key && <Regulation dormitoryName='A' />}
          {tab === tabs[1].key && <Regulation dormitoryName='B' />}
        </Box>
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <RegulationsProvider>{page}</RegulationsProvider>
  </DashboardLayout>
);

export default Page;
