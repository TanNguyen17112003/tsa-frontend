import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface OrderFormProps {
  checkCode: string;
  product: string;
  weight: number;
  brand: string;
  room: string;
  building: string;
  dormitory: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  paymentMethod: string;
  shippingFee: number;
  isPaid: boolean;
}

const ORDER_FORM_COLUMNS: { key: keyof OrderFormProps; label: string }[] = [
  { key: 'checkCode', label: 'Mã đơn hàng' },
  { key: 'product', label: 'Sản phẩm' },
  { key: 'weight', label: 'Khối lượng' },
  { key: 'brand', label: 'Nhãn hàng' },
  { key: 'room', label: 'Phòng' },
  { key: 'building', label: 'Tòa' },
  { key: 'dormitory', label: 'KTX' },
  { key: 'deliveryDate', label: 'Ngày giao' },
  { key: 'paymentMethod', label: 'Thanh toán' },
  { key: 'shippingFee', label: 'Phí ship' },
  { key: 'isPaid', label: 'Đã thanh toán' }
];

function OrderSatisfiedDialog({
  satisfiedOrders,
  notSatisfiedOrders,
  onConfirm,
  ...dialogProps
}: DialogProps & {
  satisfiedOrders: any[];
  notSatisfiedOrders: any[];
  onConfirm?: () => void;
}) {
  const tabs = useMemo(
    () => [
      { label: 'Danh sách đơn hàng hợp lệ', key: 'satisfied' },
      { label: 'Danh sách đơn hàng không hợp lệ', key: 'not-satisfied' }
    ],
    []
  );

  const [tab, setTab] = useState(tabs[0].key);

  return (
    <Dialog fullWidth maxWidth='md' {...dialogProps}>
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
          <Typography variant='h6'>Thêm các đơn hàng hợp lệ</Typography>
          <IconButton
            edge='end'
            color='inherit'
            onClick={() => dialogProps.onClose?.({}, 'escapeKeyDown')}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: 'green' },
            '& .MuiTab-root': { color: 'green', '&.Mui-selected': { color: 'green' } }
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.key} label={tab.label} value={tab.key} />
          ))}
        </Tabs>
        <Box mt={2}>
          {tab === 'satisfied' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {ORDER_FORM_COLUMNS.map((col) => (
                      <TableCell key={col.key}>{col.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {satisfiedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={ORDER_FORM_COLUMNS.length} align='center'>
                        Không có đơn hàng hợp lệ.
                      </TableCell>
                    </TableRow>
                  ) : (
                    satisfiedOrders.map((order, idx) => (
                      <TableRow key={idx}>
                        {ORDER_FORM_COLUMNS.map((col) => (
                          <TableCell key={col.key}>
                            {col.key === 'isPaid'
                              ? order.isPaid
                                ? 'Có'
                                : 'Không'
                              : col.key === 'weight'
                                ? order.weight
                                  ? order.weight + ' kg'
                                  : ''
                                : order[col.key] ?? ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {tab === 'not-satisfied' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {ORDER_FORM_COLUMNS.map((col) => (
                      <TableCell key={col.key}>{col.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notSatisfiedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={ORDER_FORM_COLUMNS.length} align='center'>
                        Không có đơn hàng không hợp lệ.
                      </TableCell>
                    </TableRow>
                  ) : (
                    notSatisfiedOrders.map((order, idx) => (
                      <TableRow key={idx}>
                        {ORDER_FORM_COLUMNS.map((col) => (
                          <TableCell key={col.key}>
                            {col.key === 'isPaid'
                              ? order.isPaid
                                ? 'Có'
                                : 'Không'
                              : col.key === 'weight'
                                ? order.weight
                                  ? order.weight + ' kg'
                                  : ''
                                : order[col.key] ?? ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>
      <DialogActions className='flex justify-center'>
        <Button
          variant='contained'
          color='inherit'
          onClick={(e) => dialogProps.onClose?.(e, 'escapeKeyDown')}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={async (e) => {
            if (onConfirm) onConfirm();
            else dialogProps.onClose?.(e, 'escapeKeyDown');
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderSatisfiedDialog;
