import { EditRequest, EditRequestDetail } from "src/types/edit-request";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class EditRequestsApi {
  static async postEditRequest(
    request: Omit<EditRequest, "id">
  ): Promise<number> {
    return await apiPost("/edit_requests", request);
  }

  static async getEditRequests(
    request: FormData
  ): Promise<EditRequestDetail[]> {
    const response = await apiGet("/edit_requests", request);
    return response;
  }

  static async putEditRequests(
    request: Partial<EditRequest & Pick<EditRequest, "id">>
  ) {
    return await apiPatch(`/edit_requests/${request.id}`, request);
  }

  static async approveEditRequests(request: {
    id: EditRequest["id"];
    approved: boolean;
  }) {
    return await apiPost(`/edit_requests/${request.id}/approve`, request);
  }

  static async deleteEditRequest(id: EditRequest["id"]) {
    return await apiDelete(`/edit_requests/${id}`, { id });
  }
}
