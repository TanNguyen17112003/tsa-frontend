'use client';
import Link from 'next/link';
import { Button } from '@/components/shadcn/ui/button';
import { paths } from '@/paths';
const AuthButton = () => {
  return (
    <Link href={paths.auth.login}>
      <Button variant={'default'}>Đăng nhập</Button>
    </Link>
  );
};

export default AuthButton;
