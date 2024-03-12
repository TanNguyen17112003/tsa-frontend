import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { ReportsApi } from "src/api/reports";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Report, ReportDetail } from "src/types/report";

interface ContextValue {
  getReportsApi: UseFunctionReturnType<FormData, ReportDetail[]>;

  createReport: (requests: Omit<ReportDetail, "id">) => Promise<void>;
  updateReport: (Report: Partial<ReportDetail>) => Promise<void>;
  deleteReport: (ids: Report["id"][]) => Promise<void>;
}

export const ReportsContext = createContext<ContextValue>({
  getReportsApi: DEFAULT_FUNCTION_RETURN,

  createReport: async () => {},
  updateReport: async () => {},
  deleteReport: async () => {},
});

const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const getReportsApi = useFunction(ReportsApi.getReports);

  const createReport = useCallback(
    async (request: Omit<ReportDetail, "id">) => {
      try {
        const id = await ReportsApi.postReports(request);
        if (id) {
          const newReports: ReportDetail[] = [
            {
              ...request,
              id: id,
            },
            ...(getReportsApi.data || []),
          ];
          getReportsApi.setData(newReports);
        }
      } catch (error) {
        throw error;
      }
    },
    [getReportsApi]
  );

  const updateReport = useCallback(
    async (Report: Partial<Report>) => {
      try {
        await ReportsApi.putReports(Report);
        getReportsApi.setData(
          (getReportsApi.data || []).map((c) =>
            c.id == Report.id ? Object.assign(c, Report) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getReportsApi]
  );

  const deleteReport = useCallback(
    async (ids: Report["id"][]) => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) => ReportsApi.deleteReport(id))
        );
        getReportsApi.setData([
          ...(getReportsApi.data || []).filter(
            (Report) =>
              !results.find(
                (result, index) =>
                  result.status == "fulfilled" && ids[index] == Report.id
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
    [getReportsApi]
  );

  useEffect(() => {
    getReportsApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReportsContext.Provider
      value={{
        getReportsApi,

        createReport,
        updateReport,
        deleteReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = () => useContext(ReportsContext);

export default ReportsProvider;
