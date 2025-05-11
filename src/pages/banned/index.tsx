import React, { useMemo } from 'react';
import type { Page as PageType } from 'src/types/page';
import { Box, Button, Stack, Typography } from '@mui/material';
import ReportsProvider from 'src/contexts/reports/reports-context';
import MobileReportList from 'src/sections/mobile/admin/report/report-list';
import Image from 'next/image';
import bannedImage from 'public/ui/banned-page.png';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { useDialog } from '@hooks';
import MapDialog from 'src/sections/banned/map-dialog';
import { useAuth } from '@hooks';

const Page: PageType = () => {
  const router = useRouter();
  const mapDialog = useDialog();
  const { user } = useAuth();

  return (
    <Box className='flex flex-col lg:flex-row bg-[#fefefe] items-center justify-center lg:justify-start h-screen '>
      <Stack className='lg:w-[50%]' paddingX={3} spacing={3}>
        <Typography fontWeight={'bold'} fontSize={32}>
          Tài khoản đã bị vô hiệu hóa
        </Typography>
        <Typography>
          Bạn đã vi phạm vươt quá số lần cho phép của hệ thống khi sử dụng dịch vụ. Tài khoản của
          bạn đã bị khóa.Hãy sử dụng hệ thống ticket để phản hồi nếu bạn cho đây là một nhầm lẫn
          hoặc liên hệ trực tiếp dưới văn phòng A8, Kí túc xá khu A
        </Typography>
        <Box display={'flex'} gap={2} marginTop={3}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => router.push(paths.tickets.index)}
          >
            Đi tới trung tâm hỗ trợ
          </Button>
          <Button
            variant='contained'
            color='warning'
            onClick={() => {
              mapDialog.handleOpen();
            }}
          >
            Theo dõi bản đồ địa chỉ tòa A8
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              router.push(paths.auth.logout);
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Stack>
      <Stack className='w-[60%]' alignItems={'center'}>
        <Image src={bannedImage} alt='banned' className='w-[60%] object-cover' />
      </Stack>
      <MapDialog
        open={mapDialog.open}
        onClose={mapDialog.handleClose}
        latitude={10.87859824523083}
        longitude={106.80673845127043}
      />
    </Box>
  );
};
Page.getLayout = (page) => <ReportsProvider>{page}</ReportsProvider>;

export default Page;
