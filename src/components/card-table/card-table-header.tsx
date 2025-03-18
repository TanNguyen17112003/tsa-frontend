import { TableHead, TableRow, TableCell, Checkbox } from '@mui/material';
import { Stack } from '@mui/system';
import { useMemo } from 'react';
import { CardTableProps, CardTableSortModel } from './card-table-types';
import { CardTableResizableCell } from './card-table-resizable-cell';
import { CardTableHeaderCell } from './card-table-header-cell';

export function CardTableHeader<P, T extends { id: P; [key: string]: any }>(
  props: CardTableProps<P, T> & {
    sortModel?: CardTableSortModel<P, T>;
    onClickSort?: (key: keyof T | string) => void;
    onResized?: () => void;
  }
) {
  const {
    rows,
    configs,
    actions,
    renderRowActions,
    onClickEdit,
    onClickDelete,
    onClickDetail,
    indexColumn,
    select,
    stickyHeader,
    flexible
  } = props;

  const hasGroupedHeaderLabel = useMemo(() => configs.some((c) => c.groupedHeaderLabel), [configs]);

  return (
    <TableHead
      sx={{
        ...(stickyHeader ? { position: 'sticky', top: -1, zIndex: 1 } : {}),
        bgcolor: 'background.paper-tertiary'
      }}
    >
      <TableRow>
        {(indexColumn || select) && (
          <CardTableResizableCell
            onResized={props.onResized}
            sx={{
              whiteSpace: 'nowrap',
              py: 2
            }}
            rowSpan={hasGroupedHeaderLabel ? 2 : 1}
            disableResize={!flexible}
          >
            <Stack direction='row' gap={1} alignItems='center'>
              {select && (
                <Checkbox
                  sx={{ my: -1, mx: -0.5 }}
                  checked={select.selected.length == rows.length}
                  onChange={(e, checked) =>
                    checked ? select.handleSelectAll() : select.handleDeselectAll()
                  }
                />
              )}
              {indexColumn && <>STT</>}
            </Stack>
          </CardTableResizableCell>
        )}
        {configs.map((config, index) =>
          index == 0 ||
          !config.groupedHeaderLabel ||
          config.groupedHeaderLabel != configs[index - 1].groupedHeaderLabel ? (
            <CardTableHeaderCell
              key={config.key.toString()}
              {...props}
              hasGroupedHeaderLabel={hasGroupedHeaderLabel}
              config={config}
            />
          ) : null
        )}

        {(actions || onClickDelete || onClickDetail || onClickEdit || renderRowActions) && (
          <TableCell
            align='center'
            width='120px'
            sx={{ py: 1 }}
            rowSpan={hasGroupedHeaderLabel ? 2 : 1}
          >
            {actions}
          </TableCell>
        )}
      </TableRow>
      {hasGroupedHeaderLabel && (
        <TableRow>
          {configs.map((config) =>
            config.groupedHeaderLabel ? (
              <CardTableResizableCell
                key={config.key.toString()}
                {...config.headerCellProps}
                disableResize={!flexible}
                sx={{
                  whiteSpace: 'nowrap',
                  px: 2,
                  ...config.headerCellProps?.sx
                }}
              >
                <Stack gap={1} alignItems='center' direction='row'>
                  {config.headerIcon}
                  {config.headerLabel}
                </Stack>
              </CardTableResizableCell>
            ) : null
          )}
        </TableRow>
      )}
    </TableHead>
  );
}
