import { useMemo } from 'react';
import { CustomTableHeaderCell } from './custom-table-header-cell';
import { CustomTableProps, CustomTableSortModel } from './custom-table.types';
import { CustomTableResizableCell } from './custom-table-resizable-cell';
import clsx from 'clsx';
import { Checkbox } from '../shadcn/ui/checkbox';

export function CustomTableHeader<P, T extends { id: P; [key: string]: any }>(
  props: CustomTableProps<P, T> & {
    sortModel?: CustomTableSortModel<P, T>;
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
    onClickRevert,
    indexColumn,
    select,
    stickyHeader,
    flexible
  } = props;

  const hasGroupedHeaderLabel = useMemo(() => configs.some((c) => c.groupedHeaderLabel), [configs]);

  return (
    <thead className={clsx('rounded-md border', stickyHeader ? 'sticky -top-1 z-10' : '')}>
      <tr className='rounded-md border'>
        {(indexColumn || select) && (
          <CustomTableResizableCell
            className='text-nowrap py-2'
            rowSpan={hasGroupedHeaderLabel ? 2 : 1}
            disableResize
          >
            <div className='flex gap-1 items-center pl-1'>
              {select && (
                <Checkbox
                  checked={select.selected.length > 0 && select.selected.length >= rows.length}
                  onCheckedChange={(checked) =>
                    checked ? select.handleSelectAll() : select.handleDeselectAll()
                  }
                />
              )}
              {indexColumn && <>STT</>}
            </div>
          </CustomTableResizableCell>
        )}
        {configs.map((config, index) =>
          index == 0 ||
          !config.groupedHeaderLabel ||
          config.groupedHeaderLabel != configs[index - 1].groupedHeaderLabel ? (
            <CustomTableHeaderCell
              key={config.key.toString()}
              {...props}
              hasGroupedHeaderLabel={hasGroupedHeaderLabel}
              config={config}
            />
          ) : null
        )}

        {(actions ||
          onClickDelete ||
          onClickDetail ||
          onClickEdit ||
          onClickRevert ||
          renderRowActions) && (
          <th
            className='w-[120px] py-3 px-2'
            align='center'
            rowSpan={hasGroupedHeaderLabel ? 2 : 1}
          >
            {actions || onClickRevert ? 'Hoàn tác' : ''}
          </th>
        )}
      </tr>
      {hasGroupedHeaderLabel && (
        <tr className='rounded-md border'>
          {configs.map((config) =>
            config.groupedHeaderLabel ? (
              <th
                key={config.key.toString()}
                className={clsx('text-nowrap py-3 px-2', config.headerCellClassName)}
              >
                <div className='flex gap-1 items-center'>
                  {config.headerIcon}
                  {config.headerLabel}
                </div>
              </th>
            ) : null
          )}
        </tr>
      )}
    </thead>
  );
}
