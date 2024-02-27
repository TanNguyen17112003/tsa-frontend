
import { Orison, OrisonDetail } from "src/types/orison";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class OrisonsApi {
  static async postOrison(request: Omit<Orison, "id">): Promise<Orison["id"]> {
    return await apiPost("/orisons", request);
  }

  static async getOrisons(request: FormData): Promise<OrisonDetail[]> {
    const response = await apiGet("/orisons", request);
    return response;
  }

  static async putOrisons(
    request: Partial<Orison & Pick<Orison, "id">>
  ) {
    return await apiPatch(`/orisons/${request.id}`, request);
  }

  static async deleteOrison(id: Orison['id']) {
    return await apiDelete(`/orisons/${id}`, { id });
  }
}
