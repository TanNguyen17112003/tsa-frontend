import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { CustomTable } from 'src/components/custom-table';
import { Input } from 'src/components/shadcn/ui/input';
import Pagination from 'src/components/ui/Pagination';
import UsersProvider, { useUsersContext } from 'src/contexts/users/users-context';
import { AuthGuard } from 'src/guards/auth-guard';
import { useAuth } from 'src/hooks/use-auth';
import { useDrawer } from 'src/hooks/use-drawer';
import usePagination from 'src/hooks/use-pagination';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
// import AccountsDeleteDialog from 'src/sections/admin/accounts/AccountsDeleteDialog';
// import getAccountTableConfig from 'src/sections/admin/accounts/account-table-config';
import type { Page as PageType } from 'src/types/page';
import { User } from 'src/types/user';
import getPaginationText from 'src/utils/get-pagination-text';

const Page: PageType = () => {
  return <></>;
};

Page.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      <UsersProvider>{page}</UsersProvider>
    </DashboardLayout>
  </AuthGuard>
);

export default Page;
