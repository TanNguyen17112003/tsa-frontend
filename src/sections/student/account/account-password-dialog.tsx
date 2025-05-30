import {
  Dialog,
  DialogContent,
  Button,
  DialogProps,
  DialogTitle,
  InputAdornment,
  TextField,
  IconButton
} from '@mui/material';
import React, { useState } from 'react';
import { Box, Stack } from '@mui/system';
import { LockCircle } from 'iconsax-react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useFormik } from 'formik';
import { UsersApi } from 'src/api/users';
import useFunction from 'src/hooks/use-function';
import * as Yup from 'yup';

export const updatePasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Mật khẩu cũ không được để trống'),
  newPassword: Yup.string().required('Mật khẩu mới không được để trống'),
  newPasswordConfirm: Yup.string()
    .oneOf([Yup.ref('newPassword'), undefined], 'Mật khẩu không khớp')
    .required('Nhập lại mật khẩu mới không được để trống')
});

function AccountPasswordDialog({ ...props }: DialogProps) {
  const [viewRawOldPassword, setViewRawOldPassword] = useState(false);
  const [viewRawNewPassword, setViewRawNewPassword] = useState(false);
  const [viewRawRetypePassword, setViewRawRetypePassword] = useState(false);
  const updatePasswordApi = useFunction(UsersApi.updatePassword, {
    successMessage: 'Cập nhật mật khẩu thành công!'
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    },
    validationSchema: updatePasswordSchema,
    onSubmit: async (values) => {
      if (values.newPassword != values.newPasswordConfirm) {
        formik.setFieldError('newPasswordConfirm', 'Mật khẩu không khớp');
      }
      const { error } = await updatePasswordApi.call({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      if (!error) {
        formik.resetForm();
        props.onClose?.({}, 'backdropClick');
      }
    }
  });

  return (
    <Dialog
      open={props.open}
      onClose={(e) => props.onClose?.(e, 'backdropClick')}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle>Cập nhật mật khẩu</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              py: 1
            }}
          >
            <TextField
              label='Mật khẩu cũ'
              type={!viewRawOldPassword ? 'password' : 'text'}
              required
              value={formik.values.currentPassword}
              name='currentPassword'
              onChange={formik.handleChange}
              error={formik.touched.currentPassword && !!formik.errors.currentPassword}
              onBlur={formik.handleBlur}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LockCircle variant='Bold' />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        setViewRawOldPassword(!viewRawOldPassword);
                      }}
                    >
                      {viewRawOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label='Mật khẩu mới'
              type={!viewRawNewPassword ? 'password' : 'text'}
              value={formik.values.newPassword}
              name='newPassword'
              error={formik.touched.newPassword && !!formik.errors.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LockCircle variant='Bold' />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        setViewRawNewPassword(!viewRawNewPassword);
                      }}
                    >
                      {viewRawNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label='Nhập lại mật khẩu mới'
              type={!viewRawRetypePassword ? 'password' : 'text'}
              required
              value={formik.values.newPasswordConfirm}
              error={formik.touched.newPasswordConfirm && !!formik.errors.newPasswordConfirm}
              name='newPasswordConfirm'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LockCircle variant='Bold' />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        setViewRawRetypePassword(!viewRawRetypePassword);
                      }}
                    >
                      {viewRawRetypePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 3,
            py: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center'
            }}
          >
            <Button
              color='inherit'
              variant='contained'
              onClick={(e) => props.onClose?.(e, 'backdropClick')}
            >
              Hủy bỏ
            </Button>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Cập nhật
            </Button>
          </Box>
        </Box>
      </form>
    </Dialog>
  );
}

export default AccountPasswordDialog;
