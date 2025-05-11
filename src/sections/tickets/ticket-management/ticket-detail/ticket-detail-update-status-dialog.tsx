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
  TextField,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import React, { useCallback, useState } from 'react';
import useFunction from 'src/hooks/use-function';
import { useTicketsContext } from 'src/contexts/tickets/tickets-context';
import { TicketDetail, TicketStatus, TicketType, ticketStatusMap } from 'src/types/ticket';
import LoadingProcess from 'src/components/LoadingProcess';

function TicketDetailUpdateStatusDialog({
  ticket,
  ...dialogProps
}: DialogProps & {
  ticket: TicketDetail;
}) {
  const { updateStatusTicket } = useTicketsContext();
  const [status, setStatus] = useState<TicketStatus>(ticket?.status);
  const onConfirm = useCallback(async () => {
    await updateStatusTicket(ticket.id, status);
  }, [status, ticket, updateStatusTicket]);
  const onConfirmHelper = useFunction(onConfirm!, {
    successMessage: 'Cập nhật trạng thái câu hỏi thành công!'
  });

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
          <Typography variant='h6'>Cập nhật trạng thái</Typography>
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
      <DialogContent>
        <Box display={'flex'} flexDirection={'column'} gap={3}>
          <Stack spacing={1}>
            <FormControl fullWidth>
              <InputLabel id='staff-select-label'>Chọn trạng thái</InputLabel>
              <Select
                labelId='staff-select-label'
                value={status}
                onChange={(event) => setStatus(event.target.value as TicketStatus)}
                label='Chọn nhân viên'
              >
                {Object.entries(ticketStatusMap).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
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
          disabled={onConfirmHelper.loading}
          color='primary'
          onClick={async (e) => {
            await onConfirmHelper.call(e);
            dialogProps.onClose?.(e, 'escapeKeyDown');
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
      {onConfirmHelper.loading && <LoadingProcess />}
    </Dialog>
  );
}

export default TicketDetailUpdateStatusDialog;
