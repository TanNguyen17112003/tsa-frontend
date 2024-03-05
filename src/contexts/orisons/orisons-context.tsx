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
import { convertDocx2Editor } from "src/modules/Editor/utils";
import { initialSutra } from "src/types/sutra";

interface ContextValue {
  volume?: VolumeDetail;
  getOrisonsApi: UseFunctionReturnType<GetOrisonPayload, OrisonDetail[]>;

  createOrisonsByFile: (
    files: File[],
    onProgress?: (value: number) => void
  ) => Promise<void>;
  createOrison: (
    requests: Omit<OrisonDetail, "id"> & { file: File }
  ) => Promise<void>;
  updateOrison: (Orison: Partial<OrisonDetail>) => Promise<void>;
  deleteOrison: (ids: Orison["id"][]) => Promise<void>;
}

export const OrisonsContext = createContext<ContextValue>({
  getOrisonsApi: DEFAULT_FUNCTION_RETURN,

  createOrisonsByFile: async () => {},
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

  const createOrisonsByFile = useCallback(
    async (files: File[], onProgress?: (value: number) => void) => {
      try {
        if (volume) {
          const newOrisons: OrisonDetail[] = [];
          for (let index = 0; index < files.length; index++) {
            try {
              const file = files[index];
              const [code, name] = file.name.split(".")[0]?.split("_");
              if (!code || !name) {
                throw new Error(`Tên file ${file.name} sai cấu trúc`);
              }
              const { blocks, notes, plainText } = await convertDocx2Editor(
                file
              );
              const newOrison = await OrisonsApi.postOrison({
                code,
                name,
                volume_id: volume.id,
                content: blocks,
                plain_text: plainText,
                notes: notes.map((note, index) => ({
                  ...note,
                  num: index + 1,
                })),
              });
              newOrisons.push({
                ...newOrison,
                code,
                name,
                sutra: initialSutra,
              });

              onProgress?.((index + 1) / files.length);
            } catch (error) {
              getOrisonsApi.setData([
                ...(getOrisonsApi.data || []),
                ...newOrisons,
              ]);
              throw error;
            }
          }
          getOrisonsApi.setData([...(getOrisonsApi.data || []), ...newOrisons]);
        }
      } catch (error) {
        throw error;
      }
    },
    [getOrisonsApi, volume]
  );

  const createOrison = useCallback(
    async (request: Omit<OrisonDetail, "id"> & { file: File }) => {
      try {
        const { blocks, notes, plainText } = await convertDocx2Editor(
          request.file
        );
        const orison = await OrisonsApi.postOrison({
          ...request,
          content: blocks,
          notes: notes.map((note, index) => ({
            ...note,
            num: index + 1,
          })),
          plain_text: plainText,
        });
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

        createOrisonsByFile,
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
