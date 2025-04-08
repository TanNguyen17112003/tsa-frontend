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
  FormControl,
  Grid
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { AdvancedDelivery } from 'src/types/delivery';
import { UserDetail } from 'src/types/user';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { DeliveriesApi } from 'src/api/deliveries';
import useFunction from 'src/hooks/use-function';
import { useFormik } from 'formik';
import { OrdersApi } from 'src/api/orders';
import { OrderFormTextField } from '../order-add/order-form-text-field';
import { useOrdersContext } from 'src/contexts/orders/orders-context';

interface OrderDelayFieldProps {
  deliveryDay: string;
  deliveryTimeSlot: string;
  orderIds: string[];
}

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

  const { delayOrders } = useOrdersContext();

  const timeSlotOptions = useMemo(() => {
    const slots = [];
    let startHour = 7;
    const startMinute = 0;

    while (startHour < 18 || (startHour === 18 && startMinute <= 45)) {
      const endHour = startHour + 1;
      const endMinute = startMinute + 45;
      const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      slots.push({
        label: `${startTime} - ${endTime}`,
        value: startTime
      });

      startHour += 2;
    }
    return slots;
  }, []);

  const getOrdersApi = useFunction(OrdersApi.getOrders);

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

  const formik = useFormik<OrderDelayFieldProps>({
    initialValues: {
      deliveryDay: new Date().toISOString().split('T')[0],
      deliveryTimeSlot: '07:00',
      orderIds: []
    },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

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
        await delayOrders({
          timeslot: Math.floor(
            new Date(`${formik.values.deliveryDay} ${formik.values.deliveryTimeSlot}`).getTime() /
              1000
          ).toString(),
          orderIds: result?.delayed
            .map((order) => order.id)
            .filter((id): id is string => id !== undefined)
        });
      }

      dialogProps.onClose?.({}, 'escapeKeyDown');
    } catch (error) {
      console.error('Error creating deliveries:', error);
    } finally {
      setLoading(false);
    }
  }, [
    result?.deliveries,
    selectedStaffs,
    dialogProps,
    delayOrders,
    result?.delayed,
    formik.values.deliveryDay,
    formik.values.deliveryTimeSlot
  ]);

  const handleCreateDeliveriesHelper = useFunction(handleCreateDeliveries, {
    successMessage:
      result?.delayed.length === 0
        ? 'Tạo các chuyến đi thành công'
        : 'Đã tạo các chuyến đi và cập nhật thời gian giao hàng cho các đơn hàng bị trễ'
  });

  const isConfirmDisabled = useMemo(() => {
    if (!result?.deliveries && !result?.delayed) return true;
    const filteredByDeliveries = result.deliveries.some(
      (_, deliveryIndex) => !selectedStaffs[deliveryIndex]
    );
    const filteredByDelayed =
      result?.delayed.length > 0 &&
      formik.values.deliveryDay !== '' &&
      formik.values.deliveryTimeSlot !== '';
    return filteredByDeliveries && filteredByDelayed;
  }, [
    result?.deliveries,
    selectedStaffs,
    formik.values.deliveryDay,
    formik.values.deliveryTimeSlot,
    result?.delayed
  ]);

  useEffect(() => {
    getOrdersApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
                  Không có thông tin cho trường này.
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
                            Chọn nhân viên giao hàng
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
              {result?.delayed.length === 0 ? (
                <Typography variant='body1' color='textSecondary'>
                  Không có thông tin cho trường này.
                </Typography>
              ) : (
                <>
                  <Typography variant='body1' fontWeight={'bold'}>
                    Chỉnh sửa thời gian giao cho các đơn hàng bị trễ
                  </Typography>
                  <Grid container spacing={2} my={2}>
                    <OrderFormTextField
                      type='date'
                      title={'Ngày giao hàng'}
                      lg={6}
                      xs={6}
                      name={'deliveryDay'}
                      placeholder='Chọn ngày gian giao hàng'
                      onChange={formik.handleChange}
                      value={formik.values.deliveryDay as string}
                    />
                    <OrderFormTextField
                      type='text'
                      title='Khung giờ giao hàng'
                      xs={6}
                      lg={6}
                      name='deliveryTimeSlot'
                      placeholder='Chọn khung giờ giao hàng'
                      select
                      onChange={(event) =>
                        formik.setFieldValue('deliveryTimeSlot', event.target.value)
                      }
                      value={formik.values.deliveryTimeSlot as string}
                    >
                      {timeSlotOptions.map((slot, index) => (
                        <MenuItem key={index} value={slot.value}>
                          {slot.label}
                        </MenuItem>
                      ))}
                    </OrderFormTextField>
                  </Grid>
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
                </>
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
          onClick={handleCreateDeliveriesHelper.call}
          disabled={loading || isConfirmDisabled}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderConfirmAdvancedDialog;
