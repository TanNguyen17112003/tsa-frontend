import { UsePaginationResult } from '@hooks';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
  ChangeEvent,
  useState
} from 'react';
import { ReportResponse, ReportsApi } from 'src/api/reports';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import usePagination from 'src/hooks/use-pagination';
import { Report, ReportDetail, ReportStatus } from 'src/types/report';

export type ReportFilter = {
  status?: ReportStatus;
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  sortOrder?: 'asc' | 'desc';
  page?: number;
  sortBy?: string;
};

interface ContextValue {
  getReportsApi: UseFunctionReturnType<FormData, ReportResponse>;
  reportPagination: UsePaginationResult;
  reportFilter: ReportFilter;
  setReportFilter: (reportFilter: ReportFilter) => void;
  createReport: (requests: Omit<ReportDetail, 'id'>) => Promise<void>;
  updateReport: (Report: Partial<ReportDetail>, id: string) => Promise<void>;
  deleteReport: (ids: Report['id']) => Promise<void>;
}

export const ReportsContext = createContext<ContextValue>({
  getReportsApi: DEFAULT_FUNCTION_RETURN,
  reportPagination: {
    count: 0,
    page: 0,
    rowsPerPage: 10,
    totalPages: 0,
    onPageChange: function (event: any, newPage: number): void {
      throw new Error('Function not implemented.');
    },
    onRowsPerPageChange: function (
      event: number | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void {
      throw new Error('Function not implemented.');
    }
  },
  reportFilter: {},
  setReportFilter: () => {},
  createReport: async () => {},
  updateReport: async () => {},
  deleteReport: async () => {}
});

const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const getReportsApi = useFunction(ReportsApi.getReports, {
    disableResetOnCall: true
  });

  const [reportFilter, setReportFilter] = useState<ReportFilter>({
    sortOrder: 'asc'
  });

  const reportPagination = usePagination({
    count: getReportsApi.data?.totalElements || 0
  });

  const createReport = useCallback(
    async (request: Omit<ReportDetail, 'id'>) => {
      try {
        const report = await ReportsApi.postReports(request);
        if (report) {
          getReportsApi.setData({
            ...getReportsApi.data,
            results: [...(getReportsApi.data?.results || []), report],
            totalElements: (getReportsApi.data?.totalElements || 0) + 1,
            totalPages: Math.ceil(
              (getReportsApi.data?.totalElements || 0) / reportPagination.rowsPerPage
            )
          });
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
        getReportsApi.setData({
          ...getReportsApi.data,
          results: (getReportsApi.data?.results || []).map((report) =>
            report.id === id ? { ...report, ...Report } : report
          ),
          totalElements: getReportsApi.data?.totalElements || 0,
          totalPages: getReportsApi.data?.totalPages || 0
        });
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
        const formData = new FormData();
        Object.entries(reportFilter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'dateRange') {
              if (
                typeof value === 'object' &&
                value !== null &&
                'startDate' in value &&
                'endDate' in value
              ) {
                if (value.startDate) {
                  formData.append('startDate', value.startDate.toISOString());
                }
                if (value.endDate) {
                  formData.append('endDate', value.endDate.toISOString());
                }
              }
            } else {
              formData.append(key, value.toString());
            }
          }
        });
        await getReportsApi.call(formData);
      } catch (error) {
        throw error;
      }
    },
    [getReportsApi, reportFilter]
  );

  useEffect(() => {
    const formData = new FormData();
    Object.entries(reportFilter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'dateRange') {
          if (
            typeof value === 'object' &&
            value !== null &&
            'startDate' in value &&
            'endDate' in value
          ) {
            if (value.startDate) {
              formData.append('startDate', value.startDate.toISOString());
            }
            if (value.endDate) {
              formData.append('endDate', value.endDate.toISOString());
            }
          }
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    getReportsApi.call(formData);
  }, [reportFilter]);

  return (
    <ReportsContext.Provider
      value={{
        getReportsApi,
        reportPagination,
        reportFilter,
        setReportFilter,
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
