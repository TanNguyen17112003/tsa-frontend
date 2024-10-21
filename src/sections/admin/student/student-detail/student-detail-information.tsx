import React from 'react';
import { Card, Typography, Avatar, Stack, Box } from '@mui/material';
import { UserDetail } from 'src/types/user';
import { Messages1 } from 'iconsax-react';

interface StudentDetailInformationProps {
  info: UserDetail;
}

const StudentDetailInformation: React.FC<StudentDetailInformationProps> = ({ info }) => {
  return (
    <Card className='relative overflow-hidden h-full'>
      <Box className='w-full h-32 bg-green-400 rounded-b-full relative'>
        <Avatar className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-30 h-30 border-4 border-white' />
      </Box>
      <Stack direction='column' spacing={2} className='p-4 mt-5' alignItems={'center'}>
        <Stack>
          <Typography variant='h5' align='center'>
            {info?.lastName + ' ' + info?.firstName}
          </Typography>
          <Typography variant='body2' align='center' className='text-green-400' fontWeight={'bold'}>
            Vai trò: Sinh viên
          </Typography>
        </Stack>
        <Box className='grid grid-cols-2 gap-4 w-[80%]'>
          <Typography variant='subtitle2' className='text-center text-green-400'>
            SĐT:
          </Typography>
          <Typography variant='subtitle2'>{info?.phoneNumber}</Typography>
          <Typography variant='subtitle2' className='text-center text-green-400'>
            Địa chỉ:
          </Typography>
          <Typography variant='subtitle2'>{`Phòng ${info?.room}, Tòa ${info?.building}, KTX Khu ${info?.dormitory}`}</Typography>
        </Box>
        <Stack alignItems={'center'} className='cursor-pointer'>
          <Messages1 size={32} />
          <Typography variant='subtitle2' className='text-green-400'>
            Liên hệ
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default StudentDetailInformation;
