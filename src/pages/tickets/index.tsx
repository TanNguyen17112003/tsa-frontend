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

const tabs = [
  {
    label: 'Các câu hỏi/yêu cầu',
    key: 'question list'
  },
  {
    label: 'Tạo câu hỏi/yêu cầu',
    key: 'add question'
  }
];

const Page: PageType = () => {
  const [tab, setTab] = useState(tabs[0].key);
  const router = useRouter();

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
          title='Trung tâm tư vấn'
          description='Quản lý câu hỏi và yêu cầu của sinh viên về những dịch vụ khi sử dụng hệ thống TSA'
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
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  label={tab.label}
                  value={tab.key}
                  onClick={() => {
                    if (tab.key === 'question list') {
                      router.push(paths.tickets.index);
                    }
                  }}
                />
              ))}
            </Tabs>
          }
        />
        <Box paddingX={2} paddingY={3}>
          {tab === tabs[0].key && <TicketManagement />}
          {tab === tabs[1].key && <TicketAdd />}
        </Box>
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <TicketsProvider>{page}</TicketsProvider>
  </DashboardLayout>
);

export default Page;
