import { ArrowBack, CheckBox } from '@mui/icons-material';
import { Box, Button, Drawer, Paper, Typography } from '@mui/material';
import FormInput from 'src/components/ui/FormInput';
import { Stack } from '@mui/system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import useFunction from 'src/hooks/use-function';
import { useAuth } from 'src/hooks/use-auth';
import 'dayjs/locale/en-gb';
import ReportProofComponent from '../../report/report-proof-component';
import { OrderDetail } from 'src/types/order';
import { ReportDetail, ReportFormProps, initialReportForm } from 'src/types/report';
import { request } from 'http';
import { getCurentUnixTimestamp } from 'src/utils/format-time-currency';
import { ReportsApi } from 'src/api/reports';

function OrderDetailReportDrawer({
  open,
  onClose,
  order
}: {
  open: boolean;
  onClose: () => void;
  order?: OrderDetail;
}) {
  const { user } = useAuth();
  const handleSubmitReport = useCallback(
    async (values: ReportFormProps) => {
      try {
        await ReportsApi.postReports({
          content: values.content,
          proof: values.proof,
          orderId: order?.id,
          reportedAt: getCurentUnixTimestamp(),
          reply: '',
          repliedAt: '',
          studentId: user?.id
        });
      } catch (err) {
        throw err;
      }
    },
    [order, user]
  );
  const handleSubmitReportHelper = useFunction(handleSubmitReport, {
    successMessage: 'Cập nhật khiếu nại thành công'
  });
  const formik = useFormik<ReportFormProps>({
    initialValues: initialReportForm,
    onSubmit: async (values) => {
      const { error } = await handleSubmitReportHelper.call(values);
      if (error) {
        formik.setValues(initialReportForm);
        onClose();
      }
    }
  });
  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        PaperProps={{
          sx: {
            width: 600
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
                <Typography variant='h6'>Khiếu nại đơn hàng #{order?.checkCode}</Typography>
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
                <Button variant='contained' color='primary' type='submit'>
                  Cập nhật
                </Button>
              </Box>
            </Box>
          </Paper>
          <Stack spacing={3} padding={3}>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography variant='h6'>Nội dung khiếu nại</Typography>
              <FormInput
                type='text'
                className='w-full px-3 rounded-lg'
                onChange={(event) => formik.setFieldValue('content', event.target.value)}
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <ReportProofComponent
                label='Minh chứng'
                onChange={(event) => formik.setFieldValue('proof', event.target.value)}
              />
            </Box>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}

export default OrderDetailReportDrawer;
