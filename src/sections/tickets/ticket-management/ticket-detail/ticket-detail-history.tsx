import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useCallback, useMemo, useRef } from 'react';
import { TicketDetail } from 'src/types/ticket';
import { useAuth, useDialog } from '@hooks';
import { useFirebaseAuth } from '@hooks';
import { Printer, Send } from 'lucide-react';
import { AttachCircle, Check, CloseCircle, ShieldTick } from 'iconsax-react';
import { useFormik } from 'formik';
import { formatDate } from 'src/utils/format-time-currency';
import { useTicketsContext } from 'src/contexts/tickets/tickets-context';
import { useRouter } from 'next/router';
import useFunction from 'src/hooks/use-function';
import TicketDetailUpdateStatusDialog from './ticket-detail-update-status-dialog';
import LoadingProcess from 'src/components/LoadingProcess';
import TicketDetailCompleteDialog from './ticket-detail-complete-dialog';

interface TicketDetailHistoryProps {
  ticket: TicketDetail;
}

interface ReplyProps {
  content: string;
  attachments: File[];
}

interface TicketHeaderItemProps {
  title: string;
  value: string;
}

const TicketDetailHistoryItem: React.FC<{
  createdAt?: Date;
  name: string;
  avatarUrl: string;
  isInitial: boolean;
  content?: string;
  attachments: string[];
  toReply: boolean;
}> = ({ createdAt, name, avatarUrl, isInitial, content, attachments, toReply }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { replyTicket, updateStatusTicket } = useTicketsContext();
  const handleFileUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleReply = useCallback(
    async (replyForm: ReplyProps) => {
      await replyTicket(router.query.ticketId as string, replyForm.content, replyForm.attachments);
    },
    [router.query.ticketId, replyTicket]
  );

  const handleReplyHelper = useFunction(handleReply, {
    successMessage: 'Gửi câu trả lời hành thành công'
  });

  const formik = useFormik<ReplyProps>({
    initialValues: {
      content: '',
      attachments: [] as File[]
    },
    onSubmit: async (values) => {
      const { error } = await handleReplyHelper.call(values);
      if (!error) {
        formik.resetForm();
      }
    }
  });

  const handleRemoveAttachment = useCallback(
    (index: number) => {
      const newAttachments = [...formik.values.attachments];
      newAttachments.splice(index, 1);
      formik.setFieldValue('attachments', newAttachments);
    },
    [formik]
  );

  return (
    <Stack width={'100%'}>
      {!toReply && (
        <Box display={'flex'} alignItems={'center'} gap={1} mb={1}>
          <Typography variant='body2' color='textSecondary'>
            {formatDate(createdAt as Date)}
          </Typography>
          <Typography textTransform={'uppercase'}>- {name}</Typography>
          <Typography color='primary' fontWeight={'bold'}>
            {isInitial ? 'đã tạo' : 'đã trả lời'}
          </Typography>
        </Box>
      )}
      <Box display={'flex'} gap={1} width={'100%'}>
        <Avatar src={avatarUrl} />
        <Stack direction={'column'} gap={0.5} width={'100%'}>
          <Typography variant='body2' color='primary'>
            {name}
          </Typography>
          {toReply ? (
            <Box
              component='form'
              onSubmit={formik.handleSubmit}
              display={'flex'}
              flexDirection={'column'}
              gap={0.5}
              width={'100%'}
            >
              <Typography>Viết câu trả lời</Typography>
              <TextField
                label='Nội dung'
                name='content'
                value={formik.values.content}
                onChange={formik.handleChange}
                fullWidth
                margin='normal'
                multiline
                rows={6}
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
              <Button
                startIcon={<Send />}
                sx={{ alignSelf: 'flex-start' }}
                type='submit'
                variant='contained'
                color='primary'
              >
                Trả lời
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant='body2'>{content}</Typography>
              <Stack direction={'row'} gap={1} flexWrap='wrap'>
                {attachments?.map((attachment, index) => (
                  <Link
                    key={index}
                    href={attachment}
                    target='_blank'
                    sx={{ wordBreak: 'break-all', maxWidth: '100%' }}
                  >
                    <Typography variant='body2' color='primary'>
                      {attachment}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
      {handleReplyHelper.loading && <LoadingProcess />}
    </Stack>
  );
};

const TicketDetailHistory: React.FC<TicketDetailHistoryProps> = ({ ticket }) => {
  const { user } = useAuth();
  const { updateStatusTicket } = useTicketsContext();
  const updateTicketStatusDialog = useDialog<TicketDetail>();
  const ticketDetailCompleteDialog = useDialog<TicketDetail>();
  const { user: firebaseUser } = useFirebaseAuth();
  const printRef = useRef<HTMLDivElement>(null);
  const ticketOwnerInfo: TicketHeaderItemProps[] = useMemo(() => {
    return [
      {
        title: 'Đã được tạo',
        value: formatDate(ticket?.createdAt as Date)
      },
      {
        title: 'Bởi',
        value: ticket?.userName
      }
    ];
  }, [user, firebaseUser, ticket]);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print</title>');
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map((style) => style.outerHTML)
        .join('');
      printWindow.document.write(styles);
      printWindow.document.write('</head><body>');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const handleCompleteTicket = useCallback(async (ticket: TicketDetail) => {
    try {
      await updateStatusTicket(ticket.id, 'CLOSED');
    } catch (error) {
      console.error('Error completing ticket:', error);
    }
  }, []);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      paddingX={3}
      paddingY={2}
      border={'1px solid #cecece'}
    >
      <Box>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant='h5' fontWeight={'regular'}>
            {ticket?.title}
          </Typography>
          <Box display={'flex'} alignItems={'center'} gap={2}>
            {(user?.role === 'ADMIN' || firebaseUser?.role === 'ADMIN') && (
              <Button
                variant='contained'
                color='success'
                startIcon={<ShieldTick />}
                onClick={() => ticketDetailCompleteDialog.handleOpen(ticket as TicketDetail)}
                // onClick={() => updateTicketStatusDialog.handleOpen(ticket as TicketDetail)}
              >
                Đánh dấu hoàn thành
              </Button>
            )}
            <Printer className='cursor-pointer' size={20} onClick={handlePrint} />
          </Box>
        </Stack>
      </Box>
      <div ref={printRef} className='print-area' style={{ background: 'white', color: 'black' }}>
        <Stack direction={'row'} gap={2} mt={1}>
          {ticketOwnerInfo.map((item, index) => (
            <Box key={index} display={'flex'} alignItems={'center'} gap={0.5}>
              <Typography variant='body2' color='textSecondary'>
                {item.title}
              </Typography>
              <Typography>-</Typography>
              <Typography variant='body2'>{item.value}</Typography>
            </Box>
          ))}
        </Stack>
        <Divider />
        <Box my={2}>
          <TicketDetailHistoryItem
            createdAt={ticket?.createdAt as Date}
            name={ticket?.userName}
            avatarUrl={ticket?.photoUrl}
            isInitial={true}
            content={ticket?.content}
            attachments={ticket?.attachments.map((attachment) => attachment.fileUrl)}
            toReply={false}
          />
        </Box>
        {ticket?.replies.length > 0 && <Divider sx={{ mb: 2 }} />}
        <Stack gap={2}>
          {ticket?.replies.map((reply, index) => (
            <Box key={index} display={'flex'} flexDirection={'column'} gap={2}>
              <TicketDetailHistoryItem
                createdAt={reply.createdAt as Date}
                name={reply.userName}
                avatarUrl={reply.photoUrl}
                isInitial={false}
                content={reply.content}
                attachments={reply.attachments.map((attachment) => attachment.fileUrl)}
                toReply={false}
              />
              <Divider />
            </Box>
          ))}
        </Stack>
      </div>
      {ticket?.status !== 'CLOSED' && (
        <TicketDetailHistoryItem
          name={
            user?.lastName + ' ' + user?.firstName ||
            firebaseUser?.lastName + ' ' + firebaseUser?.firstName ||
            ''
          }
          avatarUrl={user?.photoUrl || firebaseUser?.photoUrl || ''}
          isInitial={false}
          content={''}
          attachments={[]}
          toReply={true}
        />
      )}
      <TicketDetailUpdateStatusDialog
        ticket={ticket}
        open={updateTicketStatusDialog.open}
        onClose={updateTicketStatusDialog.handleClose}
      />
      <TicketDetailCompleteDialog
        ticket={ticket}
        open={ticketDetailCompleteDialog.open}
        onClose={ticketDetailCompleteDialog.handleClose}
      />
    </Box>
  );
};

export default TicketDetailHistory;
