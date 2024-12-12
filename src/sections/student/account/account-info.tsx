import { Box, Typography, Grid, Card, CardContent, Avatar, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useCallback, useMemo, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { useFirebaseAuth } from 'src/hooks/use-auth';
import AccountInfoEditField from './account-info-edit-field';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';
import { AddressData } from '@utils';
import { Camera } from 'iconsax-react';
import UploadImageDialog from './upload-image-dialog';
import { UploadImagesApi } from 'src/api/upload-images';

function ProfileSection() {
  const { updateProfile, user } = useAuth();
  const { user: firebaseUser, updateProfile: updateFirebaseProfile } = useFirebaseAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dormitoryList = useMemo(() => {
    return AddressData.dormitories;
  }, [AddressData]);
  const buildingList = useMemo(() => {
    return firebaseUser?.dormitory === 'A' || user?.dormitory === 'A'
      ? AddressData.buildings.A
      : AddressData.buildings.B;
  }, [user?.dormitory, firebaseUser?.dormitory]);
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
          if (user && updateProfile) {
            console.log(1);
            await updateProfile({ [field]: value });
          }
          if (firebaseUser && updateFirebaseProfile) {
            console.log(2);
            await updateFirebaseProfile({ [field]: value });
          }
        }
      } catch (error) {
        throw error;
      }
    },
    [updateProfile, user, firebaseUser, updateFirebaseProfile]
  );

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        const uploadedImage = await UploadImagesApi.postImage(file);
        if (uploadedImage && uploadedImage.url) {
          if (user && updateProfile) {
            await updateProfile({ photoUrl: uploadedImage.url });
          }
          if (firebaseUser && updateFirebaseProfile) {
            await updateFirebaseProfile({ photoUrl: uploadedImage.url });
          }
        }
      } catch (error) {
        throw error;
      }
    },
    [updateProfile, user, firebaseUser, updateFirebaseProfile]
  );

  return (
    <Card className='bg-white border border-1'>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Quản lý thông tin</Typography>
            <Stack marginTop={5} alignItems='center' spacing={3}>
              <Box position='relative'>
                <Avatar
                  src={user?.photoUrl || firebaseUser?.photoUrl || ''}
                  sx={{ width: 200, height: 200 }}
                  className='border-2 border-black-700'
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }}
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Camera />
                </IconButton>
              </Box>
              <Typography fontStyle={'italic'} fontSize={14}>
                *Cập nhật ảnh đại diện
              </Typography>
            </Stack>
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
                value={user?.lastName || firebaseUser?.lastName}
                onSave={async (value) => await handleSave('lastName', value)}
              />
              <AccountInfoEditField
                label='Tên'
                type='text'
                value={user?.firstName || firebaseUser?.firstName}
                onSave={async (value) => await handleSave('firstName', value)}
              />
              {(user?.dormitory || firebaseUser?.dormitory) && (
                <AccountInfoEditField
                  label='Kí túc xá'
                  type='select'
                  value={user?.dormitory || firebaseUser?.dormitory || ''}
                  onSave={async (value) => await handleSave('dormitory', value)}
                  items={dormitoryList}
                />
              )}
              {(user?.building || firebaseUser?.building) && (
                <AccountInfoEditField
                  label='Tòa'
                  type='select'
                  value={user?.building || firebaseUser?.building || ''}
                  onSave={async (value) => await handleSave('building', value)}
                  items={buildingList}
                />
              )}
              {(user?.room || firebaseUser?.room) && (
                <AccountInfoEditField
                  label='Phòng'
                  type='select'
                  value={user?.room || firebaseUser?.room || ''}
                  onSave={async (value) => await handleSave('room', value)}
                  items={roomList}
                />
              )}

              <AccountInfoEditField
                label='Số điện thoại'
                type='text'
                value={user?.phoneNumber || firebaseUser?.phoneNumber || ''}
                onSave={async (value) => await handleSave('phoneNumber', value)}
              />
              <AccountInfoEditField
                label='Thời gian tạo tài khoản'
                value={
                  user?.createdAt
                    ? formatDate(formatUnixTimestamp(user?.createdAt))
                    : firebaseUser?.createdAt
                      ? formatDate(formatUnixTimestamp(firebaseUser?.createdAt))
                      : ''
                }
                disabled
              />
              <AccountInfoEditField
                label='Email'
                type='text'
                value={user?.email || firebaseUser?.email}
                disabled
              />
              <AccountInfoEditField
                label='Chức vụ'
                value={
                  user
                    ? user.role === 'STUDENT'
                      ? 'Sinh viên'
                      : user.role === 'ADMIN'
                        ? 'Quản trị viên'
                        : 'Nhân viên'
                    : firebaseUser
                      ? firebaseUser.role === 'STUDENT'
                        ? 'Sinh viên'
                        : firebaseUser.role === 'ADMIN'
                          ? 'Quản trị viên'
                          : 'Nhân viên'
                      : ''
                }
                disabled
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <UploadImageDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpload={handleUpload}
      />
    </Card>
  );
}

export default ProfileSection;
