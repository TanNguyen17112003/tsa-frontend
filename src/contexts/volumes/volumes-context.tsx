import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { GetVolumesPayload, VolumesApi } from "src/api/volumes";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { SutraDetail, initialSutra } from "src/types/sutra";
import { Volume, VolumeDetail } from "src/types/volume";
import { useSutrasContext } from "../sutras/sutras-context";
import { useCollectionCategoriesContext } from "../collections/collection-categories-context";

interface ContextValue {
  sutra?: SutraDetail;
  getVolumesApi: UseFunctionReturnType<GetVolumesPayload, VolumeDetail[]>;

  createVolume: (requests: Omit<VolumeDetail, "id">) => Promise<void>;
  updateVolume: (Volume: Partial<VolumeDetail>) => Promise<void>;
  deleteVolume: (ids: Volume["id"][]) => Promise<void>;
}

export const VolumesContext = createContext<ContextValue>({
  sutra: initialSutra,
  getVolumesApi: DEFAULT_FUNCTION_RETURN,

  createVolume: async () => {},
  updateVolume: async () => {},
  deleteVolume: async () => {},
});

const VolumesProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { updateTree } = useCollectionCategoriesContext();
  const { getSutrasApi } = useSutrasContext();
  const sutra = useMemo(() => {
    const sutraId = (
      router.query.sutraId ||
      router.query.qSutraId ||
      ""
    )?.toString();
    return getSutrasApi.data?.find((c) => c.id == sutraId);
  }, [getSutrasApi.data, router.query.sutraId, router.query.qSutraId]);

  const getVolumesApi = useFunction(VolumesApi.getVolumes);

  const createVolume = useCallback(
    async (request: Omit<VolumeDetail, "id">) => {
      try {
        const volume = await VolumesApi.postVolume(request);
        if (volume) {
          const newVolumes: VolumeDetail[] = [
            {
              ...request,
              id: volume.id,
            },
            ...(getVolumesApi.data || []),
          ];
          getVolumesApi.setData(newVolumes);
          updateTree((tree) => ({
            ...tree,
            volumes: [...tree.volumes, volume],
          }));
        }
      } catch (error) {
        throw error;
      }
    },
    [getVolumesApi, updateTree]
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
        updateTree((tree) => ({
          ...tree,
          volumes: tree.volumes.map((c) =>
            c.id == Volume.id ? Object.assign(c, Volume) : c
          ),
        }));
      } catch (error) {
        throw error;
      }
    },
    [getVolumesApi, updateTree]
  );

  const deleteVolume = useCallback(
    async (ids: Volume["id"][]) => {
      try {
        await VolumesApi.deleteVolume(ids);
        getVolumesApi.setData([
          ...(getVolumesApi.data || []).filter(
            (sutra) => !ids.includes(sutra.id)
          ),
        ]);
        updateTree((tree) => ({
          ...tree,
          volumes: tree.volumes.filter((volume) => !ids.includes(volume.id)),
        }));
      } catch (error) {
        throw error;
      }
    },
    [getVolumesApi, updateTree]
  );

  useEffect(() => {
    if (sutra) {
      getVolumesApi.call({ sutra_id: sutra.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sutra]);

  return (
    <VolumesContext.Provider
      value={{
        sutra,
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
