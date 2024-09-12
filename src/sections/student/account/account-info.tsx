import { Box, Typography, Button, TextField, Grid, Card, CardContent } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import AccountInfoEditField from './account-info-edit-field';

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
                defaultValue='Tan Nguyen'
                isEdit={isEditName}
                setIsEdit={setIsEditName}
              />
              <AccountInfoEditField label='Ngày sinh' defaultValue='17/11/2003' disabled />
              <AccountInfoEditField
                label='Email'
                defaultValue='duytan17112003@gmail.com'
                isEdit={isEditEmail}
                setIsEdit={setIsEditEmail}
              />
              <AccountInfoEditField
                label='Địa chỉ'
                defaultValue='Phòng 312, Tòa A20, KTX Khu A, ĐHQG TP.HCM'
                isEdit={isEditAddress}
                setIsEdit={setIsEditAddress}
              />
              <AccountInfoEditField
                label='Số điện thoại'
                defaultValue='0862898859'
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
