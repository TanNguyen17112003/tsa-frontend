import { createContext, ReactNode, useCallback, useEffect, useContext } from 'react';
import { ReportsApi } from 'src/api/reports';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { Report, ReportDetail } from 'src/types/report';

interface ContextValue {
  getReportsApi: UseFunctionReturnType<FormData, ReportDetail[]>;

  createReport: (requests: Omit<ReportDetail, 'id'>) => Promise<void>;
  updateReport: (Report: Partial<ReportDetail>, id: string) => Promise<void>;
  deleteReport: (ids: Report['id']) => Promise<void>;
}

export const ReportsContext = createContext<ContextValue>({
  getReportsApi: DEFAULT_FUNCTION_RETURN,

  createReport: async () => {},
  updateReport: async () => {},
  deleteReport: async () => {}
});

const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const getReportsApi = useFunction(ReportsApi.getReports);

  const createReport = useCallback(
    async (request: Omit<ReportDetail, 'id'>) => {
      try {
        const user = await ReportsApi.postReports(request);
        if (user) {
          const newOrders: ReportDetail[] = [
            {
              ...request,
              id: user.id
            },
            ...(getReportsApi.data || [])
          ];
          getReportsApi.setData(newOrders);
        }
      } catch (error) {
        throw error;
      }
    },
    [getReportsApi]
  );

  const updateReport = useCallback(
    async (Report: Partial<Report>, id: string) => {
      try {
        await ReportsApi.putReport(Report, id);
        getReportsApi.setData(
          (getReportsApi.data || []).map((c) => (c.id == id ? Object.assign(c, Report) : c))
        );
      } catch (error) {
        throw error;
      }
    },
    [getReportsApi]
  );

  const deleteReport = useCallback(
    async (id: Report['id']) => {
      try {
        await ReportsApi.deleteReport(id);
        getReportsApi.setData((getReportsApi.data || []).filter((order) => order.id !== id));
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
        deleteReport
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = () => useContext(ReportsContext);

export default ReportsProvider;
