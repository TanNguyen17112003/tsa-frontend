import { CancelRequest, CancelRequestDetail } from "src/types/cancel-request";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class CancelRequestsApi {
  static async postCancelRequest(
    request: Omit<CancelRequest, "id">
  ): Promise<number> {
    return await apiPost("/cancel_requests", request);
  }

  static async getCancelRequests(
    request: FormData
  ): Promise<CancelRequestDetail[]> {
    const response = await apiGet("/cancel_requests", request);
    return response;
  }

  static async putCancelRequests(
    request: Partial<CancelRequest & Pick<CancelRequest, "id">>
  ) {
    return await apiPost(`/cancel_requests/${request.id}/approve`, request);
  }

  static async approveCancelRequests(request: {
    id: CancelRequest["id"];
    approved: boolean;
  }): Promise<{ status: string }> {
    return await apiPost(`/cancel_requests/${request.id}/approve`, request);
  }

  static async deleteCancelRequest(id: CancelRequest["id"]) {
    return await apiDelete(`/cancel_requests/${id}`, { id });
  }
}
