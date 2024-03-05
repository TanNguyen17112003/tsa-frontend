import { Orison, OrisonDetail, OrisonEditor } from "src/types/orison";
import {
  apiGet,
  apiPost,
  apiDelete,
  apiPatch,
  getFormData,
} from "src/utils/api-request";

export class OrisonsApi {
  static async postOrison(request: Omit<OrisonEditor, "id">): Promise<Orison> {
    return await apiPost("/orisons", request);
  }

  static async getOrisons(request: GetOrisonPayload): Promise<OrisonDetail[]> {
    const response = await apiGet("/orisons", getFormData(request));
    return response;
  }

  static async putOrisons(request: Partial<Orison & Pick<Orison, "id">>) {
    return await apiPatch(`/orisons/${request.id}`, request);
  }

  static async deleteOrison(ids: Orison["id"][]) {
    return await apiDelete(`/orisons`, { ids });
  }
}

export interface GetOrisonPayload {
  volume_id: string;
}
