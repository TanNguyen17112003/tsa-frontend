import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  DialogProps,
  Typography,
  Divider,
  IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import useFunction from 'src/hooks/use-function';
import { useFormik } from 'formik';
import { UserDetail, UserRole } from 'src/types/user';
import { UsersApi } from 'src/api/users';

function UpdateRoleDialog({
  user,
  ...dialogProps
}: DialogProps & {
  user: UserDetail;
}) {
  const [userId, setUserId] = useState<string | undefined>(user?.id);
  const getListUsersApi = useFunction(UsersApi.getUsers);
  const roleList = useMemo(() => {
    return user?.role === 'STUDENT'
      ? [
          { label: 'Nhân viên', value: 'STAFF' },
          { label: 'Quản trị viên', value: 'ADMIN' }
        ]
      : [{ label: 'Quản trị viên', value: 'ADMIN' }];
  }, [user?.role]);

  const onConfirm = useCallback(
    async (values: { role: UserRole }) => {
      if (!userId) {
        console.error('User ID is not available');
        return;
      }
      try {
        await UsersApi.updateUserRole(userId, values.role);
        getListUsersApi.setData(
          (getListUsersApi.data || []).map((user) =>
            user.id == userId ? Object.assign(user, { role: values.role }) : user
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [userId, getListUsersApi.data]
  );

  const onConfirmHelper = useFunction(onConfirm, {
    successMessage: 'Cập nhật vai trò thành công!'
  });

  const formik = useFormik({
    initialValues: {
      role: user?.role as UserRole
    },
    onSubmit: async (values) => {
      await onConfirmHelper.call(values);
    }
  });

  useEffect(() => {
    setUserId(user?.id);
  }, [user?.id]);

  useEffect(() => {
    getListUsersApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Dialog fullWidth maxWidth='xs' {...dialogProps}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            py: 1
          }}
        >
          <Typography variant='h6'>
            Nâng cấp vai trò {user?.role === 'STUDENT' ? 'sinh viên ' : 'nhân viên '}{' '}
            {user?.lastName} {user?.firstName}
          </Typography>
          <IconButton
            edge='end'
            color='inherit'
            onClick={() => {
              dialogProps.onClose?.({}, 'escapeKeyDown');
            }}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'} gap={3}>
          <Stack spacing={2}>
            <Typography variant='h6'>Danh sách vai trò phù hợp</Typography>
            <FormControl fullWidth>
              <InputLabel id='role-select-label'>Chọn vai trò</InputLabel>
              <Select
                labelId='role-select-label'
                value={formik.values.role}
                onChange={formik.handleChange}
                name='role'
                label='Chọn vai trò'
              >
                {roleList.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Divider />
        </Box>
      </DialogContent>
      <DialogActions className='flex justify-center'>
        <Button
          variant='contained'
          color={'inherit'}
          onClick={(e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
          }}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={async (e) => {
            await formik.handleSubmit();
            dialogProps.onClose?.(e, 'escapeKeyDown');
          }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateRoleDialog;
