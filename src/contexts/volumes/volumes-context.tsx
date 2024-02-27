
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { VolumesApi } from "src/api/volumes";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Volume, VolumeDetail } from "src/types/volume";

interface ContextValue {
  getVolumesApi: UseFunctionReturnType<FormData, VolumeDetail[]>;

  createVolume: (requests: Omit<VolumeDetail, "id">) => Promise<void>;
  updateVolume: (Volume: Partial<VolumeDetail>) => Promise<void>;
  deleteVolume: (ids: Volume["id"][]) => Promise<void>;
}

export const VolumesContext = createContext<ContextValue>({
  getVolumesApi: DEFAULT_FUNCTION_RETURN,

  createVolume: async () => {},
  updateVolume: async () => {},
  deleteVolume: async () => {},
});

const VolumesProvider = ({ children }: { children: ReactNode }) => {
  const getVolumesApi = useFunction(VolumesApi.getVolumes);

  const createVolume = useCallback(
    async (request: Omit<VolumeDetail, "id">) => {
      try {
        const id = await VolumesApi.postVolume(request);
        if (id) {
          const newVolumes: VolumeDetail[] = [
            {
              ...request,
              id: id,
            },
            ...(getVolumesApi.data || []),
          ];
          getVolumesApi.setData(newVolumes);
        }
      } catch (error) {
        throw error;
      }
    },
    [getVolumesApi]
  );

  const updateVolume = useCallback(
    async (Volume: Partial<Volume>) => {
      try {
        await VolumesApi.putVolumes(Volume);
        getVolumesApi.setData(
          (getVolumesApi.data || []).map((c) =>
            c.id == Volume.id ? Object.assign(c, Volume) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getVolumesApi]
  );

  const deleteVolume = useCallback(
    async (ids: Volume["id"][]) => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) => VolumesApi.deleteVolume(id))
        );
        getVolumesApi.setData([
          ...(getVolumesApi.data || []).filter(
            (Volume) =>
              !results.find(
                (result, index) =>
                  result.status == "fulfilled" && ids[index] == Volume.id
              )
          ),
        ]);
        results.forEach((result, index) => {
          if (result.status == "rejected") {
            throw new Error(
              "Không thể xoá danh mục: " +
                ids[index] +
                ". " +
                result.reason.toString()
            );
          }
        });
      } catch (error) {
        throw error;
      }
    },
    [getVolumesApi]
  );

  useEffect(() => {
    getVolumesApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VolumesContext.Provider
      value={{
        getVolumesApi,

        createVolume,
        updateVolume,
        deleteVolume,
      }}
    >
      {children}
    </VolumesContext.Provider>
  );
};

export const useVolumesContext = () => useContext(VolumesContext);

export default VolumesProvider;
