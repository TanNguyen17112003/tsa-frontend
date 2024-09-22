import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import { ReportDetail, Report, ReportFormProps } from 'src/types/report';

export class ReportsApi {
  static async postReports(request: ReportFormProps): Promise<ReportDetail> {
    return await apiPost('/reports', request);
  }
  static async getReports(request: {}): Promise<ReportDetail[]> {
    const response = await apiGet('/reports', getFormData(request));
    return response;
  }

  static async getReportById(id: Report['id']): Promise<ReportDetail> {
    return await apiGet(`/reports/${id}`);
  }
  static async putReport(request: Partial<Report>, id: string): Promise<ReportDetail> {
    return await apiPatch('/reports/' + id, request);
  }

  static async deleteReport(id: Report['id']) {
    return await apiDelete(`/reports/${id}`, {});
  }
}
