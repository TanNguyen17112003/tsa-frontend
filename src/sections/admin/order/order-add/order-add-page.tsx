import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Container, Stack } from '@mui/system';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { useAuth } from 'src/hooks/use-auth';
import { useFirebaseAuth } from 'src/hooks/use-auth';
import useFunction from 'src/hooks/use-function';
import { paths } from 'src/paths';
import { OrderForm } from './order-form';
import OrderUploadSection from './order-upload-section';
import { OrderFormProps } from 'src/api/orders';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { adminInitialOrderForm } from 'src/types/order';

const OrderAddPage = () => {
  const [resetUploadSection, setResetUploadSection] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [orderList, setOrderList] = useState<OrderFormProps[]>([]);
  const router = useRouter();
  const { showSnackbarError, showSnackbarSuccess } = useAppSnackbar();
  const { getOrdersApi, createOrder } = useOrdersContext();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

  const formik = useFormik<OrderFormProps>({
    initialValues: adminInitialOrderForm,
    onSubmit: async (values) => {
      await handleSubmitOrderHelper.call(values);
    }
  });

  const handleSubmitOrder = useCallback(
    async (values: OrderFormProps) => {
      try {
        if (orderList && orderList.length > 0) {
          await createOrder(
            orderList.map((order) => ({
              ...order
            }))
          );
        } else {
          await createOrder([
            {
              ...values
            }
          ]);
        }
        showSnackbarSuccess('Tạo đơn hàng thành công!');
      } catch (error) {
        throw error;
      }
    },
    [
      createOrder,
      showSnackbarError,
      showSnackbarSuccess,
      orderList,
      user?.id,
      firebaseUser?.id,
      formik
    ]
  );

  const handleSubmitOrderHelper = useFunction(handleSubmitOrder);

  return (
    <Box className='text-black bg-white'>
      <Stack className='py-4 space-y-2'>
        <Stack p={3}>
          <Box>
            <Button
              size='small'
              className='text-xs opacity-60'
              startIcon={<ArrowBack />}
              color='inherit'
              onClick={() => {
                router.push(paths.dashboard.order.index);
              }}
            >
              Quay lại
            </Button>
          </Box>
          <Stack justifyContent='space-between' direction='row' alignItems='center'>
            <Typography variant='h5'>Thêm đơn hàng</Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant='contained'
                onClick={() => formik.handleSubmit()}
                className='bg-green-500 hover:bg-green-400'
                disabled={
                  orderList.length === 0 &&
                  (!formik.values.checkCode ||
                    !formik.values.product ||
                    !formik.values.weight ||
                    !formik.values.brand)
                }
              >
                Thêm
              </Button>
            </div>
          </Stack>
        </Stack>
        <Stack p={3} gap={2}>
          <>
            <OrderForm formik={formik} title='1. Nhập thông tin đơn hàng' status={true} />
            <Stack gap={2}>
              <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
                2. Tải lên danh sách đơn hàng
              </Typography>
              <OrderUploadSection
                onUpload={setOrderList}
                direction='row'
                key={resetUploadSection}
                handleUpload={setIsUploaded}
              />
            </Stack>
          </>
        </Stack>
      </Stack>
    </Box>
  );
};

export default OrderAddPage;
