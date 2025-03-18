import { TableSortLabel } from '@mui/material';
import { Stack } from '@mui/system';
import { CardTableConfig, CardTableProps, CardTableSortModel } from './card-table-types';
import { CardTableResizableCell } from './card-table-resizable-cell';

export function CardTableHeaderCell<P, T extends { id: P; [key: string]: any }>(
  props: CardTableProps<P, T> & {
    sortModel?: CardTableSortModel<P, T>;
    onClickSort?: (key: keyof T | string) => void;
    onResize?: () => void;
    hasGroupedHeaderLabel: boolean;
    config: CardTableConfig<P, T>;
  }
) {
  const { hasGroupedHeaderLabel, configs, config, sortModel, onClickSort } = props;

  return (
    <CardTableResizableCell
      {...config.headerCellProps}
      disableResize={!props.flexible}
      onResize={props.onResize}
      sx={{
        whiteSpace: 'nowrap',
        position: 'relative',
        ...config.headerCellProps?.sx
      }}
      rowSpan={!config.groupedHeaderLabel && hasGroupedHeaderLabel ? 2 : 1}
      colSpan={
        !config.groupedHeaderLabel
          ? 1
          : configs.filter((c) => c.groupedHeaderLabel == config.groupedHeaderLabel).length
      }
      align={!config.groupedHeaderLabel ? undefined : 'center'}
    >
      {config.groupedHeaderLabel || (
        <TableSortLabel
          active={sortModel?.key == config.key}
          direction={sortModel?.key == config.key ? sortModel.direction : 'asc'}
          onClick={() => onClickSort?.(config.key)}
        >
          <Stack gap={1} alignItems='center' direction='row'>
            {config.headerIcon}
            {config.headerLabel}
          </Stack>
        </TableSortLabel>
      )}
    </CardTableResizableCell>
  );
}
