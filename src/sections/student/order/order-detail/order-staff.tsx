import React from 'react';
import { Card, Stack, Typography, Avatar, Button } from '@mui/material';
import { Message } from 'iconsax-react';
import avatarPerson from 'public/ui/person.jpg';

const staffInfo = {
  'Họ và tên': 'Nguyễn Hoàng Duy Tân',
  'Chức vụ': 'Nhân viên giao hàng'
};

function OrderStaff() {
  return (
    <Stack spacing={2}>
      <Typography variant='h6'>Nhân viên phụ trách</Typography>
      <Card className='flex items-center gap-5 py-2 px-3'>
        <Stack alignItems={'center'} spacing={1}>
          <Avatar alt={staffInfo['Họ và tên']} src={avatarPerson.src} className='w-20 h-20' />
          <Button variant='contained' color='success' startIcon={<Message size={24} />}>
            Nhắn tin
          </Button>
        </Stack>
        <Stack spacing={2}>
          {Object.entries(staffInfo).map(([key, value], index) => (
            <Stack key={index} direction='row' justifyContent='space-between' gap={2}>
              <Typography variant='subtitle1' fontWeight={'bold'}>
                {key}:
              </Typography>
              <Typography variant='subtitle1' fontWeight={'regular'}>
                {value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

export default OrderStaff;
