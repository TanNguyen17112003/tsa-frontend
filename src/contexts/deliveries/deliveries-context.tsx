import { createContext, ReactNode, useCallback, useEffect, useContext } from 'react';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { DeliveryDetail, Delivery, DeliveryStatus } from 'src/types/delivery';
import { DeliveryCreateResponse, DeliveryRequest, DeliveriesApi } from 'src/api/deliveries';

interface ContextValue {
  getDeliveriesApi: UseFunctionReturnType<FormData, DeliveryDetail[]>;
  getDeliveryById: (id: Delivery['id']) => Promise<DeliveryDetail>;
  createDelivery: (requests: DeliveryRequest) => Promise<void>;
  updateDelivery: (Order: Partial<DeliveryDetail>, deliveryId: string) => Promise<void>;
  updateDeliveryStatus: (status: DeliveryStatus, id: string) => Promise<void>;
  deleteDelivery: (ids: Delivery['id']) => Promise<void>;
}

export const DeliveriesContext = createContext<ContextValue>({
  getDeliveriesApi: DEFAULT_FUNCTION_RETURN,
  getDeliveryById: async (id: Delivery['id']) => {
    return {} as DeliveryDetail;
  },
  createDelivery: async () => {},
  updateDelivery: async () => {},
  updateDeliveryStatus: async () => {},
  deleteDelivery: async () => {}
});

const DeliveriesProvider = ({ children }: { children: ReactNode }) => {
  const getDeliveriesApi = useFunction(DeliveriesApi.getDeliveries);

  const getDeliveryById = useCallback(
    async (id: Delivery['id']) => {
      try {
        return await DeliveriesApi.getDeliveryById(id);
      } catch (error) {
        throw error;
      }
    },
    [getDeliveriesApi]
  );

  const createDelivery = useCallback(
    async (request: DeliveryRequest) => {
      try {
        const newOrder = await DeliveriesApi.postDeliveries(request);
        getDeliveriesApi.setData([
          ...(getDeliveriesApi.data || []),
          newOrder as unknown as DeliveryDetail
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getDeliveriesApi]
  );

  const updateDelivery = useCallback(
    async (delivery: Partial<Delivery>, deliveryId: string) => {
      try {
        const updateDelivery = await DeliveriesApi.updateDelivery(delivery, deliveryId);
        getDeliveriesApi.setData(
          (getDeliveriesApi.data || []).map((c) =>
            c.id === deliveryId ? (updateDelivery as unknown as DeliveryDetail) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getDeliveriesApi]
  );

  const updateDeliveryStatus = useCallback(
    async (status: DeliveryStatus, id: string) => {
      try {
        await DeliveriesApi.updateDeliveryStatus(status, id);
        getDeliveriesApi.setData(
          (getDeliveriesApi.data || []).map((c) =>
            c.id == id ? Object.assign(c, { latestStatus: status }) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getDeliveriesApi]
  );

  const deleteDelivery = useCallback(
    async (id: Delivery['id']) => {
      try {
        await DeliveriesApi.deleteDelivery(id);
        getDeliveriesApi.setData(
          (getDeliveriesApi.data || []).filter((delivery) => delivery.id !== id)
        );
      } catch (error) {
        throw error;
      }
    },
    [getDeliveriesApi]
  );

  useEffect(() => {
    getDeliveriesApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DeliveriesContext.Provider
      value={{
        getDeliveriesApi,
        getDeliveryById,
        createDelivery,
        updateDelivery,
        updateDeliveryStatus,
        deleteDelivery
      }}
    >
      {children}
    </DeliveriesContext.Provider>
  );
};

export const useDeliveriesContext = () => useContext(DeliveriesContext);

export default DeliveriesProvider;
