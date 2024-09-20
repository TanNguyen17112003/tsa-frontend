import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import { ReportDetail, Report } from 'src/types/report';

export class ReportsApi {
  static async postReports(request: Partial<Omit<ReportDetail, 'id'>>): Promise<ReportDetail> {
    return await apiPost('/reports', request);
  }
  static async getReports(request: {}): Promise<ReportDetail[]> {
    const response = await apiGet('/reports', getFormData(request));
    return response;
  }

  static async getReportById(id: Report['id']): Promise<ReportDetail> {
    return await apiGet(`/reports/${id}`);
  }
  static async putReport(request: Partial<Report & Pick<Report, 'id'>>): Promise<ReportDetail> {
    return await apiPatch('/reports/' + request.id, request);
  }

  static async deleteReport(id: Report['id']) {
    return await apiDelete(`/reports/${id}`, {});
  }
}
