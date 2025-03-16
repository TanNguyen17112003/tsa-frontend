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
import React, { useCallback, useMemo } from 'react';
import { TicketDetail } from 'src/types/ticket';
import { useAuth, useDialog } from '@hooks';
import { useFirebaseAuth } from '@hooks';
import { Printer, Send } from 'lucide-react';
import { AttachCircle, CloseCircle } from 'iconsax-react';
import { useFormik } from 'formik';
import { useRef } from 'react';
import { formatDate } from 'src/utils/format-time-currency';
import { useTicketsContext } from 'src/contexts/tickets/tickets-context';
import { useRouter } from 'next/router';
import useFunction from 'src/hooks/use-function';
import TicketDetailUpdateStatusDialog from './ticket-detail-update-status-dialog';

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
  const { replyTicket } = useTicketsContext();
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
      {handleReplyHelper.loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Stack>
  );
};

const TicketDetailHistory: React.FC<TicketDetailHistoryProps> = ({ ticket }) => {
  const { user } = useAuth();
  const updateTicketStatusDialog = useDialog<TicketDetail>();
  const { user: firebaseUser } = useFirebaseAuth();
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
                onClick={() => updateTicketStatusDialog.handleOpen(ticket as TicketDetail)}
              >
                Cập nhật trạng thái
              </Button>
            )}
            <Printer className='cursor-pointer' size={20} onClick={() => window.print()} />
          </Box>
        </Stack>
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
      </Box>
      <Divider />
      <TicketDetailHistoryItem
        createdAt={ticket?.createdAt as Date}
        name={ticket?.userName}
        avatarUrl={ticket?.photoUrl}
        isInitial={true}
        content={ticket?.content}
        attachments={ticket?.attachments.map((attachment) => attachment.fileUrl)}
        toReply={false}
      />
      {ticket?.replies.length > 0 && <Divider />}
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
      <TicketDetailUpdateStatusDialog
        ticket={ticket}
        open={updateTicketStatusDialog.open}
        onClose={updateTicketStatusDialog.handleClose}
      />
    </Box>
  );
};

export default TicketDetailHistory;
