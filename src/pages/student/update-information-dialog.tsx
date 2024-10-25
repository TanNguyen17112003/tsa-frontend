import React, { useCallback, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stack,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AddressData } from '@utils';

export interface InformationProps {
  dormitory: string;
  building: string;
  room: string;
  phoneNumber: string;
}

interface UpdateInformationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InformationProps) => void;
}

const UpdateInformationDialog: React.FC<UpdateInformationDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [dormitory, setDormitory] = useState('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const dormitoryList = useMemo(() => {
    return AddressData.dormitories;
  }, []);
  const buildingList = useMemo(() => {
    return dormitory === 'A' ? AddressData.buildings.A : AddressData.buildings.B;
  }, [dormitory]);
  const roomList = useMemo(() => {
    return AddressData.rooms;
  }, [buildingList]);

  const handleSubmit = useCallback(() => {
    onSubmit({ dormitory, building, room, phoneNumber });
    onClose();
  }, [dormitory, building, room, phoneNumber, onSubmit, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle className='relative'>
        <Typography textAlign={'center'} fontWeight={'bold'} color='primary'>
          Cập nhật thông tin
        </Typography>
        <CloseIcon
          fontSize='medium'
          className='cursor-pointer absolute right-5 top-5'
          onClick={onClose}
        />
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Kí túc xá</InputLabel>
            <Select
              value={dormitory}
              onChange={(e) => setDormitory(e.target.value as string)}
              fullWidth
            >
              {dormitoryList.map((dormitory) => (
                <MenuItem key={dormitory} value={dormitory}>
                  {dormitory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Tòa nhà</InputLabel>
            <Select
              value={building}
              onChange={(e) => setBuilding(e.target.value as string)}
              fullWidth
              disabled={!dormitory}
            >
              {buildingList.map((building) => (
                <MenuItem key={building} value={building}>
                  {building}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Phòng</InputLabel>
            <Select
              value={room}
              onChange={(e) => setRoom(e.target.value as string)}
              fullWidth
              disabled={!building}
            >
              {roomList.map((room) => (
                <MenuItem key={room} value={room}>
                  {room}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label='Số điện thoại'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Hủy
        </Button>
        <Button onClick={handleSubmit} color='primary'>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateInformationDialog;
