import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  DialogProps,
  Typography,
  Divider,
  Tabs,
  Tab,
  Box,
  Stack,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { AdvancedDelivery } from 'src/types/delivery';
import { UserDetail } from 'src/types/user';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { DeliveriesApi } from 'src/api/deliveries';

function OrderConfirmAdvancedDialog({
  staffs,
  result,
  ...dialogProps
}: DialogProps & {
  staffs?: UserDetail[];
  result?: AdvancedDelivery | null;
}) {
  const tabs = useMemo(() => {
    return [
      {
        label: 'Danh sách chuyến đi được ghép',
        key: 'deliveries'
      },
      {
        label: 'Danh sách đơn hàng bị trễ',
        key: 'delayed'
      }
    ];
  }, []);

  const [tab, setTab] = useState(tabs[0].key);
  const [selectedStaffs, setSelectedStaffs] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const handleStaffChange = (deliveryIndex: number, staffId: string) => {
    setSelectedStaffs((prev) => ({
      ...prev,
      [deliveryIndex]: staffId
    }));
  };

  const isStaffDisabled = (staffId: string, currentDeliveryIndex: number) => {
    return Object.entries(selectedStaffs).some(
      ([deliveryIndex, selectedStaffId]) =>
        selectedStaffId === staffId && parseInt(deliveryIndex) !== currentDeliveryIndex
    );
  };

  const handleCreateDeliveries = useCallback(async () => {
    if (!result?.deliveries) return;

    setLoading(true);
    try {
      for (let deliveryIndex = 0; deliveryIndex < result.deliveries.length; deliveryIndex++) {
        const delivery = result.deliveries[deliveryIndex];
        const staffId = selectedStaffs[deliveryIndex];

        if (!staffId) {
          throw new Error(`Staff not selected for delivery ${deliveryIndex + 1}`);
        }

        const orderIds = delivery
          .map((order) => order.id)
          .filter((id): id is string => id !== undefined);

        await DeliveriesApi.postDeliveries({
          limitTime: 105,
          staffId,
          orderIds
        });
      }

      dialogProps.onClose?.({}, 'escapeKeyDown');
    } catch (error) {
      console.error('Error creating deliveries:', error);
    } finally {
      setLoading(false);
    }
  }, [result?.deliveries, selectedStaffs, dialogProps]);
  const isConfirmDisabled = useMemo(() => {
    if (!result?.deliveries) return true;
    return result.deliveries.some((_, deliveryIndex) => !selectedStaffs[deliveryIndex]);
  }, [result?.deliveries, selectedStaffs]);
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
          <Typography variant='h6'>Gom nhóm nhanh các đơn hàng dựa vào AI</Typography>
          <IconButton
            edge='end'
            color='inherit'
            onClick={() => {
              dialogProps.onClose?.({}, 'escapeKeyDown');
            }}
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
            '& .MuiTabs-indicator': {
              backgroundColor: 'green'
            },
            '& .MuiTab-root': {
              color: 'green',
              '&.Mui-selected': {
                color: 'green'
              }
            }
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.key} label={tab.label} value={tab.key} />
          ))}
        </Tabs>
        <Box mt={2}>
          {tab === 'deliveries' && (
            <>
              {result?.deliveries?.length === 0 ? (
                <Typography variant='body1' color='textSecondary'>
                  There are no info for this field.
                </Typography>
              ) : (
                <Carousel>
                  {result?.deliveries.map((delivery, deliveryIndex) => (
                    <Box key={deliveryIndex} p={2} border='1px solid #ccc' borderRadius='8px'>
                      <Typography variant='h6' gutterBottom>
                        Delivery {deliveryIndex + 1}
                      </Typography>
                      <FormControl fullWidth margin='normal'>
                        <Select
                          value={selectedStaffs[deliveryIndex] || ''}
                          onChange={(e) =>
                            handleStaffChange(deliveryIndex, e.target.value as string)
                          }
                          displayEmpty
                        >
                          <MenuItem value='' disabled>
                            Select a staff
                          </MenuItem>
                          {staffs?.map((staff) => (
                            <MenuItem
                              key={staff.id}
                              value={staff.id}
                              disabled={isStaffDisabled(staff.id, deliveryIndex)}
                            >
                              {staff.firstName} {staff.lastName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Mã đơn hàng</TableCell>
                              <TableCell>Sản phẩm</TableCell>
                              <TableCell>Khối lượng</TableCell>
                              <TableCell>Nhãn hàng</TableCell>
                              <TableCell>Địa chỉ</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {delivery.map((order, orderIndex) => (
                              <TableRow key={orderIndex}>
                                <TableCell>{order.checkCode}</TableCell>
                                <TableCell>{order.product}</TableCell>
                                <TableCell>{order.weight} kg</TableCell>
                                <TableCell>{order.brand}</TableCell>
                                <TableCell>{`P.${order.room}, T.${order.building}, KTX khu ${order.dormitory}`}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  ))}
                </Carousel>
              )}
            </>
          )}
          {tab === 'delayed' && (
            <>
              {result?.delayed?.length === 0 ? (
                <Typography variant='body1' color='textSecondary'>
                  There are no info for this field.
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã đơn hàng</TableCell>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell>Khối lượng</TableCell>
                        <TableCell>Nhãn hàng</TableCell>
                        <TableCell>Địa chỉ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result?.delayed.map((order, index) => (
                        <TableRow key={index}>
                          <TableCell>{order.checkCode}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.weight} kg</TableCell>
                          <TableCell>{order.brand}</TableCell>
                          <TableCell>{`P.${order.room}, T.${order.building}, KTX khu ${order.dormitory}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions className='flex justify-center'>
        <Button
          variant='contained'
          color='inherit'
          onClick={(e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
          }}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={handleCreateDeliveries}
          disabled={loading || isConfirmDisabled}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderConfirmAdvancedDialog;
