import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Container, Stack } from '@mui/system';
import { FormikProps, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState, useCallback, useEffect, useMemo } from 'react';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { useAuth } from 'src/hooks/use-auth';
import { useDialog } from 'src/hooks/use-dialog';
import useFunction from 'src/hooks/use-function';
import { paths } from 'src/paths';
import { CircularProgress } from '@mui/material';
import { OrderForm } from './order-form';
import OrderUploadSection from './order-upload-section';
import { initialAddingOrder, OrderImport } from 'src/types/order';

const ActivityAddPage = () => {
  const [resetUploadSection, setResetUploadSection] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const router = useRouter();
  const { showSnackbarError, showSnackbarSuccess } = useAppSnackbar();
  const { user } = useAuth();

  const formik = useFormik<OrderImport>({
    initialValues: initialAddingOrder,
    onSubmit: async (values) => {
      try {
        formik.setValues(values);
      } catch {
        showSnackbarError('Có lỗi xảy ra');
      }
    }
  });

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
                onClick={() => {}}
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
                onUpload={() => {}}
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

export default ActivityAddPage;
