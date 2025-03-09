import { Box, Button, MenuItem, Stack, TextField, Typography, IconButton } from '@mui/material';
import React, { useMemo, useRef, useCallback } from 'react';
import { useFormik } from 'formik';
import { Ticket, TicketType, ticketTypeMap } from 'src/types/ticket';
import { useResponsive } from 'src/utils/use-responsive';
import { AttachCircle, CloseCircle } from 'iconsax-react';
import { TicketsApi } from 'src/api/tickets';
import { useTicketsContext } from 'src/contexts/tickets/tickets-context';
import { useAuth } from '@hooks';
import useFunction from 'src/hooks/use-function';

interface TicketFormProps {
  type: TicketType | string;
  title: string;
  content: string;
  attachments: File[];
}

function TicketDetail() {
  const { user } = useAuth();
  const {
    isMobile,
    isTablet,
    isDesktop
  }: { isMobile: boolean; isTablet: boolean; isDesktop: boolean } = useResponsive();
  const { createTicket } = useTicketsContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ticketTypes = useMemo(() => {
    return Object.entries(ticketTypeMap).map(([key, value]) => ({
      label: key,
      value: value as TicketType
    }));
  }, []);

  const handleSubmitTicket = useCallback(
    async (value: TicketFormProps) => {
      const ticket: Omit<Ticket, 'id'> = {
        type: value.type as TicketType,
        title: value.title,
        content: value.content,
        status: 'open',
        createdAt: new Date().toISOString(),
        studentId: user?.id || ''
      };
      await createTicket(ticket, value.attachments);
    },
    [user, createTicket]
  );

  const handleSubmitTicketHelper = useFunction(handleSubmitTicket, {
    successMessage: 'Tạo câu hỏi/yêu cầu thành công'
  });

  const formik = useFormik<TicketFormProps>({
    initialValues: {
      type: '',
      title: '',
      content: '',
      attachments: [] as File[]
    },
    onSubmit: async (values) => {
      handleSubmitTicketHelper.call(values);
      formik.resetForm();
    }
  });

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...formik.values.attachments];
    newAttachments.splice(index, 1);
    formik.setFieldValue('attachments', newAttachments);
  };

  return (
    <Box
      component='form'
      onSubmit={formik.handleSubmit}
      width={isMobile ? '100%' : isTablet ? '60%' : '40%'}
    >
      <Typography variant='h5'>Tạo câu hỏi/yêu cầu</Typography>
      <Stack direction='column' spacing={3} mt={2}>
        <TextField
          select
          label='Loại'
          name='type'
          value={formik.values.type}
          onChange={formik.handleChange}
          fullWidth
          margin='normal'
        >
          <MenuItem value=''>
            <em>Chọn loại</em>
          </MenuItem>
          {ticketTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label='Tiêu đề'
          name='title'
          value={formik.values.title}
          onChange={formik.handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Nội dung'
          name='content'
          value={formik.values.content}
          onChange={formik.handleChange}
          fullWidth
          margin='normal'
          multiline
          rows={4}
        />
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          className='cursor-pointer'
          onClick={handleFileUploadClick}
        >
          <AttachCircle size={32} variant='Bold' color='blue' />
          <Typography variant='body1' fontWeight='bold' color='primary'>
            Tải lên tệp đính kèm
          </Typography>
          <input
            type='file'
            hidden
            multiple
            ref={fileInputRef}
            onChange={(event) => {
              const files = event.currentTarget.files;
              if (files) {
                formik.setFieldValue('attachments', Array.from(files) as File[]);
              }
            }}
          />
        </Stack>
        <Stack direction='column' spacing={1}>
          {formik.values.attachments.map((file, index) => (
            <Stack key={index} direction='row' alignItems='center' spacing={1}>
              <Typography variant='body2'>{file.name}</Typography>
              <IconButton size='small' onClick={() => handleRemoveAttachment(index)}>
                <CloseCircle size={16} />
              </IconButton>
            </Stack>
          ))}
        </Stack>
        <Button sx={{ alignSelf: 'flex-start' }} type='submit' variant='contained' color='primary'>
          Tạo câu hỏi yêu cầu
        </Button>
      </Stack>
    </Box>
  );
}

export default TicketDetail;
