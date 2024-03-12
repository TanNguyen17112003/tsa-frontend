import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { FormatWordsApi } from "src/api/format-words";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { FormatWord, FormatWordDetail } from "src/types/format-word";

interface ContextValue {
  getFormatWordsApi: UseFunctionReturnType<FormData, FormatWordDetail[]>;

  createFormatWord: (requests: Omit<FormatWordDetail, "id">) => Promise<void>;
  updateFormatWord: (FormatWord: Partial<FormatWordDetail>) => Promise<void>;
  deleteFormatWord: (ids: FormatWord["id"][]) => Promise<void>;
}

export const FormatWordsContext = createContext<ContextValue>({
  getFormatWordsApi: DEFAULT_FUNCTION_RETURN,

  createFormatWord: async () => {},
  updateFormatWord: async () => {},
  deleteFormatWord: async () => {},
});

const FormatWordsProvider = ({ children }: { children: ReactNode }) => {
  const getFormatWordsApi = useFunction(FormatWordsApi.getFormatWords);

  const createFormatWord = useCallback(
    async (request: Omit<FormatWordDetail, "id">) => {
      try {
        const id = await FormatWordsApi.postFormatWord(request);
        if (id) {
          const newFormatWords: FormatWordDetail[] = [
            {
              ...request,
              id: id.id,
            },
            ...(getFormatWordsApi.data || []),
          ];
          getFormatWordsApi.setData(newFormatWords);
        }
      } catch (error) {
        throw error;
      }
    },
    [getFormatWordsApi]
  );

  const updateFormatWord = useCallback(
    async (FormatWord: Partial<FormatWord>) => {
      try {
        await FormatWordsApi.putFormatWords(FormatWord);
        getFormatWordsApi.setData(
          (getFormatWordsApi.data || []).map((c) =>
            c.id == FormatWord.id ? Object.assign(c, FormatWord) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getFormatWordsApi]
  );

  const deleteFormatWord = useCallback(
    async (ids: FormatWord["id"][]) => {
      try {
        FormatWordsApi.deleteFormatWord(ids);
        getFormatWordsApi.setData([
          ...(getFormatWordsApi.data || []).filter(
            (FormatWord) => !ids.includes(FormatWord.id)
          ),
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getFormatWordsApi]
  );

  useEffect(() => {
    getFormatWordsApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormatWordsContext.Provider
      value={{
        getFormatWordsApi,

        createFormatWord,
        updateFormatWord,
        deleteFormatWord,
      }}
    >
      {children}
    </FormatWordsContext.Provider>
  );
};

export const useFormatWordsContext = () => useContext(FormatWordsContext);

export default FormatWordsProvider;
