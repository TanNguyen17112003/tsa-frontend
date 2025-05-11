import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  Card,
  Checkbox,
  Stack,
  TablePagination,
  IconButton,
  Button,
  Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';
import { Delete, Edit, Warning } from '@mui/icons-material';
import { Scrollbar } from '../scrollbar';
import { CardTableHeader } from './card-table-header';
import { CardTableCell } from './card-table-cell';
import { CardTableProps, CardTableSortModel } from './card-table-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isValid } from 'date-fns';
import { getObjectValue } from 'src/utils/obj-helper';
import LoadingProcess from '../LoadingProcess';

export function CardTable<P, T extends { id: P; [key: string]: any }>(props: CardTableProps<P, T>) {
  const {
    rows,
    configs,
    actions,
    renderRowActions,
    cellProps,
    tableProps,
    cardProps,
    scrollbarProps,
    children,
    onClickRow,
    onClickEdit,
    onClickDelete,
    onClickDetail,
    onUpdate,
    indexColumn,
    select,
    pagination,
    additionalTopRow,
    additionalBottomRow,
    loading,
    flexible
  } = props;

  const [sortModel, setSortModel] = useState<CardTableSortModel<P, T>>();
  const [isMounted, setIsMounted] = useState(false);

  const sortedRows = useMemo(() => {
    const config = configs.find((c) => c.key == sortModel?.key);
    if (!sortModel || !config) {
      return rows;
    }
    const sortDirection = sortModel.direction == 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const valueA = getObjectValue(a, sortModel.key);
      const valueB = getObjectValue(b, sortModel.key);
      if (!valueA) return 1;
      if (!valueB) return -1;
      if (config.type == 'date' || config.type == 'datetime') {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;
        return (dateA.getTime() - dateB.getTime()) * sortDirection;
      }
      if (config.type == 'number' || config.type == 'float') {
        return (Number(valueA) - Number(valueB)) * sortDirection;
      }
      return String(valueA).localeCompare(String(valueB)) * sortDirection;
    });
  }, [configs, rows, sortModel]);

  const pagedRows = useMemo(() => {
    return pagination
      ? sortedRows.slice(
          pagination.rowsPerPage * pagination.page,
          pagination.rowsPerPage * (pagination.page + 1)
        )
      : sortedRows;
  }, [pagination, sortedRows]);

  const handleClickSort = useCallback(
    (key: keyof T | string) => {
      if (key == sortModel?.key && sortModel.direction == 'desc') {
        setSortModel(undefined);
      } else {
        setSortModel({
          key: key,
          direction: sortModel?.key != key ? 'asc' : 'desc'
        });
      }
    },
    [sortModel?.direction, sortModel?.key]
  );

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 1000);
  }, []);

  return (
    <Card elevation={24} {...cardProps}>
      {children}
      <Scrollbar {...scrollbarProps}>
        <Table
          {...tableProps}
          sx={{
            minWidth: 700,
            // display: isMounted ? "inline-table" : undefined,
            position: 'relative',
            tableLayout: isMounted && flexible ? 'fixed' : undefined,
            ...tableProps?.sx
          }}
        >
          <CardTableHeader {...props} sortModel={sortModel} onClickSort={handleClickSort} />
          <TableBody>
            {additionalTopRow}
            {pagedRows.map((row, index) => (
              <TableRow
                hover={!!onClickRow}
                onClick={onClickRow ? () => onClickRow(row, index) : undefined}
                key={row.id + '-key-' + index}
                sx={{
                  whiteSpace: 'nowrap',
                  px: 2,
                  bgcolor: row.error ? 'error.lightest' : undefined,
                  cursor: onClickRow ? 'pointer' : undefined
                }}
              >
                {(indexColumn || select) && (
                  <TableCell onClick={(e) => e.stopPropagation()} {...cellProps}>
                    <Stack direction='row' gap={1} alignItems='center'>
                      {select && (
                        <Checkbox
                          sx={{ my: -1, mx: -0.5 }}
                          checked={select.selected.includes(row)}
                          onChange={(e, checked) =>
                            checked ? select.handleSelectOne(row) : select.handleDeselectOne(row)
                          }
                        />
                      )}
                      {indexColumn && <>{index + 1}</>}
                      {row.error && (
                        <Tooltip title={row.error}>
                          <Warning color='error' />
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                )}
                {configs.map((config) => (
                  <CardTableCell
                    key={config.key.toString()}
                    cellProps={cellProps}
                    data={row}
                    config={config}
                    onUpdate={async (value) => await onUpdate?.(config.key, value, row, index)}
                  />
                ))}

                {(onClickDelete || onClickDetail || onClickEdit || renderRowActions) && (
                  <TableCell align='right' onClick={(e) => e.stopPropagation()}>
                    <Stack direction='row' justifyContent='flex-end' my={-0.5}>
                      {renderRowActions?.(row, index)}
                      {onClickEdit && (
                        <IconButton onClick={() => onClickEdit(row, index)}>
                          <Edit sx={{ height: '20px', width: '20px' }} color='primary' />
                        </IconButton>
                      )}
                      {onClickDelete && (
                        <IconButton onClick={() => onClickDelete(row, index)}>
                          <Delete sx={{ height: '20px', width: '20px' }} color='inherit' />
                        </IconButton>
                      )}
                      {onClickDetail && (
                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={() => onClickDetail(row, index)}
                          size='small'
                        >
                          Chi tiết
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {additionalBottomRow}
          </TableBody>
        </Table>
        {(loading || rows.length == 0) && <Stack height={104} />}
      </Scrollbar>
      {(loading || rows.length == 0) && (
        <Stack
          sx={{ pointerEvents: 'none' }}
          marginTop={-12}
          height={104}
          width={'100%'}
          alignItems='center'
          justifyContent='center'
          position='sticky'
          left={0}
        >
          {loading ? (
            <LoadingProcess />
          ) : (
            <Typography variant='subtitle1'>Không có dữ liệu</Typography>
          )}
        </Stack>
      )}
      {pagination && (
        <TablePagination
          component='div'
          {...pagination}
          count={pagination.count}
          rowsPerPageOptions={[5, 10, 25, 100]}
        />
      )}
    </Card>
  );
}
