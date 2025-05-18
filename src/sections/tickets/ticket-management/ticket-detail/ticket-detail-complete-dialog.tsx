import { Dialog, DialogTitle, DialogActions, Button, DialogProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback } from 'react';
import useFunction from 'src/hooks/use-function';
import { TicketDetail } from 'src/types/ticket';
import { useTicketsContext } from 'src/contexts/tickets/tickets-context';

function TicketDetailCompleteDialog({
  ticket,
  ...dialogProps
}: DialogProps & {
  ticket: TicketDetail;
}) {
  const { updateStatusTicket } = useTicketsContext();
  const onConfirm = useCallback(async () => {
    await updateStatusTicket(ticket.id, 'CLOSED');
  }, [status, ticket, updateStatusTicket]);
  const onConfirmHelper = useFunction(onConfirm!, {
    successMessage: 'Hoàn thành ticket thành công'
  });

  return (
    <Dialog fullWidth maxWidth='xs' {...dialogProps}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant='h6'>Bạn có chắc muốn hoàn thành ticket này không?</Typography>
        </Box>
      </DialogTitle>

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
          color='success'
          onClick={async (e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
            await onConfirmHelper.call({});
          }}
        >
          Hoàn thành
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketDetailCompleteDialog;
