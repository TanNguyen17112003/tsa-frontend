import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Paper,
  Divider
} from '@mui/material';
import { Edit, Save, Add, Delete, Close } from '@mui/icons-material';
import React, { useMemo, useState } from 'react';
import { useRegulationsContext } from 'src/contexts/regulations/regulations-context';
import { Ban, Calendar } from 'lucide-react';
import useFunction from 'src/hooks/use-function';

interface RegulationProps {
  dormitoryName: string;
}

const Regulation: React.FC<RegulationProps> = ({ dormitoryName }) => {
  const {
    getRegulationsApi,
    updateRegulationBanThreshold,
    createRegulationTimeSlot,
    updateRegulationTimeSlot,
    deleteRegulationTimeSlot
  } = useRegulationsContext();
  const regulation = useMemo(() => {
    return (getRegulationsApi.data || []).find((regulation) => regulation.name === dormitoryName);
  }, [dormitoryName, getRegulationsApi.data]);

  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [banThresholdValue, setBanThresholdValue] = useState(regulation?.banThreshold || 0);
  const [thresholdLoading, setThresholdLoading] = useState(false);

  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotEdits, setSlotEdits] = useState<{
    [id: string]: { startTime: string; endTime: string };
  }>({});
  const [slotLoading, setSlotLoading] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState<{ startTime: string; endTime: string }>({
    startTime: '',
    endTime: ''
  });
  const [addSlotLoading, setAddSlotLoading] = useState(false);

  const handleSaveThreshold = async () => {
    if (!regulation) return;
    setThresholdLoading(true);
    try {
      await updateRegulationBanThreshold(regulation.id, { banThreshold: banThresholdValue });
      setIsEditingThreshold(false);
    } finally {
      setThresholdLoading(false);
    }
  };

  const handleEditSlot = (slotId: string, startTime: string, endTime: string) => {
    setEditingSlotId(slotId);
    setSlotEdits({ [slotId]: { startTime, endTime } });
  };

  const handleSaveSlot = async (slotId: string) => {
    if (!regulation) return;
    setSlotLoading(slotId);
    try {
      await updateRegulationTimeSlot(regulation.id, {
        ...slotEdits[slotId],
        id: slotId as any
      } as any);
      setEditingSlotId(null);
      setSlotEdits({});
    } finally {
      setSlotLoading(null);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!regulation) return;
    setSlotLoading(slotId);
    try {
      await deleteRegulationTimeSlot(regulation.id, slotId);
    } finally {
      setSlotLoading(null);
    }
  };

  const handleAddSlot = async () => {
    if (!regulation) return;
    setAddSlotLoading(true);
    try {
      await createRegulationTimeSlot(regulation.id, newSlot);
      setNewSlot({ startTime: '', endTime: '' });
    } finally {
      setAddSlotLoading(false);
    }
  };

  const handleAddSlotHelper = useFunction(handleAddSlot, {
    successMessage: 'Thêm khung giờ thành công'
  });

  const handleSaveSlotHelper = useFunction(handleSaveSlot, {
    successMessage: 'Cập nhật khung giờ thành công'
  });

  const handleDeleteSlotHelper = useFunction(handleDeleteSlot, {
    successMessage: 'Xóa khung giờ thành công'
  });

  const handleSaveThresholdHelper = useFunction(handleSaveThreshold, {
    successMessage: 'Cập nhật ngưỡng cấm thành công'
  });

  if (!regulation) return <Typography>Không tìm thấy quy định cho ký túc xá này.</Typography>;

  return (
    <Paper sx={{ p: 3, margin: '0 auto' }}>
      <Typography variant='h6' mb={2}>
        Quy định ký túc xá: {regulation.name}
      </Typography>
      <Stack spacing={2} mb={2}>
        <Box display={'flex'} alignContent={'center'} gap={1}>
          <Ban color='red' />
          <Typography variant='subtitle1' fontWeight={'bold'} color='red'>
            Ngưỡng cấm:
          </Typography>
        </Box>
        {isEditingThreshold ? (
          <>
            <TextField
              type='number'
              size='small'
              value={banThresholdValue}
              onChange={(e) => setBanThresholdValue(Number(e.target.value))}
              fullWidth
              variant='filled'
            />
            <Button
              variant='contained'
              size='small'
              onClick={handleSaveThresholdHelper.call}
              disabled={thresholdLoading}
            >
              Lưu
            </Button>
            <Button
              variant='text'
              size='small'
              onClick={() => {
                setIsEditingThreshold(false);
                setBanThresholdValue(regulation.banThreshold);
              }}
              disabled={thresholdLoading}
            >
              Hủy
            </Button>
          </>
        ) : (
          <>
            <Typography>{regulation.banThreshold}</Typography>
            <Button variant='text' size='small' onClick={() => setIsEditingThreshold(true)}>
              Sửa
            </Button>
          </>
        )}
      </Stack>
      <Divider />
      <Box display={'flex'} alignContent={'center'} gap={1} my={3}>
        <Calendar color='blue' />
        <Typography variant='subtitle1' mb={1} fontWeight={'bold'} color='blue'>
          Khung giờ giao nhận:
        </Typography>
      </Box>
      <Stack spacing={2}>
        {regulation.deliverySlots?.map((slot) => (
          <Stack key={slot.id} direction='row' alignItems='center' spacing={1} minWidth={300}>
            {editingSlotId === slot.id ? (
              <>
                <TextField
                  label='Bắt đầu'
                  type='time'
                  size='small'
                  value={slotEdits[slot.id]?.startTime || ''}
                  onChange={(e) =>
                    setSlotEdits((edits) => ({
                      ...edits,
                      [slot.id]: { ...edits[slot.id], startTime: e.target.value }
                    }))
                  }
                  sx={{ width: 120 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label='Kết thúc'
                  type='time'
                  size='small'
                  value={slotEdits[slot.id]?.endTime || ''}
                  onChange={(e) =>
                    setSlotEdits((edits) => ({
                      ...edits,
                      [slot.id]: { ...edits[slot.id], endTime: e.target.value }
                    }))
                  }
                  sx={{ width: 120 }}
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleSaveSlotHelper.call(slot.id)}
                  disabled={slotLoading === slot.id}
                >
                  Lưu
                </Button>
                <Button
                  variant='text'
                  size='small'
                  onClick={() => setEditingSlotId(null)}
                  disabled={slotLoading === slot.id}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Box minWidth={150}>
                  <Typography>
                    {slot.startTime} - {slot.endTime}
                  </Typography>
                </Box>
                <Button
                  variant='text'
                  size='small'
                  onClick={() => handleEditSlot(slot.id, slot.startTime, slot.endTime)}
                >
                  Sửa
                </Button>
                <IconButton
                  color='error'
                  size='small'
                  onClick={() => handleDeleteSlotHelper.call(slot.id)}
                  disabled={slotLoading === slot.id}
                >
                  <Delete fontSize='small' />
                </IconButton>
              </>
            )}
          </Stack>
        ))}
        <Stack direction='row' alignItems='center' spacing={1} mt={2}>
          <TextField
            label='Bắt đầu'
            type='time'
            size='small'
            value={newSlot.startTime}
            onChange={(e) => setNewSlot((slot) => ({ ...slot, startTime: e.target.value }))}
            sx={{ width: 120 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='Kết thúc'
            type='time'
            size='small'
            value={newSlot.endTime}
            onChange={(e) => setNewSlot((slot) => ({ ...slot, endTime: e.target.value }))}
            sx={{ width: 120 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant='contained'
            size='small'
            startIcon={<Add />}
            onClick={handleAddSlotHelper.call}
            disabled={addSlotLoading || !newSlot.startTime || !newSlot.endTime}
          >
            Thêm khung giờ
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Regulation;
