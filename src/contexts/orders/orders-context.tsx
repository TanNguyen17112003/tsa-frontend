import { createContext, ReactNode, useCallback, useEffect, useContext } from 'react';
import { OrdersApi } from 'src/api/orders';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { Order, OrderDetail, OrderStatus } from 'src/types/order';
import { OrderFormProps } from 'src/api/orders';

interface ContextValue {
  getOrdersApi: UseFunctionReturnType<FormData, OrderDetail[]>;
  getOrderById: (id: Order['id']) => Promise<OrderDetail>;
  createOrder: (requests: OrderFormProps[]) => Promise<void>;
  updateOrder: (Order: Partial<OrderDetail>, orderId: string) => Promise<void>;
  updateOrderStatus: (status: OrderStatus, id: string) => Promise<void>;
  deleteOrder: (ids: Order['id']) => Promise<void>;
}

export const OrdersContext = createContext<ContextValue>({
  getOrdersApi: DEFAULT_FUNCTION_RETURN,
  getOrderById: async (id: Order['id']) => {
    return {} as OrderDetail;
  },
  createOrder: async () => {},
  updateOrder: async () => {},
  updateOrderStatus: async () => {},
  deleteOrder: async () => {}
});

const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const getOrdersApi = useFunction(OrdersApi.getOrders);

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
        getOrdersApi.setData([
          ...(getOrdersApi.data || []),
          ...newOrders.map((order) => order.data)
        ]);
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
        getOrdersApi.setData(
          (getOrdersApi.data || []).map((c) => (c.id === orderId ? updatedOrder.data : c))
        );
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi]
  );

  const updateOrderStatus = useCallback(
    async (status: OrderStatus, id: string) => {
      try {
        await OrdersApi.updateOrderStatus(status, id);
        getOrdersApi.setData(
          (getOrdersApi.data || []).map((c) =>
            c.id == id ? Object.assign(c, { latestStatus: status }) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi]
  );

  const deleteOrder = useCallback(
    async (id: Order['id']) => {
      try {
        await OrdersApi.deleteOrder(id);
        getOrdersApi.setData((getOrdersApi.data || []).filter((order) => order.id !== id));
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi]
  );

  useEffect(() => {
    getOrdersApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        getOrdersApi,
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
