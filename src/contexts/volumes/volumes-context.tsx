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
import { FileDatasApi } from "src/api/files";

interface ContextValue {
  sutra?: SutraDetail;
  getVolumesApi: UseFunctionReturnType<GetVolumesPayload, VolumeDetail[]>;

  createVolumesByFile: (
    files: File[],
    onProgress?: (value: number) => void
  ) => Promise<void>;
  createVolume: (requests: Omit<VolumeDetail, "id">) => Promise<void>;
  updateVolume: (Volume: Partial<VolumeDetail>) => Promise<void>;
  deleteVolume: (ids: Volume["id"][]) => Promise<void>;
}

export const VolumesContext = createContext<ContextValue>({
  getVolumesApi: DEFAULT_FUNCTION_RETURN,

  createVolumesByFile: async () => {},
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

  const createVolumesByFile = useCallback(
    async (files: File[], onProgress?: (value: number) => void) => {
      try {
        if (sutra) {
          const newVolumes: VolumeDetail[] = [];
          for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const [code, name] = file.name.split("_");
            if (!code || !name) {
              throw new Error(`Tên file ${file.name} sai cấu trúc`);
            }
            try {
              const fileData = await FileDatasApi.uploadFileData({
                file: file,
              });
              if (fileData) {
                const newVolume = await VolumesApi.postVolume({
                  code,
                  name,
                  created_at: new Date(),
                  sutras_id: sutra.id,
                  file_id: fileData?.id,
                });
                if (newVolume) {
                  newVolumes.push({
                    id: newVolume.id,
                    code,
                    name,
                    created_at: new Date(),
                    sutras_id: sutra.id,
                    sutra: sutra,
                    file_id: fileData?.id,
                    file: fileData || undefined,
                  });
                }
              }
              onProgress?.((index + 1) / files.length);
            } catch (error) {
              getVolumesApi.setData([
                ...(getVolumesApi.data || []),
                ...newVolumes,
              ]);
              throw error;
            }
          }
          getVolumesApi.setData([...(getVolumesApi.data || []), ...newVolumes]);
        }
      } catch (error) {
        throw error;
      }
    },
    [getVolumesApi, sutra]
  );

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
            (volume) => !ids.includes(volume.id)
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

        createVolumesByFile,
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
