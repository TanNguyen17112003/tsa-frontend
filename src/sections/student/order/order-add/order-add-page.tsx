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
import { OrderFormProps, OrdersApi } from 'src/api/orders';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { initialOrderForm } from 'src/types/order';
import { useDialog } from '@hooks';
import OrderConfirmFeeDialog from './order-confirm-fee-dialog';
import OrderPaymentDialog from './order-payment-dialog';
import { getShippingFee } from 'src/utils/shipping-fee';
import { usePayOS, PayOSConfig } from 'payos-checkout';
import { PaymentsApi } from 'src/api/payment';
import dayjs from 'dayjs';
import { useSocketContext } from 'src/contexts/socket-client/socket-client-context';

const OrderAddPage = () => {
  const [resetUploadSection, setResetUploadSection] = useState('');
  const { socket } = useSocketContext();
  const { createOrder, updateOrder } = useOrdersContext();
  const [isUploaded, setIsUploaded] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

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
      await handleSubmitOrderHelper.call(values);
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
      onSuccess: async (event: any) => {
        await updateOrder(
          {
            deliveryDate: formik.values.deliveryDate,
            isPaid: true
          },
          orderId
        );
        setOrderId('');
        showSnackbarSuccess('Tạo đơn hàng thành công!');
        setCheckoutUrl('');
        formik.resetForm();
      },
      onCancel: async (event: any) => {
        await OrdersApi.deleteOrder(orderId);
        setOrderId('');
        showSnackbarSuccess('Thanh toán bị hủy');
        setCheckoutUrl('');
      }
    };
  }, [checkoutUrl, formik, updateOrder, setCheckoutUrl, createOrder, shippingFee, orderId]);
  const { open } = usePayOS(payOSConfig);

  useEffect(() => {
    if (checkoutUrl) {
      open();
    }
  }, [checkoutUrl, open]);

  const handleCreateOrderAndPayment = useCallback(async () => {
    const newOrder = await OrdersApi.postOrders({
      ...(() => {
        const { deliveryDay, deliveryTimeSlot, ...rest } = formik.values;
        return rest;
      })(),
      product: formik.values.product?.startsWith(', ')
        ? formik.values.product.slice(2)
        : formik.values.product,
      deliveryDate: dayjs(
        `${formik.values.deliveryDay}T${formik.values.deliveryTimeSlot}:00`
      ).toISOString()
    });
    if (newOrder && newOrder.data.id) {
      setOrderId(newOrder.data.id);
    }
    const paymentResponse = await PaymentsApi.postPayOSPayment({
      orderId: newOrder.data.id,
      amount: shippingFee,
      description: 'Thanh toán ' + formik.values.checkCode,
      returnUrl: `${window.location.origin}/student/order/add`,
      cancelUrl: `${window.location.origin}/student/order/add`,
      extraData: formik.values.checkCode as string
    });
    if (paymentResponse && paymentResponse.paymentLink.checkoutUrl) {
      setCheckoutUrl(paymentResponse.paymentLink.checkoutUrl);
    }
  }, [shippingFee, formik.values, setCheckoutUrl]);

  const handleSubmitOrder = useCallback(
    async (values: OrderFormProps) => {
      try {
        if (orderList && orderList.length > 0) {
          await createOrder(
            orderList.map((order) => ({
              ...order,
              deliveryDate: dayjs(order.deliveryDate).toISOString(),
              product: formik.values.product?.startsWith(', ')
                ? formik.values.product.slice(2)
                : formik.values.product
            }))
          );
        } else {
          await createOrder([
            {
              ...(() => {
                const { deliveryDay, deliveryTimeSlot, ...rest } = values;
                return rest;
              })(),
              product: formik.values.product?.startsWith(', ')
                ? formik.values.product.slice(2)
                : formik.values.product,
              deliveryDate: dayjs(
                `${formik.values.deliveryDay}T${formik.values.deliveryTimeSlot}:00`
              ).toISOString()
            }
          ]);
          console.log(values);
        }
        formik.resetForm();
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
      formik,
      shippingFee
    ]
  );

  const handleSubmitOrderHelper = useFunction(handleSubmitOrder, {
    successMessage: 'Tạo đơn hàng thành công'
  });

  useEffect(() => {
    if (socket && orderId && checkoutUrl) {
      const paymentUpdateHandler = async (data: any) => {
        console.log('Payment update: ' + JSON.stringify(data));
        if (data.isPaid) {
          await setCheckoutUrl('');
          await showSnackbarSuccess('Thanh toán thành công');
          formik.resetForm();
        }
      };

      socket.emit('subscribeToPayment', { orderId: orderId });
      console.log('Subscribe to payment with ' + orderId);
      socket.on('paymentUpdate', paymentUpdateHandler);

      return () => {
        socket.emit('unsubscribeToPayment', { orderId: orderId });
        console.log(`Unsubscribe to payment with ${orderId}`);
        socket.off('paymentUpdate', paymentUpdateHandler);
      };
    }
  }, [socket, orderId, checkoutUrl, formik]);

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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant='contained'
                  onClick={handleOpenShippingFeeDialog}
                  className='bg-green-500 hover:bg-green-400'
                  disabled={
                    (!formik.values.checkCode ||
                      !formik.values.weight ||
                      !formik.values.product ||
                      !formik.values.building ||
                      !formik.values.room ||
                      !formik.values.dormitory ||
                      !formik.values.deliveryDay ||
                      !formik.values.deliveryTimeSlot ||
                      !formik.values.brand ||
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
          orders={orderList}
          formik={formik}
          open={orderShippingFeeDialog.open}
          onClose={orderShippingFeeDialog.handleClose}
          shippingFee={shippingFee as number}
          onConfirm={async () => formik.handleSubmit()}
          onConfirmPayment={handleCreateOrderAndPayment}
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
