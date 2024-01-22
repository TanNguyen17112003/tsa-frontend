import { Scale, ScaleDetail } from "src/types/scale";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class ScalesApi {
  static async postScale(request: Omit<Scale, "id">): Promise<number> {
    return await apiPost("/scales", request);
  }

  static async getScales(request: FormData): Promise<ScaleDetail[]> {
    const response = await apiGet("/scales", request);
    return response;
  }

  static async putScales(request: Partial<Scale & Pick<Scale, "id">>) {
    return await apiPatch(`/scales/${request.id}`, request);
  }

  static async deleteScale(id: number) {
    return await apiDelete(`/scales/${id}`, { id });
  }
}
