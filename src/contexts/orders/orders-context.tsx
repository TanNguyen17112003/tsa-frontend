import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
  ChangeEvent,
  useState
} from 'react';
import { OrderResponse, OrdersApi } from 'src/api/orders';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { Order, OrderDetail, OrderStatus } from 'src/types/order';
import { OrderFormProps } from 'src/api/orders';
import { dateToUnixTimestamp } from 'src/utils/format-time-currency';
import { UsePaginationResult } from '@hooks';
import usePagination from 'src/hooks/use-pagination';

export type OrderFilter = {
  status?: OrderStatus;
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  isPaid?: boolean;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page?: number;
  sortBy?: string;
};

interface ContextValue {
  getOrdersApi: UseFunctionReturnType<FormData, OrderResponse>;
  orderPagination: UsePaginationResult;
  orderFilter: OrderFilter;
  setOrderFilter: (orderFilter: OrderFilter) => void;
  getOrderById: (id: Order['id']) => Promise<OrderDetail>;
  createOrder: (requests: OrderFormProps[]) => Promise<void>;
  updateOrder: (Order: Partial<OrderDetail>, orderId: string) => Promise<void>;
  updateOrderStatus: (status: OrderStatus, ids: string[]) => Promise<void>;
  deleteOrder: (ids: Order['id'][]) => Promise<void>;
}

export const OrdersContext = createContext<ContextValue>({
  getOrdersApi: DEFAULT_FUNCTION_RETURN,
  orderPagination: {
    count: 0,
    page: 0,
    rowsPerPage: 10,
    totalPages: 0,
    onPageChange: function (event: any, newPage: number): void {
      throw new Error('Function not implemented.');
    },
    onRowsPerPageChange: function (
      event: number | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void {
      throw new Error('Function not implemented.');
    }
  },
  orderFilter: {},
  setOrderFilter: () => {},
  getOrderById: async (id: Order['id']) => {
    return {} as OrderDetail;
  },
  createOrder: async () => {},
  updateOrder: async () => {},
  updateOrderStatus: async () => {},
  deleteOrder: async () => {}
});

const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const getOrdersApi = useFunction(OrdersApi.getOrders, {
    disableResetOnCall: true
  });

  const [orderFilter, setOrderFilter] = useState<OrderFilter>({
    sortOrder: 'asc',
    sortBy: 'checkCode'
  });

  const orderPagination = usePagination({
    count: getOrdersApi.data?.totalElements || 0
  });

  const getOrderById = useCallback(
    async (id: Order['id']) => {
      try {
        return await OrdersApi.getOrderById(id);
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi]
  );

  const createOrder = useCallback(
    async (requests: OrderFormProps[]) => {
      try {
        const newOrders = await Promise.all(
          requests.map((request) => OrdersApi.postOrders(request))
        );
        getOrdersApi.setData({
          ...getOrdersApi.data,
          results: [...(getOrdersApi.data?.results || []), ...newOrders.map((order) => order.data)],
          totalElements: (getOrdersApi.data?.totalElements || 0) + newOrders.length,
          totalPages: Math.ceil(((getOrdersApi.data?.totalElements || 0) + newOrders.length) / 1)
        });
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi]
  );

  const updateOrder = useCallback(
    async (order: Partial<Order>, orderId: string) => {
      try {
        const updatedOrder = await OrdersApi.updateOrder(order, orderId);
        getOrdersApi.setData({
          ...getOrdersApi.data,
          results: (getOrdersApi.data?.results || []).map((c) =>
            c.id === orderId
              ? Object.assign(c, {
                  ...order,
                  deliveryDate: order.deliveryDate
                    ? dateToUnixTimestamp(new Date(order.deliveryDate))
                    : undefined
                })
              : c
          ),
          totalElements: getOrdersApi.data?.totalElements || 0,
          totalPages: getOrdersApi.data?.totalPages || 1
        });
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi]
  );

  const deleteOrder = useCallback(
    async (ids: Order['id'][]) => {
      try {
        await Promise.all(ids.map((id) => OrdersApi.deleteOrder(id)));
        const formData = new FormData();
        Object.entries(orderFilter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'dateRange') {
              if (
                typeof value === 'object' &&
                value !== null &&
                'startDate' in value &&
                'endDate' in value
              ) {
                if (value.startDate) {
                  formData.append('startDate', value.startDate.toISOString());
                }
                if (value.endDate) {
                  formData.append('endDate', value.endDate.toISOString());
                }
              }
            } else {
              formData.append(key, value.toString());
            }
          }
        });
        await getOrdersApi.call(formData);
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi, orderFilter]
  );

  const updateOrderStatus = useCallback(
    async (status: OrderStatus, ids: Order['id'][]) => {
      try {
        await Promise.all(ids.map((id) => OrdersApi.updateOrderStatus(status, id)));
        getOrdersApi.setData({
          ...getOrdersApi.data,
          results: (getOrdersApi.data?.results || []).map((c) =>
            ids.includes(c.id) ? Object.assign(c, { latestStatus: status }) : c
          ),
          totalElements: getOrdersApi.data?.totalElements || 0,
          totalPages: getOrdersApi.data?.totalPages || 1
        });
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi]
  );

  useEffect(() => {
    const formData = new FormData();
    Object.entries(orderFilter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'dateRange') {
          if (
            typeof value === 'object' &&
            value !== null &&
            'startDate' in value &&
            'endDate' in value
          ) {
            if (value.startDate) {
              formData.append('startDate', value.startDate.toISOString());
            }
            if (value.endDate) {
              formData.append('endDate', value.endDate.toISOString());
            }
          }
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    getOrdersApi.call(formData);
  }, [orderFilter]);

  return (
    <OrdersContext.Provider
      value={{
        getOrdersApi,
        orderPagination,
        orderFilter,
        setOrderFilter,
        getOrderById,
        createOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersContext = () => useContext(OrdersContext);

export default OrdersProvider;
