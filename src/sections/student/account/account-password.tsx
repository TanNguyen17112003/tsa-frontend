import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import { Stack } from '@mui/system';
import { LockCircle } from 'iconsax-react';
import React from 'react';
import { useDialog } from 'src/hooks/use-dialog';
import ChangePasswordDialog from './account-password-dialog';

function AccountPassword() {
  const changePasswordDialog = useDialog();

  return (
    <>
      <Card className='bg-white'>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant='h6'>Mật khẩu</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack
                spacing={3}
                sx={{
                  flex: 1
                }}
              >
                <Typography sx={{ fontWeight: '600', marginBottom: '-22px !important' }}>
                  Mật khẩu:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2
                  }}
                >
                  <TextField
                    type='password'
                    defaultValue='123456'
                    disabled
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LockCircle variant='Bold' />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() => {
                      changePasswordDialog.handleOpen();
                    }}
                  >
                    Sửa
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <ChangePasswordDialog
        open={changePasswordDialog.open}
        onClose={changePasswordDialog.handleClose}
      />
    </>
  );
}

export default AccountPassword;
