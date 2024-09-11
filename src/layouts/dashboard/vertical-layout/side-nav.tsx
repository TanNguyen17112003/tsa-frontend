import { FC, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from 'src/hooks/use-auth';
import { usePathname } from 'src/hooks/use-pathname';
import { Section } from '../config/config';
import SimpleBar from 'simplebar-react';
import { SideNavSection } from './side-nav-section';
import { NavColor } from 'src/types/settings';
import { SIDE_NAV_WIDTH } from 'src/config';
// import { Button } from 'src/components/shadcn/ui/button';
import { useRouter } from 'next/router';
import { Box, Stack, Typography, Button, Avatar } from '@mui/material';
import { paths } from 'src/paths';
import { Add } from 'iconsax-react';

interface SideNavProps {
  color?: NavColor;
  sections?: Section[];
}

export const SideNav: FC<SideNavProps> = (props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { sections = [] } = props;
  const pathname = usePathname();

  return (
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
              <Stack>
                <Typography>TSA</Typography>
                <Typography className='text-xs opacity-60'>Hệ thống quản lý đơn hàng</Typography>
              </Stack>
              <Stack>
                <Button
                  variant='contained'
                  startIcon={<Add />}
                  className='!text-black !bg-white'
                  LinkComponent={Link}
                  href={paths.student.order.add}
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
              <Avatar src='' />
              <Stack>
                <Typography>Tan Nguyen</Typography>
                <Typography className='text-xs opacity-60'>Sinh viên</Typography>
              </Stack>
            </Box>
          </nav>
        </Stack>
      </Box>
    </Box>
  );
};
