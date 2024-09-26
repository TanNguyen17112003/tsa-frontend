import { Box, Typography, Button, TextField, Grid, Card, CardContent } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useCallback, useMemo, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import AccountInfoEditField from './account-info-edit-field';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import { useUsersContext } from '@contexts';
import { AddressData } from '@utils';

function ProfileSection() {
  const { updateProfile, getUsersApi } = useUsersContext();

  const user = useMemo(() => {
    return getUsersApi.data || {};
  }, [getUsersApi.data]);

  const userRole = useMemo(() => {
    return user?.role === 'ADMIN'
      ? 'Quản trị viên'
      : user?.role === 'STUDENT'
        ? 'Sinh viên'
        : 'Nhận viên';
  }, [user]);

  const dormitoryList = useMemo(() => {
    return AddressData.dormitories;
  }, [AddressData]);
  const buildingList = useMemo(() => {
    return user?.dormitory === 'A' ? AddressData.buildings.A : AddressData.buildings.B;
  }, [user?.dormitory]);
  const roomList = useMemo(() => {
    return AddressData.rooms;
  }, [buildingList]);

  const handleSave = useCallback(
    async (
      field: 'lastName' | 'firstName' | 'dormitory' | 'building' | 'room' | 'phoneNumber',
      value: string
    ) => {
      try {
        if (field) {
          await updateProfile({ [field]: value });
        }
      } catch (error) {
        throw error;
      }
    },
    [updateProfile, user]
  );

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
                label='Họ'
                type='text'
                value={user?.lastName}
                onSave={async (value) => await handleSave('lastName', value)}
              />
              <AccountInfoEditField
                label='Tên'
                type='text'
                value={user?.firstName}
                onSave={async (value) => await handleSave('firstName', value)}
              />
              <AccountInfoEditField
                label='Kí túc xá'
                type='select'
                value={user?.dormitory || 'A'}
                onSave={async (value) => await handleSave('dormitory', value)}
                items={dormitoryList}
              />
              <AccountInfoEditField
                label='Tòa'
                type='select'
                value={user?.building || 'A1'}
                onSave={async (value) => await handleSave('building', value)}
                items={buildingList}
              />
              <AccountInfoEditField
                label='Phòng'
                type='select'
                value={user?.room || '101'}
                onSave={async (value) => await handleSave('room', value)}
                items={roomList}
              />
              <AccountInfoEditField
                label='Số điện thoại'
                type='text'
                value={user?.phoneNumber}
                onSave={async (value) => await handleSave('phoneNumber', value)}
              />
              <AccountInfoEditField
                label='Thời gian tạo tài khoản'
                value={user?.createdAt ? formatUnixTimestamp(user.createdAt) : ''}
                disabled
              />
              <AccountInfoEditField label='Email' type='text' value={user?.email} disabled />
              <AccountInfoEditField label='Chức vụ' value={userRole} disabled />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProfileSection;
