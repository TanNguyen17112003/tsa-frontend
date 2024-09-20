import { ArrowBack, CheckBox } from '@mui/icons-material';
import { Box, Button, Drawer, Paper, Typography } from '@mui/material';
import FormInput from 'src/components/ui/FormInput';
import { Stack } from '@mui/system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import useFunction from 'src/hooks/use-function';
import { useAuth } from 'src/hooks/use-auth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import { ReportDetail, ReportFormProps, initialReportForm } from 'src/types/report';
import ReportProofComponent from './report-proof-component';

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
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(report?.reportAt));
  const handleSubmitReport = useCallback(async (values: ReportFormProps) => {
    try {
      console.log(values);
    } catch (error) {
      throw error;
    }
  }, []);
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
                <Typography variant='h6'>Khiếu nại đơn hàng #{report?.id}</Typography>
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
                value={
                  report?.status === 'SOLVED'
                    ? 'Đã giải quyết'
                    : report?.status === 'PENDING'
                      ? 'Đang chờ xử lý'
                      : 'Đã từ chối'
                }
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
                type='text'
                className='w-full px-3 rounded-lg '
                value={formik.values.content}
                onChange={formik.handleChange}
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <ReportProofComponent
                label='Minh chứng'
                value={formik.values.proof!}
                onChange={formik.handleChange}
              />
            </Box>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}

export default ReportDetailEditDrawer;
