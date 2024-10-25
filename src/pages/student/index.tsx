import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import StudentOrderPage from 'src/pages/student/order/index';
import OrdersProvider from 'src/contexts/orders/orders-context';
import { useDialog, useFirebaseAuth } from '@hooks';
import UpdateInformationDialog, { InformationProps } from './update-information-dialog';
import React, { useCallback } from 'react';
import { UsersApi } from 'src/api/users';
import useFunction from 'src/hooks/use-function';

const Page: PageType = () => {
  const updateInformationDialog = useDialog();
  const { user: firebaseUser } = useFirebaseAuth();

  React.useEffect(() => {
    if (
      firebaseUser &&
      !firebaseUser.dormitory &&
      !firebaseUser.room &&
      !firebaseUser.building &&
      !firebaseUser.phoneNumber
    ) {
      updateInformationDialog.handleOpen();
    }
  }, [firebaseUser]);

  const handleUpdateInformation = useCallback(
    async (data: InformationProps) => {
      try {
        console.log(data);
        await UsersApi.updateProfile({
          dormitory: data.dormitory,
          building: data.building,
          room: data.room,
          phoneNumber: data.phoneNumber
        });
      } catch (error) {
        throw error;
      }
    },
    [firebaseUser]
  );

  const handleUpdateInformationHelper = useFunction(handleUpdateInformation, {
    successMessage: 'Cập nhật thông tin thành công!'
  });

  return (
    <>
      <StudentOrderPage />
      <UpdateInformationDialog
        open={updateInformationDialog.open}
        onClose={updateInformationDialog.handleClose}
        onSubmit={handleUpdateInformationHelper.call}
      />
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <OrdersProvider>{page}</OrdersProvider>
  </DashboardLayout>
);

export default Page;
