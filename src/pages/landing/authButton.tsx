'use client';
import Link from 'next/link';
import { Button } from '@components';
import { paths } from 'src/paths';
const AuthButton = () => {
  return (
    <Link href={paths.auth.login}>
      <Button variant={'default'}>Đăng nhập</Button>
    </Link>
  );
};

export default AuthButton;
