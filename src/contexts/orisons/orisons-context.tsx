
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { OrisonsApi } from "src/api/orisons";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Orison, OrisonDetail } from "src/types/orison";

interface ContextValue {
  getOrisonsApi: UseFunctionReturnType<FormData, OrisonDetail[]>;

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
  const getOrisonsApi = useFunction(OrisonsApi.getOrisons);

  const createOrison = useCallback(
    async (request: Omit<OrisonDetail, "id">) => {
      try {
        const id = await OrisonsApi.postOrison(request);
        if (id) {
          const newOrisons: OrisonDetail[] = [
            {
              ...request,
              id: id,
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
        const results = await Promise.allSettled(
          ids.map((id) => OrisonsApi.deleteOrison(id))
        );
        getOrisonsApi.setData([
          ...(getOrisonsApi.data || []).filter(
            (Orison) =>
              !results.find(
                (result, index) =>
                  result.status == "fulfilled" && ids[index] == Orison.id
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
    [getOrisonsApi]
  );

  useEffect(() => {
    getOrisonsApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrisonsContext.Provider
      value={{
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
