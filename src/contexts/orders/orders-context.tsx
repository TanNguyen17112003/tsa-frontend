import { createContext, ReactNode, useCallback, useEffect, useContext } from 'react';
import { OrdersApi } from 'src/api/orders';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { Order, OrderDetail } from 'src/types/order';

interface ContextValue {
  getOrdersApi: UseFunctionReturnType<FormData, OrderDetail[]>;

  createOrder: (requests: Omit<OrderDetail, 'id'>) => Promise<void>;
  updateOrder: (Order: Partial<OrderDetail>) => Promise<void>;
  deleteOrder: (ids: Order['id']) => Promise<void>;
}

export const OrdersContext = createContext<ContextValue>({
  getOrdersApi: DEFAULT_FUNCTION_RETURN,

  createOrder: async () => {},
  updateOrder: async () => {},
  deleteOrder: async () => {}
});

const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const getOrdersApi = useFunction(OrdersApi.getOrders);

  const createOrder = useCallback(
    async (request: Omit<OrderDetail, 'id'>) => {
      try {
        const user = await OrdersApi.postOrders(request);
        if (user) {
          const newOrders: OrderDetail[] = [
            {
              ...request,
              id: user.id
            },
            ...(getOrdersApi.data || [])
          ];
          getOrdersApi.setData(newOrders);
        }
      } catch (error) {
        throw error;
      }
    },
    [getOrdersApi]
  );

  const updateOrder = useCallback(
    async (Order: Partial<Order>) => {
      try {
        await OrdersApi.putOrder(Order);
        getOrdersApi.setData(
          (getOrdersApi.data || []).map((c) => (c.id == Order.id ? Object.assign(c, Order) : c))
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
        const result = await OrdersApi.deleteOrder(id);

        if (result.status === 'fulfilled') {
          getOrdersApi.setData((getOrdersApi.data || []).filter((order) => order.id !== id));
        } else {
          throw new Error('Không thể xoá đơn hàng: ' + id + '. ' + result.reason.toString());
        }
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
        createOrder,
        updateOrder,
        deleteOrder
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersContext = () => useContext(OrdersContext);

export default OrdersProvider;
