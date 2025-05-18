import { UsePaginationResult } from '@hooks';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
  ChangeEvent,
  useState
} from 'react';
import { RegulationBanThresholdRequest, RegulationsApi } from 'src/api/regulations';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import usePagination from 'src/hooks/use-pagination';
import {
  DormitoryRegulation,
  DormitoryRegulationTimeSlot,
  DormitoryRegulationTimeSlotRequest
} from 'src/types/regulation';

interface ContextValue {
  getRegulationsApi: UseFunctionReturnType<FormData, DormitoryRegulation[]>;
  updateRegulationBanThreshold: (
    dormitoryId: string,
    request: RegulationBanThresholdRequest
  ) => Promise<void>;
  createRegulationTimeSlot: (
    dormitoryId: string,
    request: DormitoryRegulationTimeSlotRequest
  ) => Promise<void>;
  updateRegulationTimeSlot: (
    dormitoryId: string,
    request: DormitoryRegulationTimeSlotRequest
  ) => Promise<void>;
  deleteRegulationTimeSlot: (dormitoryId: string, timeSlotId: string) => Promise<void>;
}

export const RegulationsContext = createContext<ContextValue>({
  getRegulationsApi: DEFAULT_FUNCTION_RETURN,
  updateRegulationBanThreshold: async () => {},
  createRegulationTimeSlot: async () => {},
  updateRegulationTimeSlot: async () => {},
  deleteRegulationTimeSlot: async () => {}
});

const RegulationsProvider = ({ children }: { children: ReactNode }) => {
  const getRegulationsApi = useFunction(RegulationsApi.getRegulations, {
    disableResetOnCall: true
  });

  const updateRegulationBanThreshold = useCallback(
    async (dormitoryId: string, request: RegulationBanThresholdRequest) => {
      try {
        await RegulationsApi.updateRegulationBanThreshold(dormitoryId, request);

        getRegulationsApi.setData([
          ...(getRegulationsApi.data || []).map((regulation) => {
            if (regulation.id !== dormitoryId) return regulation;
            return {
              ...regulation,
              banThreshold: request.banThreshold
            };
          })
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getRegulationsApi]
  );

  const createRegulationTimeSlot = useCallback(
    async (dormitoryId: string, request: DormitoryRegulationTimeSlotRequest) => {
      try {
        // Assume API returns the new slot with id, otherwise generate a temp id
        const result = await RegulationsApi.createRegulationTimeSlot(dormitoryId, request);
        getRegulationsApi.setData([
          ...(getRegulationsApi.data || []).map((regulation) => {
            if (regulation.id !== dormitoryId) return regulation;
            return {
              ...regulation,
              deliverySlots: [
                ...(regulation.deliverySlots || []),
                result?.id
                  ? { ...request, id: result.id }
                  : { ...request, id: `${dormitoryId}-${Date.now()}` }
              ]
            };
          })
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getRegulationsApi]
  );

  const updateRegulationTimeSlot = useCallback(
    async (dormitoryId: string, request: DormitoryRegulationTimeSlotRequest) => {
      try {
        await RegulationsApi.updateRegulationTimeSlot(dormitoryId, request);
        getRegulationsApi.setData([
          ...(getRegulationsApi.data || []).map((regulation) => {
            if (regulation.id !== dormitoryId) return regulation;
            return {
              ...regulation,
              deliverySlots: (regulation.deliverySlots || []).map((slot) =>
                slot.id === request.id
                  ? {
                      ...slot,
                      startTime: request.startTime,
                      endTime: request.endTime,
                      id: request.id
                    }
                  : slot
              )
            };
          })
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getRegulationsApi]
  );

  const deleteRegulationTimeSlot = useCallback(
    async (dormitoryId: string, timeSlotId: string) => {
      try {
        await RegulationsApi.deleteRegulationTimeSlot(dormitoryId, timeSlotId);
        getRegulationsApi.setData(
          (getRegulationsApi.data || []).map((regulation) => {
            if (regulation.id !== dormitoryId) return regulation;
            return {
              ...regulation,
              deliverySlots: regulation.deliverySlots?.filter((slot) => slot.id !== timeSlotId)
            };
          })
        );
      } catch (error) {
        throw error;
      }
    },
    [getRegulationsApi]
  );

  useEffect(() => {
    getRegulationsApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RegulationsContext.Provider
      value={{
        getRegulationsApi,
        updateRegulationBanThreshold,
        createRegulationTimeSlot,
        updateRegulationTimeSlot,
        deleteRegulationTimeSlot
      }}
    >
      {children}
    </RegulationsContext.Provider>
  );
};

export const useRegulationsContext = () => useContext(RegulationsContext);

export default RegulationsProvider;
