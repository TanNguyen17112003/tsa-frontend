import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
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
import { initialOrderForm } from 'src/types/order';

const OrderAddPage = () => {
  const [resetUploadSection, setResetUploadSection] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [orderList, setOrderList] = useState<OrderFormProps[]>([]);
  const router = useRouter();
  const { showSnackbarError, showSnackbarSuccess } = useAppSnackbar();
  const { getOrdersApi, createOrder } = useOrdersContext();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

  const formik = useFormik<OrderFormProps>({
    initialValues: initialOrderForm,
    onSubmit: async (values) => {
      try {
        await handleSubmitOrderHelper.call(values);
      } catch {
        showSnackbarError('Có lỗi xảy ra');
      }
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
          console.log(formik.values.deliveryDate);
          await createOrder([
            {
              ...values,
              deliveryDate: formik.values.deliveryDate
            }
          ]);
        }
        showSnackbarSuccess('Tạo đơn hàng thành công!');
      } catch (error) {
        showSnackbarError('Có lỗi xảy ra');
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
        <Stack p={isMobile ? 2 : 3}>
          <Box>
            <Button
              size='small'
              className='text-xs opacity-60'
              startIcon={<ArrowBack />}
              color='inherit'
              onClick={() => {
                router.push(paths.student.order.index);
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
