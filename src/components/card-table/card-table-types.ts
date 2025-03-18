import { TableCellProps, TableProps, CardProps } from '@mui/material';
import { ReactNode } from 'react';
import { ScrollbarProps } from '../scrollbar';
import { Selection } from 'src/hooks/use-selection';
import { UsePaginationResult } from 'src/hooks/use-pagination';

export type CardTableEditCellProps<P, T extends { id: P; [key: string]: any }> = (
  editingValue: any,
  onChange: (value: any) => void,
  updating: boolean,
  initialValue: any,
  onUpdate: (value: any) => Promise<any>,
  onCancel: () => void,
  type?: 'string' | 'number' | 'date' | 'datetime' | 'float'
) => ReactNode;

export interface CardTableConfig<P, T extends { id: P; [key: string]: any }> {
  key: keyof T | string;
  headerLabel: string;
  groupedHeaderLabel?: string;
  headerIcon?: ReactNode;
  type?: 'string' | 'number' | 'date' | 'datetime' | 'float';
  headerCellProps?: TableCellProps;
  renderCell?: (cellData: T, onEdit?: () => void) => ReactNode;
  renderEditingCell?: CardTableEditCellProps<P, T>;
  cellProps?: TableCellProps;
}

export interface CardTableSortModel<P, T extends { id: P; [key: string]: any }> {
  key: keyof T | string;
  direction: 'asc' | 'desc';
}

export interface CardTableProps<P, T extends { id: P; [key: string]: any }> {
  rows: T[];
  configs: CardTableConfig<P, T>[];
  actions?: ReactNode;
  renderRowActions?: (item: T, index: number) => ReactNode;
  cellProps?: TableCellProps;
  tableProps?: TableProps;
  cardProps?: CardProps;
  scrollbarProps?: ScrollbarProps;
  children?: ReactNode;
  onClickRow?: (item: T, index: number) => void;
  onClickEdit?: (item: T, index: number) => void;
  onClickDelete?: (item: T, index: number) => void;
  onClickDetail?: (item: T, index: number) => void;
  onUpdate?: (key: keyof T, value: any, item: T, index: number) => Promise<any>;
  indexColumn?: boolean;
  select?: Selection<T>;
  pagination?: UsePaginationResult;
  stickyHeader?: boolean;
  additionalTopRow?: ReactNode;
  additionalBottomRow?: ReactNode;
  loading?: boolean;
  flexible?: boolean;
}
