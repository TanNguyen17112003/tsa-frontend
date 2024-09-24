'use client';
import Link from 'next/link';
import { Button } from '@components';
import { paths } from 'src/paths';
import { Box } from '@mui/material';
const AuthButton = () => {
  return (
    <Box display={'flex'} gap={1}>
      <Link href={paths.auth.register.index}>
        <Button variant={'outline'} color='white' className='rounded-lg bg-white border-slate-300'>
          Đăng ký
        </Button>
      </Link>
      <Link href={paths.auth.login}>
        <Button variant={'default'} className='rounded-lg'>
          Đăng nhập
        </Button>
      </Link>
    </Box>
  );
};

export default AuthButton;
