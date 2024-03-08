import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { CircasApi } from "src/api/circas";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Circa, CircaDetail } from "src/types/circas";

interface ContextValue {
  getCircasApi: UseFunctionReturnType<FormData, CircaDetail[]>;

  createCirca: (requests: Omit<CircaDetail, "id">) => Promise<void>;
  updateCirca: (Circa: Partial<CircaDetail>) => Promise<void>;
  deleteCirca: (ids: Circa["id"][]) => Promise<void>;
}

export const CircasContext = createContext<ContextValue>({
  getCircasApi: DEFAULT_FUNCTION_RETURN,

  createCirca: async () => {},
  updateCirca: async () => {},
  deleteCirca: async () => {},
});

const CircasProvider = ({ children }: { children: ReactNode }) => {
  const getCircasApi = useFunction(CircasApi.getCircas);

  const createCirca = useCallback(
    async (request: Omit<CircaDetail, "id">) => {
      try {
        const id = await CircasApi.postCirca(request);
        if (id) {
          const newCircas: CircaDetail[] = [
            {
              ...request,
              id: id,
            },
            ...(getCircasApi.data || []),
          ];
          getCircasApi.setData(newCircas);
        }
      } catch (error) {
        throw error;
      }
    },
    [getCircasApi]
  );

  const updateCirca = useCallback(
    async (Circa: Partial<Circa>) => {
      try {
        await CircasApi.putCircas(Circa);
        getCircasApi.setData(
          (getCircasApi.data || []).map((c) =>
            c.id == Circa.id ? Object.assign(c, Circa) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getCircasApi]
  );

  const deleteCirca = useCallback(
    async (ids: Circa["id"][]) => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) => CircasApi.deleteCirca(id))
        );
        getCircasApi.setData([
          ...(getCircasApi.data || []).filter(
            (Circa) =>
              !results.find(
                (result, index) =>
                  result.status == "fulfilled" && ids[index] == Circa.id
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
    [getCircasApi]
  );

  useEffect(() => {
    getCircasApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CircasContext.Provider
      value={{
        getCircasApi,

        createCirca,
        updateCirca,
        deleteCirca,
      }}
    >
      {children}
    </CircasContext.Provider>
  );
};

export const useCircasContext = () => useContext(CircasContext);

export default CircasProvider;
