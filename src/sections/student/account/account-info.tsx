import { Box, Typography, Button, TextField, Grid, Card, CardContent } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import AccountInfoEditField from './account-info-edit-field';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';

function ProfileSection() {
  const [isEditName, setIsEditName] = useState(false);
  const [isEditEmail, setIsEditEmail] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [isEditPhone, setIsEditPhone] = useState(false);

  const { user } = useAuth();
  return (
    <Card className='bg-white border border-1'>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Quản lý thông tin</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack
              spacing={3}
              sx={{
                flex: 1
              }}
            >
              <AccountInfoEditField
                label='Tên tài khoản'
                defaultValue={user?.lastName + ' ' + user?.firstName}
                isEdit={isEditName}
                setIsEdit={setIsEditName}
              />
              <AccountInfoEditField
                label='Thời gian tạo tài khoản'
                defaultValue={formatUnixTimestamp(user?.createdAt as string)}
                disabled
              />
              <AccountInfoEditField
                label='Email'
                defaultValue={user?.email as string}
                isEdit={isEditEmail}
                setIsEdit={setIsEditEmail}
              />
              <AccountInfoEditField
                label='Địa chỉ'
                defaultValue={'sad'}
                isEdit={isEditAddress}
                setIsEdit={setIsEditAddress}
              />
              <AccountInfoEditField
                label='Số điện thoại'
                defaultValue={user?.phoneNumber as string}
                isEdit={isEditPhone}
                setIsEdit={setIsEditPhone}
              />
              <AccountInfoEditField label='Chức vụ' defaultValue='Sinh viên' disabled />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProfileSection;
