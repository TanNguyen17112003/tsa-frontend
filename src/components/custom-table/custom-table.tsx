import { isValid } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getObjectValue } from "src/utils/obj-helper";
import { CustomTableCell } from "./custom-table-cell";
import { CustomTableHeader } from "./custom-table-header";
import { CustomTableProps, CustomTableSortModel } from "./custom-table.types";
import SimpleBar from "simplebar-react";
import { BsPencilSquare, BsTrash2Fill, BsArrowRepeat } from "react-icons/bs";
import clsx from "clsx";
import { IoWarning } from "react-icons/io5";
import Pagination from "../ui/Pagination";
import { Button } from "../shadcn/ui/button";
import { Checkbox } from "../shadcn/ui/checkbox";
import { PiNotePencilBold, PiPencilBold } from "react-icons/pi";
import Loading from "../Loading";

export function CustomTable<P, T extends { id: P; [key: string]: any }>(
  props: CustomTableProps<P, T> &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
) {
  const {
    rows,
    configs,
    actions,
    renderRowActions,
    cellClassName,
    tableClassName,
    scrollbarProps,
    children,
    onClickRow,
    onClickEdit,
    onClickDelete,
    onClickDetail,
    onClickRevert,
    onUpdate,
    indexColumn,
    select,
    pagination,
    hidePagination,
    additionalTopRow,
    additionalBottomRow,
    loading,
    flexible,
    emptyState,
    onChangeSortModel,
    ...stackProps
  } = props;

  const [sortModel, setSortModel] = useState<CustomTableSortModel<P, T>>();
  const [isMounted, setIsMounted] = useState(false);
  const scrollBar = useRef<any>(null);

  const sortedRows = useMemo(() => {
    if (onChangeSortModel) {
      return rows;
    }
    const config = configs.find((c) => c.key == sortModel?.key);
    if (!sortModel || !config) {
      return rows;
    }
    const sortDirection = sortModel.direction == "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const valueA = getObjectValue(a, sortModel.key);
      const valueB = getObjectValue(b, sortModel.key);
      if (!valueA) return 1;
      if (!valueB) return -1;
      if (config.type == "date" || config.type == "datetime") {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;
        return (dateA.getTime() - dateB.getTime()) * sortDirection;
      }
      if (config.type == "number" || config.type == "float") {
        return (Number(valueA) - Number(valueB)) * sortDirection;
      }
      return String(valueA).localeCompare(String(valueB)) * sortDirection;
    });
  }, [configs, onChangeSortModel, rows, sortModel]);

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
      const f = onChangeSortModel || setSortModel;
      if (key == sortModel?.key && sortModel.direction == "desc") {
        f(undefined);
      } else {
        f({
          key: key,
          direction: sortModel?.key != key ? "asc" : "desc",
        });
      }
    },
    [onChangeSortModel, sortModel?.direction, sortModel?.key]
  );

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 1000);
    const interval = setInterval(() => scrollBar.current?.recalculate?.(), 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div {...stackProps}>
      {children}
      <SimpleBar {...scrollbarProps} ref={scrollBar}>
        <table
          className={clsx(
            "relative min-w-[700px] w-full rounded-md border-collapse",
            isMounted && flexible ? "table-fixed" : undefined,
            tableClassName
          )}
        >
          <CustomTableHeader
            {...props}
            sortModel={sortModel}
            onClickSort={handleClickSort}
          />
          <tbody>
            {additionalTopRow}
            {pagedRows.map((row, index) => (
              <tr
                key={row.id + "-key-" + index}
                onClick={() => onClickRow && onClickRow(row, index)}
                className={clsx(
                  "text-nowrap px-2 border border-collapse",
                  row.error ? "bg-error-900" : undefined,
                  onClickRow ? "cursor-pointer hover:bg-gray-100" : undefined
                )}
              >
                {(indexColumn || select) && (
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className={cellClassName}
                  >
                    <div className="flex gap-1 items-center pl-3">
                      {select && (
                        <Checkbox
                          checked={select.selected.includes(row)}
                          onCheckedChange={(checked) =>
                            checked
                              ? select.handleSelectOne(row)
                              : select.handleDeselectOne(row)
                          }
                        />
                      )}
                      {indexColumn && <>{index + 1}</>}
                      {row.error && (
                        <div className="tooltip" data-tip={row.error}>
                          <IoWarning className="bg-error" />
                        </div>
                      )}
                    </div>
                  </td>
                )}
                {configs.map((config) => (
                  <CustomTableCell
                    key={config.key.toString()}
                    cellClassName={cellClassName}
                    data={row}
                    config={config}
                    onUpdate={async (value) =>
                      await onUpdate?.(config.key, value, row, index)
                    }
                  />
                ))}

                {(onClickDelete ||
                  onClickDetail ||
                  onClickEdit ||
                  onClickRevert ||
                  renderRowActions) && (
                  <td align="right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end -my-1">
                      {renderRowActions?.(row, index)}
                      {onClickEdit && (
                        <Button
                          onClick={() => onClickEdit(row, index)}
                          variant="ghost"
                          className="hover:bg-secondary/15"
                        >
                          <PiNotePencilBold className="h-5 w-5 fill-secondary" />
                        </Button>
                      )}
                      {onClickDelete && (
                        <Button
                          onClick={() => onClickDelete(row, index)}
                          variant="ghost"
                          className="hover:bg-destructive/15"
                        >
                          <BsTrash2Fill className="h-5 w-5 fill-destructive" />
                        </Button>
                      )}
                      {onClickDetail && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onClickDetail(row, index)}
                        >
                          Chi tiết
                        </Button>
                      )}
                      {onClickRevert && (
                         <Button
                         onClick={() => onClickRevert(row, index)}
                         variant="ghost"
                         className="hover:bg-destructive/15"
                       >
                         <BsArrowRepeat
                    style={{ fontSize: "1.5rem", color: "#06B6D4" }}
                />
                       </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {additionalBottomRow}
          </tbody>
        </table>
        {(loading || rows.length == 0) && <div className="h-[104px]" />}
      </SimpleBar>
      {(loading || rows.length == 0) && (
        <div className="-mt-2 h-[100px] w-full flex items-center justify-center sticky left-0">
          {loading ? (
            <Loading />
          ) : emptyState ? (
            emptyState
          ) : (
            <div className="text-lg">No data</div>
          )}
        </div>
      )}
      {pagination && !hidePagination && (
        <Pagination
          page={pagination.page}
          count={pagination.totalPages}
          onChange={pagination.onPageChange}
          rowsPerPage={pagination.rowsPerPage}
        />
      )}
    </div>
  );
}
