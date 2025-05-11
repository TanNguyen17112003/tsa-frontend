import { useRouter } from 'next/router';
import type { Page as PageType } from 'src/types/page';
import { useAuth } from '@hooks';
import { useFirebaseAuth } from '@hooks';
import { useEffect } from 'react';

const Page: PageType = () => {
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const router = useRouter();
  useEffect(() => {
    if (user || firebaseUser) {
      if (user?.role === 'STUDENT' || firebaseUser?.role === 'STUDENT') {
        router.replace('/student/order');
      } else if (user?.role === 'STAFF' || firebaseUser?.role === 'STAFF') {
        router.replace('/staff/order');
      } else {
        router.replace('/dashboard');
      }
    } else {
      router.replace('/landing');
    }
  }, [user, firebaseUser, router]);
  return <></>;
};

export default Page;
