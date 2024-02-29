import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { GetSutrasPayload, SutrasApi } from "src/api/sutras";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Sutra, SutraDetail } from "src/types/sutra";

interface ContextValue {
  getSutrasApi: UseFunctionReturnType<GetSutrasPayload, SutraDetail[]>;

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
        await SutrasApi.deleteSutra(ids);
        getSutrasApi.setData([
          ...(getSutrasApi.data || []).filter(
            (sutra) => !ids.includes(sutra.id)
          ),
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getSutrasApi]
  );

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
