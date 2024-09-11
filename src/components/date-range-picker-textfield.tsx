import { CalendarToday } from '@mui/icons-material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Dialog, IconButton, InputAdornment, TextField } from '@mui/material';
import { addDays } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
import { DateRangePicker } from 'mui-daterange-picker';
import { DateRangePickerWrapperProps } from 'mui-daterange-picker/dist/components/DateRangePickerWrapper';
import { useState } from 'react';

interface DateRangePickerSubProps {
  labelHolder?: string;
  hideCloseIcon?: boolean;
  textAlign?: string;
}

function DateRangePickerTextField(
  props: Omit<DateRangePickerWrapperProps, 'toggle' | 'open'> & DateRangePickerSubProps
) {
  const [inputDialogOpen, setInputDialogOpen] = useState(false);
  return (
    <>
      <TextField
        label={props.labelHolder}
        fullWidth
        value={`${props.initialDateRange?.startDate?.toLocaleDateString('vi-VN') || ''} - ${
          props.initialDateRange?.endDate?.toLocaleDateString('vi-VN') || ''
        }`}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start' sx={{ display: 'flex', justifyContent: 'center' }}>
              <CalendarToday />
            </InputAdornment>
          ),
          endAdornment: !props.hideCloseIcon && (
            <InputAdornment position='end'>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  props.onChange({});
                }}
                sx={{
                  display:
                    props.initialDateRange?.startDate || props.initialDateRange?.endDate
                      ? 'flex'
                      : 'none',
                  alignItems: 'center'
                }}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        onClick={() => {
          setInputDialogOpen(true);
        }}
      />

      <Dialog
        open={inputDialogOpen}
        onClose={() => {
          setInputDialogOpen(false);
        }}
      >
        <DateRangePicker
          definedRanges={[]}
          toggle={() => {
            setInputDialogOpen(!inputDialogOpen);
          }}
          initialDateRange={props.initialDateRange}
          open={inputDialogOpen}
          onChange={(date) => {
            props.onChange({
              startDate: date.startDate,
              endDate: date.endDate ? new Date(addDays(date.endDate, 1).getTime() - 1) : undefined
            });
            setInputDialogOpen(false);
          }}
          locale={viLocale}
        />
      </Dialog>
    </>
  );
}

export default DateRangePickerTextField;
