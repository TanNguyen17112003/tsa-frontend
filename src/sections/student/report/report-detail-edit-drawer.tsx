import { ArrowBack, CheckBox } from '@mui/icons-material';
import { Box, Button, Drawer, Paper, Typography } from '@mui/material';
import FormInput from 'src/components/ui/FormInput';
import { Stack } from '@mui/system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import useFunction from 'src/hooks/use-function';
import { useAuth } from 'src/hooks/use-auth';
import useOrdersData from 'src/hooks/use-orders-data';
import 'dayjs/locale/en-gb';
import { ReportDetail, ReportFormProps, initialReportForm } from 'src/types/report';
import ReportProofComponent from './report-proof-component';
import { useReportsContext } from 'src/contexts/reports/reports-context';
import { getCurentUnixTimestamp } from 'src/utils/format-time-currency';
import { UploadImagesApi } from 'src/api/upload-images';

function ReportDetailEditDrawer({
  open,
  onClose,
  report
}: {
  open: boolean;
  onClose: () => void;
  report?: ReportDetail;
}) {
  const { user } = useAuth();
  const { updateReport } = useReportsContext();
  const orders = useOrdersData();
  const order = useMemo(
    () => orders.orders.find((order) => order.id === report?.orderId),
    [orders, report?.orderId]
  );

  const [isFormChanged, setIsFormChanged] = useState(false);

  const handleSubmitReport = useCallback(
    async (values: ReportFormProps) => {
      try {
        let updatedProof = values.proof;
        if (values.proof instanceof File) {
          const uploadedImage = await UploadImagesApi.postImage(values.proof as File);
          updatedProof = uploadedImage.secure_url;
        }
        const updatedData = {
          content: values.content,
          proof: updatedProof,
          reportedAt: getCurentUnixTimestamp(),
          reply: '',
          repliedAt: '',
          studentId: user?.id
        };
        await updateReport(updatedData, report?.id as string);
      } catch (error) {
        throw error;
      }
    },
    [report?.id, report?.proof, user?.id]
  );

  const handleSubmitReportHelper = useFunction(handleSubmitReport, {
    successMessage: 'Cập nhật khiếu nại thành công!'
  });

  const formik = useFormik<ReportFormProps>({
    initialValues: {
      content: report?.content || '',
      proof: report?.proof || ''
    },
    onSubmit: async (values) => {
      const { error } = await handleSubmitReportHelper.call(values);
      if (error) {
        formik.setValues(initialReportForm);
      }
      onClose();
    }
  });

  const handleProofChange = (event: React.ChangeEvent<HTMLInputElement>, file?: File) => {
    if (file) {
      formik.setFieldValue('proof', file);
    } else {
      formik.setFieldValue('proof', event.target.value);
    }
  };

  useEffect(() => {
    const hasChanged =
      formik.values.content !== report?.content || formik.values.proof !== report?.proof;
    setIsFormChanged(hasChanged);
  }, [formik.values, report?.content, report?.proof]);

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        PaperProps={{
          sx: {
            width: 750
          }
        }}
        onClose={onClose}
      >
        <form onSubmit={formik.handleSubmit}>
          <Paper elevation={5} sx={{ p: 3, borderRadius: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box>
                <Box sx={{ cursor: 'pointer' }} onClick={onClose}>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    <ArrowBack
                      fontSize='small'
                      sx={{
                        verticalAlign: 'middle'
                      }}
                    />{' '}
                    Quay lại
                  </Typography>
                </Box>
                <Typography variant='h6'>
                  Khiếu nại đơn hàng #{report?.orderId as string}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center'
                }}
              >
                <Button color='inherit' variant='contained' onClick={onClose}>
                  Hủy bỏ
                </Button>
                <Button variant='contained' color='primary' type='submit' disabled={!isFormChanged}>
                  Cập nhật
                </Button>
              </Box>
            </Box>
          </Paper>
          <Stack spacing={3} padding={3}>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography variant='h6'>Mã đơn hàng</Typography>
              <FormInput
                type='text'
                className='w-full px-3 rounded-lg '
                disabled
                value={`#${order?.checkCode}`}
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography variant='h6'>Trạng thái</Typography>
              <FormInput
                type='text'
                className='w-full px-3 rounded-lg'
                disabled
                value={report?.status === 'REPLIED' ? 'Đã giải quyết' : 'Đang chờ xử lý'}
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography variant='h6'>Phản hồi</Typography>
              <FormInput
                type='text'
                className='w-full px-3 rounded-lg '
                disabled
                value={report?.reply}
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography variant='h6'>Nội dung khiếu nại</Typography>
              <FormInput
                defaultValue={report?.content}
                type='text'
                className='w-full px-3 rounded-lg '
                onChange={(event) => formik.setFieldValue('content', event.target.value)}
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={2}>
              <ReportProofComponent
                defaultValue={report?.proof || undefined}
                label='Minh chứng'
                onChange={handleProofChange}
              />
            </Box>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}

export default ReportDetailEditDrawer;
