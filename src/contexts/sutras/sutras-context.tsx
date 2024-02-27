
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { SutrasApi } from "src/api/sutras";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Sutra, SutraDetail } from "src/types/sutra";

interface ContextValue {
  getSutrasApi: UseFunctionReturnType<FormData, SutraDetail[]>;

  createSutra: (requests: Omit<SutraDetail, "id">) => Promise<void>;
  updateSutra: (Sutra: Partial<SutraDetail>) => Promise<void>;
  deleteSutra: (ids: Sutra["id"][]) => Promise<void>;
}

export const SutrasContext = createContext<ContextValue>({
  getSutrasApi: DEFAULT_FUNCTION_RETURN,

  createSutra: async () => {},
  updateSutra: async () => {},
  deleteSutra: async () => {},
});

const SutrasProvider = ({ children }: { children: ReactNode }) => {
  const getSutrasApi = useFunction(SutrasApi.getSutras);

  const createSutra = useCallback(
    async (request: Omit<SutraDetail, "id">) => {
      try {
        const id = await SutrasApi.postSutra(request);
        if (id) {
          const newSutras: SutraDetail[] = [
            {
              ...request,
              id: id,
            },
            ...(getSutrasApi.data || []),
          ];
          getSutrasApi.setData(newSutras);
        }
      } catch (error) {
        throw error;
      }
    },
    [getSutrasApi]
  );

  const updateSutra = useCallback(
    async (Sutra: Partial<Sutra>) => {
      try {
        await SutrasApi.putSutras(Sutra);
        getSutrasApi.setData(
          (getSutrasApi.data || []).map((c) =>
            c.id == Sutra.id ? Object.assign(c, Sutra) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getSutrasApi]
  );

  const deleteSutra = useCallback(
    async (ids: Sutra["id"][]) => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) => SutrasApi.deleteSutra(id))
        );
        getSutrasApi.setData([
          ...(getSutrasApi.data || []).filter(
            (Sutra) =>
              !results.find(
                (result, index) =>
                  result.status == "fulfilled" && ids[index] == Sutra.id
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
    [getSutrasApi]
  );

  useEffect(() => {
    getSutrasApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SutrasContext.Provider
      value={{
        getSutrasApi,

        createSutra,
        updateSutra,
        deleteSutra,
      }}
    >
      {children}
    </SutrasContext.Provider>
  );
};

export const useSutrasContext = () => useContext(SutrasContext);

export default SutrasProvider;
