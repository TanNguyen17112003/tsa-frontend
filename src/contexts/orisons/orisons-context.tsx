import router from "next/router";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { GetOrisonPayload, OrisonsApi } from "src/api/orisons";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Orison, OrisonDetail } from "src/types/orison";
import { VolumeDetail } from "src/types/volume";
import { useVolumesContext } from "../volumes/volumes-context";

interface ContextValue {
  volume?: VolumeDetail;
  getOrisonsApi: UseFunctionReturnType<GetOrisonPayload, OrisonDetail[]>;

  createOrison: (requests: Omit<OrisonDetail, "id">) => Promise<void>;
  updateOrison: (Orison: Partial<OrisonDetail>) => Promise<void>;
  deleteOrison: (ids: Orison["id"][]) => Promise<void>;
}

export const OrisonsContext = createContext<ContextValue>({
  getOrisonsApi: DEFAULT_FUNCTION_RETURN,

  createOrison: async () => {},
  updateOrison: async () => {},
  deleteOrison: async () => {},
});

const OrisonsProvider = ({ children }: { children: ReactNode }) => {
  const { getVolumesApi } = useVolumesContext();
  const volume = useMemo(() => {
    const volumeId = (
      router.query.volumeId ||
      router.query.qVolumeId ||
      ""
    )?.toString();
    return getVolumesApi.data?.find((c) => c.id == volumeId);
  }, [getVolumesApi.data]);
  const getOrisonsApi = useFunction(OrisonsApi.getOrisons);

  const createOrison = useCallback(
    async (request: Omit<OrisonDetail, "id">) => {
      try {
        const orison = await OrisonsApi.postOrison(request);
        if (orison) {
          const newOrisons: OrisonDetail[] = [
            {
              ...request,
              id: orison.id,
            },
            ...(getOrisonsApi.data || []),
          ];
          getOrisonsApi.setData(newOrisons);
        }
      } catch (error) {
        throw error;
      }
    },
    [getOrisonsApi]
  );

  const updateOrison = useCallback(
    async (Orison: Partial<Orison>) => {
      try {
        await OrisonsApi.putOrisons(Orison);
        getOrisonsApi.setData(
          (getOrisonsApi.data || []).map((c) =>
            c.id == Orison.id ? Object.assign(c, Orison) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getOrisonsApi]
  );

  const deleteOrison = useCallback(
    async (ids: Orison["id"][]) => {
      try {
        await OrisonsApi.deleteOrison(ids);
        getOrisonsApi.setData([
          ...(getOrisonsApi.data || []).filter(
            (orison) => !ids.includes(orison.id)
          ),
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getOrisonsApi]
  );

  useEffect(() => {
    if (volume) {
      getOrisonsApi.call({ volume_id: volume.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  return (
    <OrisonsContext.Provider
      value={{
        volume,
        getOrisonsApi,

        createOrison,
        updateOrison,
        deleteOrison,
      }}
    >
      {children}
    </OrisonsContext.Provider>
  );
};

export const useOrisonsContext = () => useContext(OrisonsContext);

export default OrisonsProvider;
