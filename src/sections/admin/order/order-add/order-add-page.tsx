import { ArrowBack } from '@mui/icons-material';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Stack } from '@mui/system';
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
import { FileDropzone } from '@components';
import { RecognitionssApi } from 'src/api/recognition';
import { CardTable } from 'src/components/card-table';
import { orderUploadTableConfigs } from './order-upload-table-configs';
import { keyBy } from 'lodash';
import LoadingProcess from 'src/components/LoadingProcess';

export interface GeneratedOrder {
  id: string;
  orderId: string;
  brand: string;
  fileName: string;
}

const OrderAddPage = () => {
  const [resetUploadSection, setResetUploadSection] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [orderList, setOrderList] = useState<OrderFormProps[]>([]);
  const [generatedOrderList, setGeneratedOrderList] = useState<GeneratedOrder[]>([]);
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
        if (generatedOrderList.length == 0) {
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
        } else {
          await createOrder(
            generatedOrderList.map((order) => ({
              checkCode: order.orderId,
              brand: order.brand
            }))
          );
          setGeneratedOrderList([]);
          setImageFiles([]);
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
      generatedOrderList,
      user?.id,
      firebaseUser?.id,
      formik
    ]
  );

  const handleSubmitOrderHelper = useFunction(handleSubmitOrder, {
    successMessage: 'Thêm đơn hàng thành công'
  });

  const handleLoadOrderImage = useCallback(
    async (files: File[]) => {
      if (files.length === 1) {
        const newOrderInfo = await RecognitionssApi.postRecognition({
          image: files[0]
        });
        formik.setFieldValue('checkCode', newOrderInfo.orderId);
        formik.setFieldValue('brand', newOrderInfo.brand);
      } else {
        files.forEach(async (file) => {
          const newOrderInfo = await RecognitionssApi.postRecognition({
            image: file
          });
          setGeneratedOrderList((prev) => [
            ...prev,
            {
              id: newOrderInfo.orderId,
              orderId: newOrderInfo.orderId,
              brand: newOrderInfo.brand,
              fileName: file.name
            }
          ]);
        });
      }
    },
    [formik, setGeneratedOrderList]
  );

  const handleLoadOrderImageHelper = useFunction(handleLoadOrderImage, {
    successMessage: 'Tải ảnh và điền thành công'
  });

  return (
    <Box className='text-black bg-white min-h-screen'>
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
                  (!formik.values.checkCode || !formik.values.brand) &&
                  generatedOrderList.length === 0
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
            <Stack>
              <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
                3. Tải lên hình ảnh để điền thông tin một cách nhanh chóng
              </Typography>
              <Typography variant='subtitle2' fontStyle={'italic'} color='textSecondary'>
                *Lưu ý: chỉ áp dụng cho những đơn hàng đến từ Shopee và Sendo
              </Typography>
              <FileDropzone
                files={imageFiles}
                type='multiple'
                caption={'File ảnh (png, jpg, jpeg)'}
                title={'Nhấn để tải ảnh lên hoặc kéo thả vào đây'}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg']
                }}
                onDrop={(acceptedFiles) => {
                  setImageFiles(acceptedFiles);
                  handleLoadOrderImageHelper.call(acceptedFiles);
                }}
                onRemoveAll={() => {
                  setImageFiles([]);
                  setGeneratedOrderList([]);
                  formik.setFieldValue('checkCode', '');
                  formik.setFieldValue('brand', '');
                }}
                onRemove={(file) => {
                  setImageFiles((prev) => prev.filter((f) => f !== file));
                  setGeneratedOrderList((prev) => prev.filter((f) => f.fileName !== file.name));
                  formik.setFieldValue('checkCode', '');
                  formik.setFieldValue('brand', '');
                }}
              />
              {generatedOrderList.length > 0 && (
                <CardTable
                  rows={generatedOrderList}
                  configs={orderUploadTableConfigs}
                  onUpdate={async (key, value, item, index) => {
                    const updatedOrderList = [...generatedOrderList];
                    updatedOrderList[index] = {
                      ...updatedOrderList[index],
                      [key]: value
                    };
                    setGeneratedOrderList(updatedOrderList);
                  }}
                />
              )}
            </Stack>
          </>
        </Stack>
      </Stack>
      {(handleLoadOrderImageHelper.loading || handleSubmitOrderHelper.loading) && (
        <LoadingProcess />
      )}
    </Box>
  );
};

export default OrderAddPage;
