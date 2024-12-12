import { useState, useEffect } from 'react';
import useFunction from 'src/hooks/use-function';
import { OrdersApi } from 'src/api/orders';
import { OrderDetail } from 'src/types/order';

const useOrdersData = () => {
  const getOrdersApi = useFunction(OrdersApi.getOrders);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrdersApi.call({});
      setOrders(fetchedOrders.data?.results || []);
    };

    fetchOrders();
  }, []);

  return {
    orders
  };
};

export default useOrdersData;
