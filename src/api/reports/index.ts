
import { Report, ReportDetail } from "src/types/report";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class ReportsApi {
  static async postReports(request: Omit<Report, "id">): Promise<Report["id"]> {
    return await apiPost("/reports", request);
  }

  static async getReports(request: FormData): Promise<ReportDetail[]> {
    const response = await apiGet("/reports", request);
    return response;
  }

  static async getReportById(request: string): Promise<ReportDetail[]> {
    const response = await apiGet(`/reports/${request}`);
    return response;
  }

  static async putReports(request: Partial<Report & Pick<Report, "id">>) {
    return await apiPatch(`/reports/${request.id}`, request);
  }

  static async deleteReport(id: Report["id"]) {
    return await apiDelete(`/reports/${id}`, { id });
  }
}
