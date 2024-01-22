import { ApiAction } from "src/types/api-action";
import { apiGet, apiPost, apiPut, apiDelete } from "src/utils/api-request";

export class ApiActionsApi {
  static async postApiAction(
    request: Omit<ApiAction, "id">
  ): Promise<{ id: string }> {
    return await apiPost("/api_actions", request);
  }

  static async getApiActions(request: FormData): Promise<ApiAction[]> {
    const response = await apiGet("/api_actions", request);
    return response;
  }

  static async putApiAction(request: Partial<ApiAction>) {
    return await apiPut(`/api_actions`, request);
  }

  static async deleteApiAction(id: string) {
    return await apiDelete(`/api_actions`, { id });
  }
}
