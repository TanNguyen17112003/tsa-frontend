import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { FormatSutrasApi } from "src/api/format-sutras";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { FormatSutra, FormatSutraDetail } from "src/types/format-sutra";

interface ContextValue {
  getFormatSutrasApi: UseFunctionReturnType<FormData, FormatSutraDetail[]>;

  createFormatSutra: (requests: Omit<FormatSutraDetail, "id">) => Promise<void>;
  updateFormatSutra: (FormatSutra: Partial<FormatSutraDetail>) => Promise<void>;
  deleteFormatSutra: (ids: FormatSutra["id"][]) => Promise<void>;
}

export const FormatSutrasContext = createContext<ContextValue>({
  getFormatSutrasApi: DEFAULT_FUNCTION_RETURN,

  createFormatSutra: async () => {},
  updateFormatSutra: async () => {},
  deleteFormatSutra: async () => {},
});

const FormatSutrasProvider = ({ children }: { children: ReactNode }) => {
  const getFormatSutrasApi = useFunction(FormatSutrasApi.getFormatSutras);

  const createFormatSutra = useCallback(
    async (request: Omit<FormatSutraDetail, "id">) => {
      try {
        const id = await FormatSutrasApi.postFormatSutra(request);
        if (id) {
          const newFormatSutras: FormatSutraDetail[] = [
            {
              ...request,
              id: id.id,
            },
            ...(getFormatSutrasApi.data || []),
          ];
          getFormatSutrasApi.setData(newFormatSutras);
        }
      } catch (error) {
        throw error;
      }
    },
    [getFormatSutrasApi]
  );

  const updateFormatSutra = useCallback(
    async (FormatSutra: Partial<FormatSutra>) => {
      try {
        await FormatSutrasApi.putFormatSutras(FormatSutra);
        getFormatSutrasApi.setData(
          (getFormatSutrasApi.data || []).map((c) =>
            c.id == FormatSutra.id ? Object.assign(c, FormatSutra) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getFormatSutrasApi]
  );

  const deleteFormatSutra = useCallback(
    async (ids: FormatSutra["id"][]) => {
      try {
        FormatSutrasApi.deleteFormatSutra(ids);
        getFormatSutrasApi.setData([
          ...(getFormatSutrasApi.data || []).filter(
            (FormatSutra) => !ids.includes(FormatSutra.id)
          ),
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getFormatSutrasApi]
  );

  useEffect(() => {
    getFormatSutrasApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormatSutrasContext.Provider
      value={{
        getFormatSutrasApi,

        createFormatSutra,
        updateFormatSutra,
        deleteFormatSutra,
      }}
    >
      {children}
    </FormatSutrasContext.Provider>
  );
};

export const useFormatSutrasContext = () => useContext(FormatSutrasContext);

export default FormatSutrasProvider;
