import { Edit } from '@mui/icons-material';
import { TableCellProps, TableCell, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import { format } from 'date-fns';
import { useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import useFunction from 'src/hooks/use-function';
import { getObjectValue } from 'src/utils/obj-helper';
import { CardTableConfig } from './card-table-types';

export function CardTableCell<P, T extends { id: P; [key: string]: any }>({
  data,
  config,
  onUpdate,
  cellProps
}: {
  data: T;
  config: CardTableConfig<P, T>;
  onUpdate: (value: any) => Promise<any>;
  cellProps?: TableCellProps;
}) {
  const [editing, setEditing] = useState(false);
  const [editingValue, setEditingValue] = useState<any>();
  const [color, setColor] = useState('');

  const cellValue =
    typeof config.key === 'string' ? getObjectValue(data, config.key) : data[config.key];

  const handleUpdate = useCallback(
    async (value: any): Promise<any> => {
      await onUpdate(value);
      setEditing(false);
    },
    [onUpdate]
  );

  const handleStartEdit = useCallback(() => {
    setEditing(true);
    setEditingValue(cellValue);
  }, [cellValue]);

  const handleCancelEdit = useCallback(() => setEditing(false), []);
  const handleUpdateHelper = useFunction(handleUpdate, {
    onSuccess: () => setColor('success.lightest'),
    onError: () => setColor('error.lightest')
  });

  const content = useMemo((): ReactNode => {
    return config.renderCell
      ? config.renderCell(data, handleStartEdit)
      : config.type == 'date'
        ? cellValue
          ? format(new Date(cellValue), 'dd/MM/yyyy')
          : '--'
        : config.type == 'datetime'
          ? cellValue
            ? format(new Date(cellValue), 'dd/MM/yyyy HH:mm')
            : '--'
          : config.type == 'number' || config.type == 'float'
            ? cellValue
              ? Number(cellValue).toLocaleString('vi-VN')
              : '--'
            : String(cellValue || '--');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, data, handleStartEdit, cellValue]);

  useEffect(() => {
    if (color) {
      setTimeout(() => setColor(''), 200);
    }
  }, [color]);

  if (editing && config.renderEditingCell) {
    return (
      <TableCell {...cellProps} {...config.cellProps}>
        {config.renderEditingCell(
          editingValue,
          setEditingValue,
          handleUpdateHelper.loading,
          cellValue || '',
          handleUpdateHelper.call,
          handleCancelEdit,
          config.type
        )}
      </TableCell>
    );
  }

  return (
    <TableCell
      align={config.type == 'number' || config.type == 'float' ? 'right' : 'left'}
      {...cellProps}
      sx={{
        bgcolor: color,
        transition: color ? undefined : 'background-color ease 2s',
        px: 2,
        ...cellProps?.sx,
        overflow: 'hidden'
      }}
      {...config.cellProps}
    >
      {config.renderEditingCell ? (
        <Stack direction='row' alignItems='center' justifyContent='flex-end' sx={{ my: -1 }}>
          {content}
          <IconButton onClick={handleStartEdit} color='primary'>
            <Edit fontSize='small' />
          </IconButton>
        </Stack>
      ) : (
        <>{content}</>
      )}
    </TableCell>
  );
}
