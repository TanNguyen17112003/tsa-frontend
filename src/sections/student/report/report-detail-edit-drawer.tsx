import { ArrowBack, CheckBox } from '@mui/icons-material';
import { Box, Button, Drawer, Paper, Typography } from '@mui/material';
import FormInput from 'src/components/ui/FormInput';
import { Stack } from '@mui/system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import useFunction from 'src/hooks/use-function';
import { useAuth } from 'src/hooks/use-auth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import { ReportDetail, ReportFormProps, initialReportForm } from 'src/types/report';
import ReportProofComponent from './report-proof-component';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import { useReportsContext } from 'src/contexts/reports/reports-context';
import { getCurentUnixTimestamp } from 'src/utils/format-time-currency';

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
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(formatUnixTimestamp(report?.reportedAt as string))
  );
  const handleSubmitReport = useCallback(
    async (values: ReportFormProps) => {
      try {
        const updatedData = {
          content: values.content,
          proof: values.proof,
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
    [report?.id, user?.id]
  );
  const handleSubmitReportHelper = useFunction(handleSubmitReport, {
    successMessage: 'Cập nhật khiếu nại thành công!'
  });
  const formik = useFormik<ReportFormProps>({
    initialValues: initialReportForm,
    onSubmit: async (values) => {
      const { error } = await handleSubmitReportHelper.call(values);
      if (error) {
        formik.setValues(initialReportForm);
      }
      onClose();
    }
  });
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
                <Button variant='contained' color='primary' type='submit'>
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
                value={`#${report?.orderCode}`}
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
              <Typography variant='h6'>Ngày tạo / Chỉnh sửa khiếu nại</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
                <DatePicker
                  disabled
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                />
              </LocalizationProvider>
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
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <ReportProofComponent
                defaultValue={report?.proof || undefined}
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

export default ReportDetailEditDrawer;
