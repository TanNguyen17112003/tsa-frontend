import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState, useCallback, useMemo, useEffect } from 'react';
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
import { useDialog } from '@hooks';
import OrderConfirmFeeDialog from './order-confirm-fee-dialog';
import OrderPaymentDialog from './order-payment-dialog';
import { getShippingFee } from 'src/utils/shipping-fee';
import { usePayOS, PayOSConfig } from 'payos-checkout';
import { PaymentsApi } from 'src/api/payment';

const OrderAddPage = () => {
  const [resetUploadSection, setResetUploadSection] = useState('');
  const { createOrder, updateOrder } = useOrdersContext();
  const [isUploaded, setIsUploaded] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [orderList, setOrderList] = useState<OrderFormProps[]>([]);
  const router = useRouter();
  const { showSnackbarError, showSnackbarSuccess } = useAppSnackbar();

  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

  const orderShippingFeeDialog = useDialog<{
    shippingFee: number;
  }>();
  const orderPaymentDialog = useDialog();

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

  const shippingFee = useMemo(() => {
    if (orderList && orderList.length > 0) {
      return orderList.reduce((acc, order) => {
        return (
          acc +
          getShippingFee(
            order.room as string,
            order.building as string,
            order.dormitory as string,
            order.weight as number
          )
        );
      }, 0);
    }
    return getShippingFee(
      formik.values.room as string,
      formik.values.building as string,
      formik.values.dormitory as string,
      formik.values.weight as number
    );
  }, [
    orderList,
    formik.values.room,
    formik.values.building,
    formik.values.dormitory,
    formik.values.weight
  ]);

  const handleOpenShippingFeeDialog = useCallback(() => {
    orderShippingFeeDialog.handleOpen({
      shippingFee: shippingFee as number
    });
  }, [shippingFee, orderShippingFeeDialog]);

  const payOSConfig: PayOSConfig = useMemo(() => {
    return {
      RETURN_URL: `${window.location.origin}/student/order/add`,
      ELEMENT_ID: 'payos-checkout-iframe-add',
      CHECKOUT_URL: checkoutUrl,
      onSuccess: (event: any) => {
        createOrder([
          {
            ...formik.values,
            shippingFee: shippingFee as number,
            deliveryDate: formik.values.deliveryDate,
            isPaid: true
          }
        ]);
        showSnackbarSuccess('Tạo đơn hàng thành công!');
        setCheckoutUrl('');
        formik.resetForm();
      },
      onCancel: (event: any) => {
        showSnackbarError('Thanh toán bị hủy');
        setCheckoutUrl('');
      }
    };
  }, [checkoutUrl, formik, updateOrder, setCheckoutUrl, createOrder, shippingFee]);
  const { open } = usePayOS(payOSConfig);

  useEffect(() => {
    if (checkoutUrl) {
      open();
    }
  }, [checkoutUrl, open]);

  const handleConfirmShippingFee = useCallback(async () => {
    if (orderList && orderList.length > 0) {
      await formik.handleSubmit();
    } else {
      if (formik.values.paymentMethod === 'CASH') {
        await formik.handleSubmit();
      } else {
        orderPaymentDialog.handleOpen();
      }
    }
  }, [formik.values.paymentMethod, orderPaymentDialog, orderList]);
  const handleSubmitOrder = useCallback(
    async (values: OrderFormProps) => {
      try {
        if (orderList && orderList.length > 0) {
          await createOrder(
            orderList.map((order) => ({
              ...order,
              shippingFee: getShippingFee(
                order.room as string,
                order.building as string,
                order.dormitory as string,
                order.weight as number
              )
            }))
          );
        } else {
          await createOrder([
            {
              ...values,
              deliveryDate: formik.values.deliveryDate,
              shippingFee: shippingFee as number
            }
          ]);
        }
        showSnackbarSuccess('Tạo đơn hàng thành công!');
        formik.resetForm();
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
      formik,
      shippingFee
    ]
  );

  const handleCreateOrderAndPayment = useCallback(async () => {
    const paymentResponse = await PaymentsApi.postPayOSPayment({
      orderId: Math.random().toString(36).substring(7),
      amount: shippingFee || 8000,
      description: 'Thanh toán ' + formik.values.checkCode,
      returnUrl: `${window.location.origin}/student/order/add`,
      cancelUrl: `${window.location.origin}/student/order/add`,
      extraData: formik.values.checkCode as string
    });
    if (paymentResponse && paymentResponse.paymentLink.checkoutUrl) {
      setCheckoutUrl(paymentResponse.paymentLink.checkoutUrl);
    }
  }, [PaymentsApi, shippingFee, formik.values, setCheckoutUrl]);

  const handleSubmitOrderHelper = useFunction(handleSubmitOrder);

  return (
    <>
      <Box id='payos-checkout-iframe-add' className='absolute top-0 left-0 w-full h-full' />
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
              <>{JSON.stringify(orderList)}</>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant='contained'
                  // onClick={() => formik.handleSubmit()}
                  onClick={handleOpenShippingFeeDialog}
                  className='bg-green-500 hover:bg-green-400'
                  disabled={
                    (!formik.values.checkCode ||
                      !formik.values.weight ||
                      !formik.values.product ||
                      !formik.values.building ||
                      !formik.values.room ||
                      !formik.values.dormitory ||
                      !formik.values.deliveryDate ||
                      !formik.values.paymentMethod) &&
                    orderList.length === 0
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
        <OrderConfirmFeeDialog
          open={orderShippingFeeDialog.open}
          onClose={orderShippingFeeDialog.handleClose}
          shippingFee={shippingFee as number}
          onConfirm={handleConfirmShippingFee}
        />
        <OrderPaymentDialog
          open={orderPaymentDialog.open}
          onClose={orderPaymentDialog.handleClose}
          onConfirm={handleCreateOrderAndPayment}
          onAlternativeConfirm={async () => formik.handleSubmit()}
        />
      </Box>
    </>
  );
};

export default OrderAddPage;
