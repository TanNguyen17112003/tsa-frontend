import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { TicketDetail } from 'src/types/ticket';
import { useAuth } from '@hooks';
import { useFirebaseAuth } from '@hooks';
import { Printer, Reply, Send } from 'lucide-react';
import { AttachCircle, CloseCircle } from 'iconsax-react';
import { useFormik } from 'formik';
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { formatDate } from 'src/utils/format-time-currency';

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
  const handleFileUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const formik = useFormik<ReplyProps>({
    initialValues: {
      content: '',
      attachments: [] as File[]
    },
    onSubmit: (values) => {
      console.log(values);
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
    <Stack>
      {!toReply && (
        <Box display={'flex'} alignItems={'center'} gap={1} mb={1}>
          <Typography variant='body2' color='textSecondary'>
            {formatDate(createdAt as Date)}
          </Typography>
          <Typography textTransform={'uppercase'}>- {name}</Typography>
          <Typography color='primary' fontWeight={'bold'}>
            {isInitial ? 'Đã tạo' : 'Đã trả lời'}
          </Typography>
        </Box>
      )}
      <Box display={'flex'} gap={1}>
        <Avatar src={avatarUrl} />
        <Stack direction={'column'} gap={0.5}>
          <Typography variant='body2' color='primary'>
            {name}
          </Typography>
          {toReply ? (
            <Box display={'flex'} flexDirection={'column'} gap={1} width={'100%'}>
              <Typography>Viết trả lời</Typography>
              <Box width={'100%'}>
                <Editor
                  apiKey='7r36cdzlp8ih2st3kprwlax549cs79vpuvqlqdjsnq4k7t3z'
                  initialValue=''
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: ['advlist autolink lists link charmap preview'],
                    toolbar:
                      'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link',
                    content_style: 'body { font-family:Arial; font-size:14px; }'
                  }}
                  style={{ width: '100%' }}
                />
              </Box>
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
            <>
              <Typography variant='body2'>{content}</Typography>
              <Stack direction={'row'} gap={1}>
                {attachments?.map((attachment, index) => (
                  <Typography key={index} variant='body2' color='primary'>
                    {attachment}
                  </Typography>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

const TicketDetailHistory: React.FC<TicketDetailHistoryProps> = ({ ticket }) => {
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const ticketOwnerInfo: TicketHeaderItemProps[] = useMemo(() => {
    return [
      {
        title: 'Đã được tạo',
        value: formatDate(ticket?.createdAt as Date)
      },
      {
        title: 'Bởi',
        value:
          user?.lastName + ' ' + user?.firstName ||
          firebaseUser?.lastName + ' ' + firebaseUser?.firstName ||
          ''
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
          <Printer className='cursor-pointer' size={20} onClick={() => window.print()} />
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
        name={ticket?.studentId}
        avatarUrl={ticket?.studentId}
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
              name={reply.userId}
              avatarUrl={reply.userId}
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
    </Box>
  );
};

export default TicketDetailHistory;
