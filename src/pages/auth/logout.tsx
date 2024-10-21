import { useEffect } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { useFirebaseAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';

const Page: PageType = () => {
  const { signOut } = useAuth();
  const { signOut: firebaseSignOut } = useFirebaseAuth();
  useEffect(() => {
    const logout = async () => {
      await signOut();
      await firebaseSignOut();
    };
    logout();
  }, [signOut, firebaseSignOut]);
  return <></>;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
