
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { FormatPagesApi } from "src/api/format-pages";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { FormatPage, FormatPageDetail } from "src/types/format-page";

interface ContextValue {
  getFormatPagesApi: UseFunctionReturnType<FormData, FormatPageDetail[]>;

  createFormatPage: (requests: Omit<FormatPageDetail, "id">) => Promise<void>;
  updateFormatPage: (FormatPage: Partial<FormatPageDetail>) => Promise<void>;
  deleteFormatPage: (ids: FormatPage["id"][]) => Promise<void>;
}

export const FormatPagesContext = createContext<ContextValue>({
  getFormatPagesApi: DEFAULT_FUNCTION_RETURN,

  createFormatPage: async () => {},
  updateFormatPage: async () => {},
  deleteFormatPage: async () => {},
});

const FormatPagesProvider = ({ children }: { children: ReactNode }) => {
  const getFormatPagesApi = useFunction(FormatPagesApi.getFormatPages);

  const createFormatPage = useCallback(
    async (request: Omit<FormatPageDetail, "id">) => {
      try {
        const id = await FormatPagesApi.postFormatPage(request);
        if (id) {
          const newFormatPages: FormatPageDetail[] = [
            {
              ...request,
              id: id,
            },
            ...(getFormatPagesApi.data || []),
          ];
          getFormatPagesApi.setData(newFormatPages);
        }
      } catch (error) {
        throw error;
      }
    },
    [getFormatPagesApi]
  );

  const updateFormatPage = useCallback(
    async (FormatPage: Partial<FormatPage>) => {
      try {
        await FormatPagesApi.putFormatPages(FormatPage);
        getFormatPagesApi.setData(
          (getFormatPagesApi.data || []).map((c) =>
            c.id == FormatPage.id ? Object.assign(c, FormatPage) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getFormatPagesApi]
  );

  const deleteFormatPage = useCallback(
    async (ids: FormatPage["id"][]) => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) => FormatPagesApi.deleteFormatPage(id))
        );
        getFormatPagesApi.setData([
          ...(getFormatPagesApi.data || []).filter(
            (FormatPage) =>
              !results.find(
                (result, index) =>
                  result.status == "fulfilled" && ids[index] == FormatPage.id
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
    [getFormatPagesApi]
  );

  useEffect(() => {
    getFormatPagesApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormatPagesContext.Provider
      value={{
        getFormatPagesApi,

        createFormatPage,
        updateFormatPage,
        deleteFormatPage,
      }}
    >
      {children}
    </FormatPagesContext.Provider>
  );
};

export const useFormatPagesContext = () => useContext(FormatPagesContext);

export default FormatPagesProvider;
